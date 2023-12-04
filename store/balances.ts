import { defineStore } from 'pinia';
import { Metaplex } from '@/js/metaplex';
import { WalletBalance } from '@/types/WalletBalance.types';
import { logger } from '@/plugins/logger.client';
import { DataWrapper } from '~/types/DataWrapper.types';
import { CashbackStats } from '~/types/Stats.types';
import { useWallet } from 'solana-wallets-vue';

export const useBalanceStore = defineStore({
    id: 'balances',

    state: () => ({
        escrowHto: new WalletBalance(),
        htoCashback: new DataWrapper<CashbackStats>(),

        balanceHto: new WalletBalance(),
        balanceSol: new WalletBalance(),
    }),

    actions: {
        clearUser() {
            this.escrowHto.clear();

            this.htoCashback.clear();

            this.balanceHto.clear();
            this.balanceSol.clear();
        },

        clearBalances() {
            this.balanceHto.clear();
            this.balanceSol.clear();
        },

        async fetchBalances() {
            const { publicKey } = useWallet();

            if (!publicKey.value) {
                logger.info('not defined: publicKey.value');
                return;
            }

            try {
                const sol = await Metaplex.getInstance().getBalanceSOL(publicKey.value);

                if (sol !== null) {
                    this.balanceSol.setData(sol);
                } else {
                    this.balanceSol.setError();
                }
            } catch (e) {
                logger.error(e);
                this.balanceSol.setError(e);
            }

            try {
                const hto = await Metaplex.getInstance().getBalanceHTO(publicKey.value);

                if (hto !== null) {
                    this.balanceHto.setData(hto);
                } else {
                    this.balanceHto.setError();
                }
            } catch (e) {
                logger.error(e);
                this.balanceHto.setError(e);
            }
        },

        async fetchEscrowBalances() {
            const { publicKey } = useWallet();

            if (!publicKey.value) {
                logger.info('not defined: publicKey.value');
                return;
            }

            try {
                const htoEscrow = await Metaplex.getInstance().auctionHouse.showEscrow(publicKey.value);

                if (htoEscrow !== null) {
                    this.escrowHto.setData(htoEscrow);
                } else {
                    this.escrowHto.setData(0);
                }
            } catch (e) {
                logger.error(e);
                this.escrowHto.setError(e);
            }
        },
    },
});
