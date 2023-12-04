import { useAnchorWallet, useWallet } from 'solana-wallets-vue';
import {
    createClaimTxWrapper,
    getAllCashbacks,
    setClusterConfig,
    setLoggerMode,
} from '~/js/contracts/treasury/treasury/cli/script';
import { useConnection } from '~/composables/useAccount';
import { ComputedRef } from 'vue';

export class Treasury {
    private static instance?: Treasury;

    rpc: ComputedRef<string>;

    public static getInstance(): Treasury {
        if (!Treasury.instance) {
            Treasury.instance = new Treasury();
        }

        return Treasury.instance;
    }

    constructor() {
        setLoggerMode(import.meta.env.VITE_HL_MODE === 'development');

        const { rpc } = useConnection();

        this.rpc = rpc;
    }

    isClusterConfigSet: boolean;

    async setClusterConfig() {
        const anchorWallet = useAnchorWallet();

        if (!anchorWallet.value) {
            throw new Error('[TREASURY] not defined: publicKey');
        }

        await setClusterConfig(import.meta.env.VITE_HL_NAME_CLUSTER, anchorWallet.value, this.rpc.value);

        this.isClusterConfigSet = true;
    }

    async claimCashback() {
        const { publicKey } = useWallet();

        if (!publicKey.value) {
            throw new Error('[TREASURY] not defined: publicKey');
        }

        if (!this.isClusterConfigSet) {
            await this.setClusterConfig();
        }

        return await createClaimTxWrapper('cashback');
    }

    async getCashbacks() {
        const { publicKey } = useWallet();

        if (!publicKey.value) {
            throw new Error('[TREASURY] not defined: publicKey');
        }

        if (!this.isClusterConfigSet) {
            await this.setClusterConfig();
        }

        return getAllCashbacks(publicKey.value.toBase58(), 'cashback');
    }
}
