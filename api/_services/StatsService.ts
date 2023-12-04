import axios from 'axios';

import { logger } from '@/plugins/logger.client';

import { Root, Path, SubPath } from '@/api/resources';
import { MarketplaceStats, SaleStats } from '~/types/Stats.types';

class StatsService {
    async getSales(): Promise<SaleStats> {
        await logger.info('[API]', 'StatsService', 'getSales');

        const res = await axios.get(`${Root.MARKETPLACE}/${Path.STATS}/${SubPath.STATS.SALE}`);

        return res.data;
    }

    async getMarketplace(): Promise<MarketplaceStats> {
        await logger.info('[API]', 'StatsService', 'getMarketplace');

        const res = await axios.get(`${Root.MARKETPLACE}/${Path.STATS}`);

        return new MarketplaceStats(res.data);
    }
}

export default new StatsService();
