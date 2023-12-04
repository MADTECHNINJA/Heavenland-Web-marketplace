import { BettingData } from '~/types/Betting.types';

export const BettingMock: BettingData[] = [
    {
        id: 'HLB-1',
        category: 'gaming',
        info: {
            title: 'Speed Spinner race 2023-01-31',
            description: 'Who is going to win this time?',
        },
        parameters: {
            type: 'single',
            startsAt: 1675971154000,
            endsAt: 1674952373000,
            bidCurrency: 'HTO',
            minBid: 100,
            maxBid: 100000,
        },
        options: [
            {
                id: 'HL495514492625',
                title: 'chovpr',
                description: '',
            },
            {
                id: 'HL871891125621',
                title: 'Flying Tiger',
                description: '',
            },
            {
                id: 'HL871891125622',
                title: 'Lucas',
                description: '',
            },
        ],
        bets: [
            {
                optionId: 'HL871891125621',
                amount: 1300,
                currency: 'HTO',
            },
            {
                optionId: 'HL495514492625',
                amount: 900,
                currency: 'HTO',
            },
            {
                optionId: 'HL871891125622',
                amount: 200,
                currency: 'HTO',
            },
        ],
        gamingEvent: {
            id: 'HLG-1',
        },
        result: null,
    },
    {
        id: 'HLB-2',
        category: 'gaming',
        info: {
            title: 'Speed Spinner race 2023-01-31',
            description: 'Who is going to win this time?',
        },
        parameters: {
            type: 'single',
            startsAt: 1674773573000,
            endsAt: 1674948953000,
            bidCurrency: 'HTO',
            minBid: 100,
            maxBid: 100000,
        },
        options: [
            {
                id: 'HL495514492625',
                title: 'chovpr',
                description: '',
            },
            {
                id: 'HL871891125621',
                title: 'Flying Tiger',
                description: '',
            },
        ],
        bets: [
            {
                optionId: 'HL495514492625',
                amount: 900,
                currency: 'HTO',
            },
        ],
        gamingEvent: {
            id: 'HLG-1',
        },
        result: null,
    },
    {
        id: 'HLB-2',
        category: 'gaming',
        info: {
            title: 'Speed Spinner race 2023-01-31',
            description: 'Who is going to win this time?',
        },
        parameters: {
            type: 'single',
            startsAt: 1674945173000,
            endsAt: 1674952373000,
            bidCurrency: 'HTO',
            minBid: 100,
            maxBid: 100000,
        },
        options: [
            {
                id: 'HL495514492625',
                title: 'chovpr',
                description: '',
            },
            {
                id: 'HL871891125621',
                title: 'Flying Tiger',
                description: '',
            },
        ],
        bets: [
            {
                optionId: 'HL495514492625',
                amount: 900,
                currency: 'HTO',
            },
        ],
        gamingEvent: {
            id: 'HLG-1',
        },
        result: null,
    },
];
