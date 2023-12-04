import { defineStore } from 'pinia';
import { DataWrapper } from '@/types/DataWrapper.types';
import { logger } from '@/plugins/logger.client';
import { API } from '~/api';
import { SaleStats, MarketplaceStats } from '~/types/Stats.types';
import { Switchboard } from '~/types/Switchboard.types';

export const useStatsStore = defineStore({
    id: 'stats',

    state: () => ({
        marketplace: new DataWrapper<MarketplaceStats>(),
        sales: new DataWrapper<SaleStats>(),
        tcAlphas: new DataWrapper<SaleStats>(),
        htoUsdRate: new Switchboard(),
    }),

    getters: {
        walletSales: (state) => state.sales.data?.salesPerWallet,
        walletAlphasSales: (state) => state.tcAlphas.data?.salesPerWallet,
    },

    actions: {
        async fetchSwitchboardStats() {
            this.htoUsdRate = new Switchboard();
            await this.htoUsdRate.load();
        },

        async fetchMarketplaceStats() {
            try {
                const stats = await API.StatsService.getMarketplace();

                if (stats) {
                    this.marketplace.setData(stats);
                } else {
                    this.marketplace.setError();
                }
            } catch (error: any) {
                this.marketplace.setError();

                logger.error(error);
                throw new Error(error);
            }
        },

        async fetchSalesStats() {
            try {
                const sales = await API.StatsService.getSales();

                if (sales) {
                    this.sales.setData(sales);
                } else {
                    this.sales.setError();
                }
            } catch (error: any) {
                this.sales.setError();

                logger.error(error);
                throw new Error(error);
            }
        },
    },
});
