import { defineStore } from 'pinia';
import { DataWrapper } from '@/types/DataWrapper.types';
import { logger } from '@/plugins/logger.client';
import { Treasury } from '~/js/treasury';
import { ParsedCashBackWithPDA } from '~/js/contracts/treasury/treasury/cli/types';
import { HTO_TOKEN_DECIMAL } from '~/js/paragon/types';

export const useTreasuryStore = defineStore({
    id: 'treasury',

    state: () => ({
        cashback: new DataWrapper<ParsedCashBackWithPDA>(),
    }),

    getters: {
        claimedCashback: (state) => (state.cashback.data?.alreadyClaimed ?? 0) / HTO_TOKEN_DECIMAL,
        toBeClaimedCashback: (state) => (state.cashback.data?.toBeClaimed ?? 0) / HTO_TOKEN_DECIMAL,
    },

    actions: {
        async clearUser() {
            this.cashback.clear();
        },

        async fetchCashbacks() {
            try {
                const response = await Treasury.getInstance().getCashbacks();

                if (typeof response === 'number') {
                    this.cashback.setData(null);
                } else if (response.length > 0) {
                    this.cashback.setData(response[0]);
                } else {
                    this.cashback.setError();
                }
            } catch (error: any) {
                this.cashback.setError();

                logger.error(error);
                throw new Error(error);
            }
        },
    },
});
