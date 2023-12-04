import { Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export const getOwnerOfNFT = async (nftMintPk: PublicKey, connection: Connection): Promise<PublicKey> => {
    const tokenAccountPK = await getNFTTokenAccount(nftMintPk, connection);
    const tokenAccountInfo = await connection.getAccountInfo(tokenAccountPK);

    if (tokenAccountInfo && tokenAccountInfo.data) {
        return new PublicKey(tokenAccountInfo.data.slice(32, 64));
    }

    return new PublicKey('');
};

export const getNFTTokenAccount = async (nftMintPk: PublicKey, connection: Connection): Promise<PublicKey> => {
    const tokenAccount = await connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
        filters: [
            {
                dataSize: 165,
            },
            {
                memcmp: {
                    offset: 64,
                    bytes: '2',
                },
            },
            {
                memcmp: {
                    offset: 0,
                    bytes: nftMintPk.toBase58(),
                },
            },
        ],
    });
    return tokenAccount[0].pubkey;
};

export const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
    return (
        await PublicKey.findProgramAddress(
            [
                ownerPubkey.toBuffer(),
                TOKEN_PROGRAM_ID.toBuffer(),
                mintPk.toBuffer(), // mint address
            ],
            ASSOCIATED_TOKEN_PROGRAM_ID
        )
    )[0];
};

export const getATokenAccountsNeedCreate = async (
    connection: Connection,
    walletAddress: PublicKey,
    owner: PublicKey,
    nfts: PublicKey[]
) => {
    const instructions = [],
        destinationAccounts = [];
    for (const mint of nfts) {
        const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
        const response = await connection.getAccountInfo(destinationPubkey);
        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(destinationPubkey, walletAddress, owner, mint);
            instructions.push(createATAIx);
        }
        destinationAccounts.push(destinationPubkey);
    }
    return {
        instructions,
        destinationAccounts,
    };
};

export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: PublicKey,
    payer: PublicKey,
    walletAddress: PublicKey,
    splTokenMintAddress: PublicKey
) => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
};

export const isExistAccount = async (address: PublicKey, connection: Connection) => {
    try {
        const res = await connection.getAccountInfo(address);
        if (res && res.data) return true;
    } catch (e) {
        return false;
    }
};
