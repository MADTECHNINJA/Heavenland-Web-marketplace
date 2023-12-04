import { logger } from '@/plugins/logger.client';

import { z } from 'zod';
import { Betting, BettingData, BettingSchema } from '~/types/Betting.types';
import { BettingMock } from '~/types/Betting.data';

class BettingService {
    async getData(): Promise<Betting[]> {
        await logger.info('[API]', 'BettingService', 'getGaming');

        /*const data = (await axios.get(`${Path.GAMING}/${SubPath.GAMING.EVENTS}`)).data;*/
        const data = BettingMock;

        z.array(BettingSchema).parse(data);

        return data.map((e: BettingData) => new Betting(e));
    }
}

export default new BettingService();
