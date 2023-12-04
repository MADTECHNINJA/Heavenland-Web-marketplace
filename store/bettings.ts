import { defineStore } from 'pinia';
import { DataWrapper } from '@/types/DataWrapper.types';
import { logger } from '@/plugins/logger.client';
import { API } from '~/api';
import { GamingEvent } from '~/types/Event.types';
import { Betting } from '~/types/Betting.types';

export const useBettingStore = defineStore({
    id: 'betting',

    state: () => ({
        betting: new DataWrapper<Betting[]>(),
    }),

    actions: {
        async fetchBetting() {
            try {
                const betting = await API.BettingService.getData();

                if (betting) {
                    this.betting.setData(betting);
                } else {
                    this.betting.setError();
                }
            } catch (error: any) {
                this.betting.setError();

                logger.error(error);
                throw new Error(error);
            }
        },
    },
});
