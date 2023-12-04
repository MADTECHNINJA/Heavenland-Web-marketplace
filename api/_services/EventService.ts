import axios from 'axios';

import { logger } from '@/plugins/logger.client';

import { Path, SubPath } from '@/api/resources';
import { GamingEvent, GamingEventData, GamingEventSchema } from '~/types/Event.types';
import { z } from 'zod';

class EventService {
    async getGamingEvents(): Promise<GamingEvent[]> {
        await logger.info('[API]', 'EventService', 'getGamingEvents');

        const data = (await axios.get(`${Path.GAMING}/${SubPath.GAMING.EVENTS}?includePastEvents=true`)).data;

        z.array(GamingEventSchema).parse(data);

        return data.map((e: GamingEventData) => new GamingEvent(e));
    }

    async getGamingEvent(eventId: string): Promise<GamingEvent> {
        await logger.info('[API]', 'EventService', 'getGamingEvent');

        const data = (await axios.get(`${Path.GAMING}/${SubPath.GAMING.EVENTS}/${eventId}`)).data;

        GamingEventSchema.parse(data);

        return new GamingEvent(data);
    }
}

export default new EventService();
