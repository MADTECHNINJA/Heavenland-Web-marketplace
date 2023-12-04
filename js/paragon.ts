import * as web3 from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

import { logger } from '@/plugins/logger.client';
import { Connection } from '@metaplex/js';
import { useWallet } from 'solana-wallets-vue';
import { IDL as ParagonProgramIdl, ParagonProgram } from './paragon/paragon';
import { PARAGON_PROGRAM_ID } from './paragon/types';
import { Metaplex } from '~/js/metaplex';
import { NotificationClaimParagons } from '~/types/Notification.types';
import { OperationState } from '~/types/Paragon.types';
import { ParallelDataState } from '~/types/Notification.types';

import {
    createBreedClaimTx,
    createBreedInitTx,
    createClaimFusionTx,
    createEnterFusionTx,
    createStampInitTx,
    getAllOperation,
    getTimestamp,
} from '~/js/paragon/scripts';
import { useConnection } from '~/composables/useAccount';
import { ComputedRef } from 'vue';

export class Paragon {
    private static instance?: Paragon;

    public static getInstance(): Paragon {
        if (!Paragon.instance) {
            Paragon.instance = new Paragon();
        }

        return Paragon.instance;
    }

    connection?: ComputedRef<Connection>;
    program?: anchor.Program<ParagonProgram>;

    constructor() {
        const { connection } = useConnection();

        this.connection = connection;
    }

    loadProgram = async () => {
        logger.info('[PARAGONS] loadProgram: Loading anchor program');

        const { publicKey } = useWallet();

        if (!this.connection || !publicKey.value) {
            this.program = null;
            throw new Error('[PARAGONS] loadProgram: not defined: connection or wallet');
        }

        const provider = new anchor.AnchorProvider(this.connection.value, publicKey.value as any, {
            preflightCommitment: 'confirmed',
        });

        this.program = new anchor.Program<ParagonProgram>(ParagonProgramIdl, PARAGON_PROGRAM_ID, provider);

        logger.info('[PARAGONS] loadProgram: Anchor program initialized');
    };

    async initBreed(firstMint: web3.PublicKey, secondMint: web3.PublicKey, depositAmount: number) {
        logger.info('[PARAGONS] initBreed: Initializing breeding', {
            firstMint: firstMint.toBase58(),
            secondMint: secondMint.toBase58(),
            depositAmount,
        });

        const { publicKey } = useWallet();

        if (!publicKey.value) {
            throw new Error('[PARAGONS] initBreed: not defined: publicKey');
        }

        await this.loadProgram();

        return await createBreedInitTx(
            this.connection.value,
            this.program,
            publicKey.value,
            firstMint,
            secondMint,
            depositAmount
        );
    }

    async claimBreed(personalPoolKey: web3.PublicKey) {
        logger.info('[PARAGONS] claimBreed: Claiming breeding');

        const { publicKey } = useWallet();

        if (!publicKey.value) {
            throw new Error('[PARAGONS] claimBreed: not defined: publicKey');
        }

        await this.loadProgram();

        return await createBreedClaimTx(this.connection.value, this.program, publicKey.value, personalPoolKey);
    }

    async initFusion(tier: number, nftMints: web3.PublicKey[], depositAmount: number) {
        logger.info('[PARAGONS] initFusing: Initializing fusing', {
            tier,
            nftMints,
            depositAmount,
        });

        const { publicKey } = useWallet();

        if (!publicKey.value) {
            throw new Error('[PARAGONS] initFusing: not defined: publicKey');
        }

        await this.loadProgram();

        return createEnterFusionTx(this.connection.value, this.program, publicKey.value, nftMints, depositAmount);
    }

    async claimFusion(fusionPool: web3.PublicKey) {
        logger.info('[PARAGONS] claimFusing: Claiming fusing');

        const { publicKey } = useWallet();

        if (!publicKey.value) {
            throw new Error('[PARAGONS] claimFusing: not defined: publicKey');
        }

        await this.loadProgram();

        return createClaimFusionTx(this.connection.value, this.program, publicKey.value, fusionPool);
    }

    async initStamp(paragonMint: web3.PublicKey, avatarMint: web3.PublicKey, depositAmount: number) {
        logger.info('[PARAGONS] initStamp: Initailizing stamp', {
            paragonMint: paragonMint.toBase58(),
            avatarMint: avatarMint.toBase58(),
            depositAmount,
        });

        const { publicKey } = useWallet();

        if (!publicKey.value) {
            throw new Error('[PARAGONS] initStamp: not defined: publicKey');
        }

        await this.loadProgram();

        const now = await getTimestamp(this.connection.value);
        const str = 'pfp' + now.toString();

        return createStampInitTx(
            this.connection.value,
            this.program,
            publicKey.value,
            paragonMint,
            avatarMint,
            depositAmount,
            str
        );
    }

    async getAllOperation() {
        logger.info('[PARAGONS] getAllOperation: Getting all user operations');

        await this.loadProgram();

        const { publicKey } = useWallet();

        if (!publicKey.value) {
            throw new Error('[PARAGONS] getAllOperation: not defined: publicKey');
        }

        logger.log('[RPC] Getting paragons with connection', this.connection.value.rpcEndpoint);

        return getAllOperation(this.connection.value, this.program, publicKey.value?.toBase58());
    }

    async claimAll(amountToClaim: number | null = null) {
        logger.info('[PARAGONS] claimALl: Claiming all user operations');

        const { publicKey } = useWallet();
        const blockhash = await Metaplex.getInstance().getLatestBlockhash();
        const data = reactive<NotificationClaimParagons>({});
        const txs: web3.Transaction[] = [];
        let countOfClaimedItems = 0;
        const operations = await this.getAllOperation();

        const now = Date.now() / 1000;

        const allOperations = [...operations.breeding, ...operations.fusion]
            .filter(
                (item) =>
                    (item.status === OperationState.FINISHED || item.status === OperationState.ERROR) &&
                    now > item.unlockTime
            )

            .sort((a, b) => a.unlockTime - b.unlockTime)
            .slice(-Number(amountToClaim));

        for (const operation of allOperations) {
            let tx, name;

            if ('bornMint' in operation) {
                name = operation.bornMint;
                countOfClaimedItems += 3;

                tx = await this.claimBreed(operation.pda);
            } else {
                countOfClaimedItems += 1;
                name = operation.fusion;
                tx = await this.claimFusion(operation.pda);
            }
            tx.recentBlockhash = blockhash;
            tx.feePayer = publicKey.value;

            if (!data[operation.pda]) {
                data[operation.pda] = {
                    name,
                    state: ParallelDataState.NONE,
                    tx,
                    breedingParagons: 'bornMint' in operation ? [operation.nftMint1, operation.nftMint2] : null,
                };
            }

            txs.push(tx);
        }

        return {
            claimTxs: txs,
            claimData: data,
            countOfClaimedItems,
        };
    }
}
