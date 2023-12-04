import { useWallet } from 'solana-wallets-vue';
import * as web3 from '@solana/web3.js';
import { computed, ComputedRef } from 'vue';
import { logger } from '~/plugins/logger.client';

export const isWalletAddress = (address: string) => {
    const { publicKey } = useWallet();

    return publicKey.value?.toBase58() === address;
};

export enum RpcNode {
    QUICK_NODE = 'QuickNode',
    ANKR = 'Ankr',
    CUSTOM = 'Custom',
}

const rpcCookie = useCookie('_HL-rpc');

export const useConnection = () => {
    const setRpc = (rpc: string) => {
        rpcCookie.value = rpc;
        logger.info('[RPC] Setting new RPC', rpcCookie.value);
    };

    const rpcType: ComputedRef<RpcNode> = computed(() => {
        if (!rpcCookie.value || rpcCookie.value === RpcNode.QUICK_NODE) {
            return RpcNode.QUICK_NODE;
        } else if (rpcCookie.value === RpcNode.ANKR) {
            return RpcNode.ANKR;
        } else {
            return RpcNode.CUSTOM;
        }
    });

    const rpc = computed(() => {
        switch (rpcType.value) {
            case RpcNode.QUICK_NODE:
                return import.meta.env.VITE_HL_CONNECTION_CLUSTER_QUICKNODE;

            case RpcNode.ANKR:
                return import.meta.env.VITE_HL_CONNECTION_CLUSTER_ANKR;

            default:
                return rpcCookie.value;
        }
    });

    const connection = computed(() => {
        logger.info('[RPC] Getting new connection', rpcType.value);

        return new web3.Connection(rpc.value);
    });

    return {
        rpcType,
        rpc,
        connection,
        setRpc,
    };
};
