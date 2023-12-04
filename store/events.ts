import { defineStore } from 'pinia';
import { DataWrapper } from '@/types/DataWrapper.types';
import { logger } from '@/plugins/logger.client';
import { API } from '~/api';
import { GamingEvent } from '~/types/Event.types';

export const useEventStore = defineStore({
    id: 'events',

    state: () => ({
        events: {
            gaming: new DataWrapper<GamingEvent[]>(),
        },
    }),

    actions: {
        async fetchEvents() {
            try {
                const gamingEvents = await API.EventService.getGamingEvents();

                if (gamingEvents) {
                    this.events.gaming.setData(gamingEvents);
                } else {
                    this.events.gaming.setError();
                }
            } catch (error: any) {
                this.events.gaming.setError();

                logger.error(error);
                throw new Error(error);
            }
        },
    },
});
