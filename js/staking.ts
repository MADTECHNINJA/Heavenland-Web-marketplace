import * as web3 from '@solana/web3.js';
import { Connection } from '@metaplex/js';
import * as anchor from '@project-serum/anchor';
import { useWallet } from 'solana-wallets-vue';
import { IDL as ParcelStakingIdl, ParcelStaking } from './staking/parcel_staking';
import { STAKING_PROGRAM_ID, GlobalPool, UserPool, USER_POOL_SIZE } from './staking/types';
import {
    createClaimRewardTx,
    createInitUserPoolTx,
    createMergeStakes,
    createStakeNft,
    createWithdrawNft,
    getGlobalState,
    getUserPoolState,
} from './staking/scripts';
import { getNFTPoolState } from './staking/scripts';
import { logger } from '@/plugins/logger.client';
import { GlobalInfo } from '~/types/Staking.types';
import { useConnection } from '~/composables/useAccount';
import { ComputedRef } from 'vue';
import { Metaplex } from '~/js/metaplex';

export class Staking {
    private static instance?: Staking;

    public static getInstance(): Staking {
        if (!Staking.instance) {
            Staking.instance = new Staking();
        }

        return Staking.instance;
    }

    connection?: ComputedRef<Connection>;
    program?: anchor.Program<ParcelStaking>;

    constructor() {
        const { connection } = useConnection();

        this.connection = connection;
    }

    loadProgram = async (wallet) => {
        if (!this.connection || !wallet) {
            return (this.program = null);
        }

        const provider = new anchor.AnchorProvider(this.connection.value, wallet as any, {
            preflightCommitment: 'confirmed',
        });

        this.program = new anchor.Program<ParcelStaking>(ParcelStakingIdl, STAKING_PROGRAM_ID, provider);
    };

    fetchGlobalData = async () => {
        logger.info('[STAKING] fetchGlobalData');

        if (!this.connection) {
            throw new Error('not defined: connection');
        }

        const wallet = useWallet();

        await this.loadProgram(wallet);

        if (!this.program) {
            throw new Error('not defined: program');
        }

        try {
            const globalState = await getGlobalState(this.program as unknown as anchor.Program);
            const globalData = globalState as unknown as GlobalPool;

            return {
                htoReleaseRate: globalData.htoReleaseRate,
                totalRewardSum: globalData.totalRewardSum,
                factorHl: globalData.factorHl.toNumber(),
                decimalHl: globalData.decimalHl.toNumber(),
            } as GlobalInfo;
        } catch (e) {
            logger.error(e);
            throw new Error(e);
        }
    };

    getAllStakers = async () => {
        const poolAccounts = await this.connection.value.getProgramAccounts(STAKING_PROGRAM_ID, {
            filters: [
                {
                    dataSize: USER_POOL_SIZE,
                },
            ],
        });

        const result: UserPool[] = [];

        try {
            for (let idx = 0; idx < poolAccounts.length; idx++) {
                const data = poolAccounts[idx].account.data;
                const owner = new web3.PublicKey(data.slice(8, 40));

                let buf = data.slice(40, 48).reverse();
                const stakedCount = new anchor.BN(buf);

                const staking = [];
                for (let i = 48, j = 0; i <= data.length && j < stakedCount.toNumber(); j++) {
                    buf = data.slice(i, i + 32);
                    const mint = new web3.PublicKey(buf);
                    i += 32;
                    buf = data.slice(i, i + 8).reverse();
                    const stakedTime = new anchor.BN(buf);
                    i += 8;
                    buf = data.slice(i, i + 8).reverse();
                    const tier = new anchor.BN(buf);
                    i += 8;
                    buf = data.slice(i, i + 8).reverse();
                    const amount = new anchor.BN(buf);
                    i += 8;
                    buf = data.slice(i, i + 8).reverse();
                    const claimedTime = new anchor.BN(buf);
                    i += 8;
                    staking.push({ mint, stakedTime, tier, amount, claimedTime });
                }

                if (stakedCount.toNumber() != 0)
                    result.push({
                        owner,
                        stakedCount,
                        staking,
                    });
            }
        } catch (e) {
            return { count: 0 };
        }

        return {
            count: result.length,
            data: result.map((info: UserPool) => {
                return {
                    owner: info.owner.toBase58(),
                    stakedCount: info.stakedCount.toNumber(),
                    staking: info.staking.map((info) => {
                        return {
                            mint: info.mint.toBase58(),
                            stakedTime: info.stakedTime.toNumber(),
                            tier: info.tier.toNumber(),
                            amount: info.amount.toNumber(),
                            claimedTime: info.claimedTime.toNumber(),
                        };
                    }),
                };
            }),
        };
    };

    fetchUserData = async () => {
        logger.info('[STAKING] fetchUserData');

        const wallet = useWallet();

        if (!this.connection) {
            throw new Error('not defined: connection');
        }

        if (!wallet.publicKey.value) {
            throw new Error('invalid: walletPk');
        }

        await this.loadProgram(wallet);

        if (!this.program) {
            throw new Error('not defined: program');
        }

        const userAddress = wallet.publicKey.value;

        try {
            const poolState = await getUserPoolState(userAddress, this.program as unknown as anchor.Program);

            if (!poolState) {
                return null;
            }

            const poolData = poolState as unknown as UserPool;

            return {
                owner: poolData.owner.toBase58(),
                staking: poolData.staking.slice(0, poolData.stakedCount.toNumber()).map((info) => {
                    return {
                        mint: info.mint.toBase58(),
                        tier: info.tier.toNumber(),
                        amount: info.amount.toNumber(),
                        stakedTime: info.stakedTime.toNumber(),
                        claimedTime: info.claimedTime.toNumber(),
                    };
                }),
                stakedCount: poolData.stakedCount.toNumber(),
            };
        } catch (e) {
            logger.error(e);
            throw new Error(e);
        }
    };

    async initPoolAccount() {
        logger.info('[STAKING] initPoolAccount');

        const wallet = useWallet();

        if (!wallet.publicKey.value) {
            throw new Error('not defined: wallet.publicKey');
        }

        const userAddress: web3.PublicKey = wallet.publicKey.value as unknown as web3.PublicKey;

        if (!userAddress) {
            throw new Error('not defined: userAddress');
        }

        return await this.initUserPool(userAddress);
    }

    async stakeNFT(mint: web3.PublicKey, tier: number, amount: number, withNft = 0) {
        logger.info('[STAKING] stakeNFT', mint?.toBase58(), amount, tier, withNft);

        if (!this.connection) {
            throw new Error('not defined: connection');
        }

        const wallet = useWallet();

        if (!wallet.publicKey.value) {
            throw new Error('not defined: wallet.publicKey');
        }

        const userAddress: web3.PublicKey = wallet.publicKey.value as unknown as web3.PublicKey;

        logger.info('[STAKING] stakeNFT: userAddress', userAddress?.toBase58());

        await this.loadProgram(wallet);

        if (!this.program) {
            throw new Error('not defined: program');
        }

        const tx = await createStakeNft(
            mint,
            userAddress,
            this.program as unknown as anchor.Program,
            this.connection.value,
            {
                tier,
                amount,
                withNft,
            }
        );

        const txSig = await wallet.sendTransaction(tx, this.connection.value);

        logger.info('[STAKING] stakeNFT: txSig', txSig);

        return txSig;
    }

    async withdrawNft(mint: web3.PublicKey, index: number, restaking = 0) {
        logger.info('[STAKING] withdrawNft', mint?.toBase58(), index, restaking);

        if (!this.connection) {
            throw new Error('not defined: connection');
        }

        const wallet = useWallet();

        if (!wallet.publicKey.value) {
            throw new Error('not defined: wallet.publicKey');
        }

        const userAddress: web3.PublicKey = wallet.publicKey.value as unknown as web3.PublicKey;

        logger.info('[STAKING] withdrawNft: userAddress', userAddress?.toBase58());

        await this.loadProgram(wallet);

        if (!this.program) {
            throw new Error('not defined: program');
        }

        logger.info('[STAKING] createWithdrawNft', {
            mint: mint.toBase58(),
            userAddress: userAddress.toBase58(),
            program: this.program as unknown as anchor.Program,
            connection: this.connection,
            params: { index, restaking },
        });

        return await createWithdrawNft(
            mint,
            userAddress,
            this.program as unknown as anchor.Program,
            this.connection.value,
            {
                index,
                restaking,
            }
        );
    }

    private async initUserPool(userAddress: web3.PublicKey): Promise<string> {
        logger.info('[STAKING] initUserPool');

        const tx = await createInitUserPoolTx(
            userAddress,
            this.program as unknown as anchor.Program,
            this.connection.value
        );

        const txSig = await Metaplex.getInstance().sendTransaction(tx);

        logger.info('[STAKING] initUserPool: txSig', txSig);

        const poolAccount = await getUserPoolState(userAddress, this.program as unknown as anchor.Program);

        logger.info('[STAKING] initUserPool: Owner of initialized pool', poolAccount?.owner?.toBase58());

        return txSig;
    }

    async claimAllRewards() {
        if (!this.connection) {
            throw new Error('[STAKING] claimAllRewards: not defined: connection');
        }

        const wallet = useWallet();

        if (!wallet.publicKey.value) {
            throw new Error('[STAKING] claimAllRewards: not defined: wallet.publicKey');
        }

        await this.loadProgram(wallet);

        if (!this.program) {
            throw new Error('[STAKING] claimAllRewards: not defined: program');
        }

        const userAddress: web3.PublicKey = wallet.publicKey.value as unknown as web3.PublicKey;

        const tx = await createClaimRewardTx(
            userAddress,
            this.program as unknown as anchor.Program,
            this.connection.value
        );

        const txSig = await wallet.sendTransaction(tx, this.connection.value);

        logger.info('[STAKING] claimAllRewards:: txSig', txSig);

        return txSig;
    }

    async mergeStakes(nftMint: web3.PublicKey) {
        if (!this.connection) {
            throw new Error('[STAKING] mergeStakes: not defined: connection');
        }

        const wallet = useWallet();

        if (!wallet.publicKey.value) {
            throw new Error('[STAKING] mergeStakes: not defined: wallet.publicKey');
        }

        await this.loadProgram(wallet);

        if (!this.program) {
            throw new Error('[STAKING] mergeStakes: not defined: program');
        }

        const userAddress: web3.PublicKey = wallet.publicKey.value as unknown as web3.PublicKey;

        const tx = await createMergeStakes(
            nftMint,
            userAddress,
            this.program as unknown as anchor.Program,
            this.connection.value
        );

        const txSig = await wallet.sendTransaction(tx, this.connection.value);

        logger.info('[STAKING] mergeStakes:: txSig', txSig);

        return txSig;
    }

    async getNftData(mint: web3.PublicKey) {
        if (!this.connection) {
            throw new Error('not defined: connection');
        }

        const wallet = useWallet();

        if (!wallet.publicKey.value) {
            throw new Error('not defined: wallet.publicKey');
        }

        await this.loadProgram(wallet);

        if (!this.program) {
            throw new Error('not defined: program');
        }

        const nftData = await getNFTPoolState(mint, this.program as unknown as anchor.Program);

        if (!nftData) {
            return null;
        }

        return {
            mint: nftData.mint.toBase58(), // 32
            isDao: nftData.isDao.toNumber(), // 8
            nftConst: nftData.nftConst.toNumber(), // 8
            nftConstDecimal: nftData.nftConstDecimal.toNumber(), // 8
            active: nftData.active.toNumber(), // 8
            isLocked: nftData.isLocked.toNumber(), // 8
            stakerAddress: nftData.stakerAddress.toBase58(), // 32
            curLockedAmount: nftData.curLockedAmount.toNumber(), // 8
            lockedUntil: nftData.lockedUntil.toNumber(), // 8
        };
    }

    async mergeAllStakings(mint: string) {
        if (!this.connection) {
            throw new Error('not defined: connection');
        }

        const wallet = useWallet();

        if (!wallet.publicKey.value) {
            throw new Error('not defined: wallet.publicKey');
        }

        const userAddress: web3.PublicKey = wallet.publicKey.value as unknown as web3.PublicKey;

        logger.info('[STAKING] mergeStakings: mint', mint);

        await this.loadProgram(wallet);

        if (!this.program) {
            throw new Error('not defined: program');
        }

        const tx = await createStakeNft(
            mint,
            userAddress,
            this.program as unknown as anchor.Program,
            this.connection.value
        );

        const txSig = await wallet.sendTransaction(tx, this.connection.value);

        logger.info('[STAKING] stakeNFT: txSig', txSig);

        return txSig;
    }
}
