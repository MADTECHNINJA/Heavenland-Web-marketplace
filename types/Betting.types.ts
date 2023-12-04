import { z } from 'zod';

export const BettingSchema = z.object({
    id: z.string(),
    category: z.enum(['general', 'gaming']),
    info: z.object({
        title: z.string(),
        description: z.string(),
    }),
    parameters: z.object({
        type: z.string(),
        startsAt: z.number(),
        endsAt: z.number(),
        bidCurrency: z.string(),
        minBid: z.number(),
        maxBid: z.number(),
    }),
    options: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            description: z.string(),
        })
    ),
    bets: z.array(
        z.object({
            optionId: z.string(),
            amount: z.number(),
            currency: z.string(),
        })
    ),
    gamingEvent: z
        .object({
            id: z.string(),
        })
        .optional(),
    result: z.null(),
});

export type BettingData = z.infer<typeof BettingSchema>;

export class Betting {
    constructor(readonly data: BettingData) {
        this.data = data;
    }

    get betSum() {
        return this.data.bets.reduce((acc, item) => acc + item.amount, 0);
    }
}
