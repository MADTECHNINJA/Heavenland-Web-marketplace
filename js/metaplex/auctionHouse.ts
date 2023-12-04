import { logger } from '~/plugins/logger.client';
import { useWallet } from 'solana-wallets-vue';
import * as web3 from '@solana/web3.js';
import { Metadata, WRAPPED_SOL_MINT } from '~/js/metaplex/types';
import * as anchor from '@project-serum/anchor';
import {
    decodeMetadata,
    getAtaForMint,
    getAuctionHouseBuyerEscrow,
    getAuctionHouseProgramAsSigner,
    getAuctionHouseTradeState,
    getMetadata,
    getPriceWithMantissa,
    getTokenAmount,
} from '~/js/metaplex/utils';
import {
    createBuyInstruction,
    createCancelInstruction,
    createExecuteSaleInstruction,
    createSellInstruction,
    createDepositInstruction,
    createWithdrawInstruction,
} from '@metaplex-foundation/mpl-auction-house/dist/src/generated/instructions';
import { AuctionHouse as mAuctionHouse } from '@metaplex-foundation/mpl-auction-house/dist/src/generated';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, programs } from '@metaplex/js';
import { ComputedRef } from 'vue';

export class AuctionHouse {
    static readonly TOKEN_SIZE = 1;

    connection?: ComputedRef<Connection>;
    auctionHouseKey: web3.PublicKey;

    constructor(connection: ComputedRef<Connection>) {
        this.connection = connection;
        this.auctionHouseKey = new web3.PublicKey(import.meta.env.VITE_HL_AUCTION_HOUSE);
    }

    showEscrow = async (walletPk: web3.PublicKey) => {
        logger.info('[AUCTION_HOUSE] Show escrow');

        if (!walletPk) {
            throw new Error('missing: walletPk');
        }

        const auctionHouse = await mAuctionHouse.fromAccountAddress(this.connection.value, this.auctionHouseKey);
        try {
            const escrow = await getAuctionHouseBuyerEscrow(this.auctionHouseKey, walletPk);

            if (!escrow.length) {
                return null;
            }

            const escrowBalance = await getTokenAmount(this.connection.value, escrow[0], auctionHouse.treasuryMint);

            logger.info('[AUCTION_HOUSE] Escrow balance for wallet', escrowBalance);

            return escrowBalance;
        } catch (e) {
            logger.info('[AUCTION_HOUSE] This wallet account has not been created yet for escrow');
        }
    };

    #createDepositTransaction = async (
        amount: number
    ): Promise<{ depositInstructions: web3.TransactionInstruction[]; depositSigners?: web3.Keypair[] }> => {
        logger.info('[AUCTION_HOUSE] Deposit to escrow', amount);

        const auctionHouse = await mAuctionHouse.fromAccountAddress(this.connection.value, this.auctionHouseKey);
        const { publicKey } = useWallet();

        const amountAdjusted = await getPriceWithMantissa(
            this.connection.value,
            amount,
            auctionHouse.treasuryMint,
            publicKey.value
        );

        const [escrowPaymentAccount, bump] = await getAuctionHouseBuyerEscrow(this.auctionHouseKey, publicKey.value);

        const isNative = auctionHouse.treasuryMint.equals(WRAPPED_SOL_MINT);

        const ata = await getAtaForMint(auctionHouse.treasuryMint, publicKey.value);

        const transferAuthority = web3.Keypair.generate();
        const signers = isNative ? [] : [transferAuthority];

        const instruction = await createDepositInstruction(
            {
                auctionHouse: this.auctionHouseKey,
                auctionHouseFeeAccount: auctionHouse.auctionHouseFeeAccount,
                treasuryMint: auctionHouse.treasuryMint,
                authority: auctionHouse.authority,
                wallet: publicKey.value,
                escrowPaymentAccount,
                transferAuthority: isNative ? web3.SystemProgram.programId : transferAuthority.publicKey,
                paymentAccount: isNative ? publicKey.value : ata,
            },
            {
                amount: new anchor.BN(amountAdjusted),
                escrowPaymentBump: bump,
            }
        );

        if (!isNative) {
            instruction.keys
                .filter((k) => k.pubkey.equals(transferAuthority.publicKey))
                .map((k) => (k.isSigner = true));
        }

        const instructions = [
            ...(isNative
                ? []
                : [
                      Token.createApproveInstruction(
                          TOKEN_PROGRAM_ID,
                          ata,
                          transferAuthority.publicKey,
                          publicKey.value,
                          [],
                          amountAdjusted
                      ),
                  ]),

            instruction,
            ...(isNative ? [] : [Token.createRevokeInstruction(TOKEN_PROGRAM_ID, ata, publicKey.value, [])]),
        ];

        return {
            depositInstructions: instructions,
            depositSigners: signers,
        };
    };

    deposit = async (amount: number) => {
        logger.info('[AUCTION_HOUSE] Depositing HTO', {
            amount,
        });

        const { sendTransaction } = useWallet();
        const transaction = new web3.Transaction();

        const { depositInstructions, depositSigners } = await this.#createDepositTransaction(amount);

        transaction.add(...[...depositInstructions]);

        const txSig = await sendTransaction(transaction, this.connection.value, {
            signers: [...depositSigners],
        });

        logger.info('[AUCTION_HOUSE] Depositing successful with txSig', txSig);
    };

    withdraw = async (amount: number) => {
        const { withdrawInstructions } = await this.#createWithdrawFromEscrowTransaction(amount);
        const { sendTransaction } = useWallet();

        const transaction = new web3.Transaction();
        transaction.add(...withdrawInstructions);

        const txSig = await sendTransaction(transaction, this.connection.value);

        logger.info('[AUCTION_HOUSE] Withdraw from escrow transaction successful', txSig);

        return txSig;
    };

    #createWithdrawFromEscrowTransaction = async (
        amount
    ): Promise<{ withdrawInstructions: web3.TransactionInstruction[] }> => {
        logger.info('[AUCTION_HOUSE] Withdraw from escrow', amount);

        const auctionHouse = await mAuctionHouse.fromAccountAddress(this.connection.value, this.auctionHouseKey);
        const { publicKey } = useWallet();

        const amountAdjusted = await getPriceWithMantissa(
            this.connection.value,
            amount,
            auctionHouse.treasuryMint,
            publicKey.value
        );

        const [escrowPaymentAccount, bump] = await getAuctionHouseBuyerEscrow(this.auctionHouseKey, publicKey.value);

        const isNative = auctionHouse.treasuryMint.equals(WRAPPED_SOL_MINT);

        const ata = await getAtaForMint(auctionHouse.treasuryMint, publicKey.value);

        const instruction = createWithdrawInstruction(
            {
                auctionHouse: this.auctionHouseKey,
                auctionHouseFeeAccount: auctionHouse.auctionHouseFeeAccount,
                treasuryMint: auctionHouse.treasuryMint,
                authority: auctionHouse.authority,
                wallet: publicKey.value,
                escrowPaymentAccount,
                receiptAccount: isNative ? publicKey.value : ata,
            },
            {
                amount: new anchor.BN(amountAdjusted),
                escrowPaymentBump: bump,
            }
        );

        instruction.keys.filter((k) => k.pubkey.equals(publicKey.value)).map((k) => (k.isSigner = true));

        return {
            withdrawInstructions: [instruction],
        };
    };

    bid = async (itemMint: string, sellerWallet: string, buyPrice: number) => {
        try {
            logger.info('[AUCTION_HOUSE] Purchasing item', {
                itemMint,
                buyPrice,
                sellerWallet,
            });

            const { sendTransaction } = useWallet();

            const { buyInstructions, buySigners } = await this.#createBuyItemInstruction({
                itemMint,
                buyPrice,
                sellerWallet,
            });

            logger.info('[AUCTION_HOUSE] Created buy item instruction', buyInstructions);

            const { depositInstructions, depositSigners } = await this.#createDepositTransaction(buyPrice);

            const transaction = new web3.Transaction();
            transaction.add(...[...depositInstructions, ...buyInstructions]);

            const txSig = await sendTransaction(transaction, this.connection.value, {
                signers: [...buySigners, ...depositSigners],
            });

            logger.info('[AUCTION_HOUSE] Item purchased successfully with txSig', txSig, {
                itemMint,
                buyPrice,
                sellerWallet,
            });

            return txSig;
        } catch (e) {
            throw JSON.parse(JSON.stringify(e));
        }
    };

    executeSale = async (itemMint: string, sellerWallet: string, buyPrice: number) => {
        try {
            logger.info('[AUCTION_HOUSE] Purchasing item', {
                itemMint,
                buyPrice,
                sellerWallet,
            });

            const { sendTransaction } = useWallet();

            const { esInstructions, esSigners } = await this.#createExecuteSaleInstruction({
                itemMint,
                buyPrice,
                sellerWallet,
            });

            logger.info('[AUCTION_HOUSE] Created execute sale instruction', esInstructions);

            const transaction = new web3.Transaction();
            transaction.add(...esInstructions);

            const txSig = await sendTransaction(transaction, this.connection.value, {
                signers: [...esSigners],
            });

            logger.info('[AUCTION_HOUSE] Item purchased successfully with txSig', txSig, {
                itemMint,
                buyPrice,
                sellerWallet,
            });

            return txSig;
        } catch (e) {
            throw JSON.parse(JSON.stringify(e));
        }
    };

    #createExecuteSaleInstruction = async ({
        itemMint,
        buyPrice,
        sellerWallet,
    }: {
        itemMint: string;
        buyPrice: number;
        sellerWallet: string;
    }): Promise<{ esInstructions: web3.TransactionInstruction[]; esSigners?: web3.Keypair[] }> => {
        const { publicKey } = useWallet();

        const auctionHouse = await mAuctionHouse.fromAccountAddress(this.connection.value, this.auctionHouseKey);

        const mintKey = new web3.PublicKey(itemMint);

        const buyerWalletKey = new web3.PublicKey(publicKey.value);
        const sellerWalletKey = new web3.PublicKey(sellerWallet);

        const isNative = auctionHouse.treasuryMint.equals(WRAPPED_SOL_MINT);
        const buyPriceAdjusted = new anchor.BN(
            await getPriceWithMantissa(this.connection.value, buyPrice, auctionHouse.treasuryMint, publicKey.value)
        );

        const tokenSizeAdjusted = new anchor.BN(
            await getPriceWithMantissa(this.connection.value, AuctionHouse.TOKEN_SIZE, mintKey, publicKey.value)
        );

        const tokenAccountKey = await getAtaForMint(mintKey, sellerWalletKey);

        const buyerTradeState = (
            await getAuctionHouseTradeState(
                this.auctionHouseKey,
                buyerWalletKey,
                tokenAccountKey,
                auctionHouse.treasuryMint,
                mintKey,
                tokenSizeAdjusted,
                buyPriceAdjusted
            )
        )[0];

        const sellerTradeState = (
            await getAuctionHouseTradeState(
                this.auctionHouseKey,
                sellerWalletKey,
                tokenAccountKey,
                auctionHouse.treasuryMint,
                mintKey,
                tokenSizeAdjusted,
                buyPriceAdjusted
            )
        )[0];

        const [freeTradeState, freeTradeStateBump] = await getAuctionHouseTradeState(
            this.auctionHouseKey,
            sellerWalletKey,
            tokenAccountKey,
            auctionHouse.treasuryMint,
            mintKey,
            tokenSizeAdjusted,
            new anchor.BN(0)
        );

        const [escrowPaymentAccount, bump] = await getAuctionHouseBuyerEscrow(this.auctionHouseKey, buyerWalletKey);
        const [programAsSigner, programAsSignerBump] = await getAuctionHouseProgramAsSigner();
        const metadata = await getMetadata(mintKey);

        const metadataObj = await this.connection.value.getAccountInfo(metadata);
        const metadataDecoded: Metadata = decodeMetadata(Buffer.from(metadataObj.data));

        const remainingAccounts = [];

        for (let i = 0; i < metadataDecoded.data.creators.length; i++) {
            remainingAccounts.push({
                pubkey: new web3.PublicKey(metadataDecoded.data.creators[i].address),
                isWritable: true,
                isSigner: false,
            });
            if (!isNative) {
                remainingAccounts.push({
                    pubkey: await getAtaForMint(
                        auctionHouse.treasuryMint,
                        remainingAccounts[remainingAccounts.length - 1].pubkey
                    ),
                    isWritable: true,
                    isSigner: false,
                });
            }
        }

        const instruction = await createExecuteSaleInstruction(
            {
                buyer: buyerWalletKey,
                seller: sellerWalletKey,
                metadata,
                tokenAccount: tokenAccountKey,
                tokenMint: mintKey,
                escrowPaymentAccount,
                treasuryMint: auctionHouse.treasuryMint,
                sellerPaymentReceiptAccount: await getAtaForMint(auctionHouse.treasuryMint, sellerWalletKey),
                buyerReceiptTokenAccount: await getAtaForMint(mintKey, buyerWalletKey),
                authority: auctionHouse.authority,
                auctionHouse: this.auctionHouseKey,
                auctionHouseFeeAccount: auctionHouse.auctionHouseFeeAccount,
                auctionHouseTreasury: auctionHouse.auctionHouseTreasury,
                sellerTradeState,
                buyerTradeState,
                programAsSigner,
                freeTradeState,
            },
            {
                buyerPrice: buyPriceAdjusted,
                tokenSize: tokenSizeAdjusted,
                freeTradeStateBump,
                programAsSignerBump,
                escrowPaymentBump: bump,
            }
        );

        instruction.keys.filter((k) => k.pubkey.equals(publicKey.value)).map((k) => (k.isSigner = true));
        instruction.keys.push(...remainingAccounts);

        return { esInstructions: [instruction], esSigners: [] };
    };

    #createBuyItemInstruction = async ({
        itemMint,
        sellerWallet,
        buyPrice,
    }: {
        itemMint: string;
        buyPrice: number;
        sellerWallet: string;
    }): Promise<{ buyInstructions: web3.TransactionInstruction[]; buySigners?: web3.Keypair[] }> => {
        const auctionHouse = await mAuctionHouse.fromAccountAddress(this.connection.value, this.auctionHouseKey);

        const { publicKey } = useWallet();
        const mintAta = await getAtaForMint(new web3.PublicKey(itemMint), new web3.PublicKey(sellerWallet));

        const mintKey = new web3.PublicKey(itemMint);

        const buyPriceAdjusted = new anchor.BN(
            await getPriceWithMantissa(this.connection.value, buyPrice, auctionHouse.treasuryMint, publicKey.value)
        );

        const tokenSizeAdjusted = new anchor.BN(
            await getPriceWithMantissa(this.connection.value, AuctionHouse.TOKEN_SIZE, mintKey, publicKey.value)
        );

        const [escrowPaymentAccount, escrowBump] = await getAuctionHouseBuyerEscrow(
            this.auctionHouseKey,
            publicKey.value
        );

        const results = await this.connection.value.getTokenLargestAccounts(mintKey).catch((e) => {
            console.error(e);
            return { value: [] };
        });

        const tokenAccountKey: web3.PublicKey = results.value[0].address;

        const [tradeState, tradeBump] = await getAuctionHouseTradeState(
            this.auctionHouseKey,
            publicKey.value,
            tokenAccountKey,
            auctionHouse.treasuryMint,
            mintKey,
            tokenSizeAdjusted,
            buyPriceAdjusted
        );

        const isNative = auctionHouse.treasuryMint.equals(WRAPPED_SOL_MINT);

        const ata = await getAtaForMint(auctionHouse.treasuryMint, publicKey.value);
        const transferAuthority = web3.Keypair.generate();
        const signers = isNative ? [] : [transferAuthority];
        const mintMetadata = await getMetadata(mintKey);

        const instructions: web3.TransactionInstruction[] = [];
        const instruction = createBuyInstruction(
            {
                auctionHouse: this.auctionHouseKey,
                wallet: publicKey.value,
                treasuryMint: auctionHouse.treasuryMint,
                authority: auctionHouse.authority,
                auctionHouseFeeAccount: auctionHouse.auctionHouseFeeAccount,
                transferAuthority: isNative ? publicKey.value : transferAuthority.publicKey,
                paymentAccount: isNative ? publicKey.value : ata,
                buyerTradeState: tradeState,
                escrowPaymentAccount,
                metadata: mintMetadata,
                tokenAccount: mintAta,
            },
            {
                buyerPrice: buyPriceAdjusted,
                tokenSize: tokenSizeAdjusted,
                tradeStateBump: tradeBump,
                escrowPaymentBump: escrowBump,
            }
        );

        if (!isNative) {
            instruction.keys
                .filter((k) => k.pubkey.equals(transferAuthority.publicKey))
                .map((k) => (k.isSigner = true));
        }

        instructions.push(
            ...[
                ...(isNative
                    ? []
                    : [
                          Token.createApproveInstruction(
                              TOKEN_PROGRAM_ID,
                              ata,
                              transferAuthority.publicKey,
                              publicKey.value,
                              [],
                              buyPriceAdjusted.toNumber()
                          ),
                      ]),

                instruction,
                ...(isNative ? [] : [Token.createRevokeInstruction(TOKEN_PROGRAM_ID, ata, publicKey.value, [])]),
            ]
        );

        return {
            buyInstructions: instructions,
            buySigners: signers,
        };
    };

    cancelListing = async (mint: string, buyPrice: number) => {
        logger.info('[AUCTION_HOUSE] Canceling listing on marketplace', mint, buyPrice);

        const { sendTransaction, publicKey } = useWallet();

        const mintKey = new web3.PublicKey(mint);
        const auctionHouse = await mAuctionHouse.fromAccountAddress(this.connection.value, this.auctionHouseKey);

        const buyPriceAdjusted = new anchor.BN(
            await getPriceWithMantissa(this.connection.value, buyPrice, auctionHouse.treasuryMint, publicKey.value)
        );

        const tokenSizeAdjusted = new anchor.BN(
            await getPriceWithMantissa(this.connection.value, AuctionHouse.TOKEN_SIZE, mintKey, publicKey.value)
        );

        const results = await this.connection.value.getTokenLargestAccounts(mintKey).catch((e) => {
            console.error(e);
            return { value: [] };
        });

        if (results.value.length == 0) {
            throw Error(
                "The Mint(NFT, Tokens) largest token account can't be found, this could be network instability or you have the wrong mint address."
            );
        }

        const tokenAccountKey: web3.PublicKey = results.value[0].address;

        const tradeState = (
            await getAuctionHouseTradeState(
                this.auctionHouseKey,
                publicKey.value,
                tokenAccountKey,
                auctionHouse.treasuryMint,
                mintKey,
                tokenSizeAdjusted,
                buyPriceAdjusted
            )
        )[0];

        const transaction = new web3.Transaction();
        transaction.add(
            await createCancelInstruction(
                {
                    wallet: publicKey.value,
                    auctionHouse: this.auctionHouseKey,
                    auctionHouseFeeAccount: auctionHouse.auctionHouseFeeAccount,
                    tradeState,
                    tokenAccount: tokenAccountKey,
                    tokenMint: mintKey,
                    authority: auctionHouse.authority,
                },
                {
                    buyerPrice: buyPriceAdjusted,
                    tokenSize: tokenSizeAdjusted,
                }
            )
        );

        const txSig = await sendTransaction(transaction, this.connection.value);

        logger.info('[AUCTION_HOUSE] Listing canceled with txSig', txSig);

        return txSig;
    };

    list = async (mint: string, buyPrice: number) => {
        logger.info('[AUCTION_HOUSE] Listing item on marketplace', mint, buyPrice);

        const { sendTransaction, wallet } = useWallet();

        const mintKey = new web3.PublicKey(mint);

        const walletPk = wallet.value.publicKey;

        const tokenAccountKey = await getAtaForMint(new web3.PublicKey(mint), walletPk);

        const auctionHouse = await mAuctionHouse.fromAccountAddress(this.connection.value, this.auctionHouseKey);
        const mintMetadata = await programs.metadata.Metadata.findByMint(this.connection.value, mintKey);

        const buyPriceAdjusted = new anchor.BN(
            await getPriceWithMantissa(this.connection.value, buyPrice, auctionHouse.treasuryMint, walletPk)
        );

        const tokenSizeAdjusted = new anchor.BN(
            await getPriceWithMantissa(this.connection.value, AuctionHouse.TOKEN_SIZE, mintKey, walletPk)
        );

        const [tradeState, tradeBump] = await getAuctionHouseTradeState(
            this.auctionHouseKey,
            walletPk,
            tokenAccountKey,
            auctionHouse.treasuryMint,
            mintKey,
            tokenSizeAdjusted,
            buyPriceAdjusted
        );

        const [freeTradeState, freeTradeBump] = await getAuctionHouseTradeState(
            this.auctionHouseKey,
            walletPk,
            tokenAccountKey,
            auctionHouse.treasuryMint,
            mintKey,
            tokenSizeAdjusted,
            new anchor.BN(0)
        );

        const [programAsSigner, programAsSignerBump] = await getAuctionHouseProgramAsSigner();

        const transaction = new web3.Transaction();
        transaction.add(
            createSellInstruction(
                {
                    auctionHouse: this.auctionHouseKey,
                    wallet: walletPk,
                    authority: auctionHouse.authority,
                    auctionHouseFeeAccount: auctionHouse.auctionHouseFeeAccount,
                    freeSellerTradeState: freeTradeState,
                    sellerTradeState: tradeState,
                    tokenAccount: tokenAccountKey,
                    metadata: mintMetadata.pubkey,
                    programAsSigner,
                },
                {
                    freeTradeStateBump: freeTradeBump,
                    tradeStateBump: tradeBump,
                    programAsSignerBump,
                    buyerPrice: buyPriceAdjusted,
                    tokenSize: tokenSizeAdjusted,
                }
            )
        );

        const txSig = await sendTransaction(transaction, this.connection.value);

        logger.info('[AUCTION_HOUSE] Listed on auction house with txSig', txSig);

        return txSig;
    };
}
