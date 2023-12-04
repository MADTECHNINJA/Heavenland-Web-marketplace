import { z } from 'zod';

export enum EventTagName {
    BETTING = 'betting',
    GAMING = 'gaming',
    CULTURE = 'culture',
}

export type EventTag = {
    id: string;
    iconPrefix: string;
    icon: string;
    name: string;
    tooltip: string;
};

export const EventTags: Record<EventTagName, EventTag> = {
    [EventTagName.BETTING]: {
        id: 'betting',
        iconPrefix: 'fad',
        icon: 'money-check-pen',
        name: 'Betting',
        tooltip: 'Offers multiple betting events',
    },
    [EventTagName.GAMING]: {
        id: 'gaming',
        iconPrefix: 'fas',
        icon: 'headset',
        name: 'Gaming',
        tooltip: 'Gaming-related event',
    },
    [EventTagName.CULTURE]: {
        id: 'culture',
        iconPrefix: 'fas',
        icon: 'music',
        name: 'Culture',
        tooltip: 'Culture-related event',
    },
};

export enum EventStage {
    CREATED = 'C',
    REGISTRATION = 'R',
    LOCKED = 'L',
    STARTED = 'S',
    FINISHED = 'F',
}

export const EventStages: Record<EventStage, { tooltip: string }> = {
    [EventStage.CREATED]: {
        tooltip: 'Event has been created',
    },
    [EventStage.REGISTRATION]: {
        tooltip: 'Registration is opened',
    },
    [EventStage.LOCKED]: {
        tooltip: 'Registration has been locked',
    },
    [EventStage.STARTED]: {
        tooltip: 'Event has been started',
    },
    [EventStage.FINISHED]: {
        tooltip: 'Event has finished',
    },
};

export const GamingEventResultsSchema = z.object({
    finalResults: z.array(
        z.object({
            position: z.number(),
            playerId: z.string(),
            time: z.number(),
        })
    ),
});

export const GamingEventSchema = z.object({
    id: z.string(),
    miniGame: z.string(),
    title: z.string(),
    status: z.enum(['ongoing', 'finished', 'upcoming']),
    parameters: z.object({
        startsAt: z.number(),
        registrationStartsAt: z.number(),
        registrationEndsAt: z.number(),
        currency: z.string(),
        entryFee: z.number(),
        rewardPool: z.number(),
    }),
    settings: z.object({ numberOfLaps: z.number(), numberOfPlayers: z.number(), map: z.string() }),
    players: z.array(
        z.object({
            id: z.string(),
            nickname: z.string(),
            paragonAddress: z.string(),
        })
    ),
    results: GamingEventResultsSchema.nullable(),
    policyLink: z.string(),
});

export type GamingEventData = z.infer<typeof GamingEventSchema>;

export enum EventType {
    GAMING = 'gaming',
}

export class GamingEvent {
    data: GamingEventData;
    #type: EventType;

    constructor(data: GamingEventData) {
        this.data = data;
        this.#type = EventType.GAMING;
    }

    get typeTag() {
        return EventTags.gaming;
    }

    get isRegistrationStarted() {
        return Date.now() / 1000 >= this.data.parameters.registrationStartsAt;
    }

    get isRegistrationFinished() {
        return Date.now() / 1000 >= this.data.parameters.registrationEndsAt;
    }

    get hasStarted() {
        return this.data.status === 'ongoing';
    }

    get isFinished() {
        return this.data.status === 'finished';
    }

    get currentStage() {
        if (this.isFinished) {
            return [EventStage.FINISHED, EventStages.F];
        } else if (this.hasStarted) {
            return [EventStage.STARTED, EventStages.S];
        } else if (this.isRegistrationFinished) {
            return [EventStage.LOCKED, EventStages.L];
        } else if (this.isRegistrationStarted) {
            return [EventStage.REGISTRATION, EventStages.R];
        } else {
            return [EventStage.CREATED, EventStages.C];
        }
    }

    getPlayerParagon = (playerId: string) => {
        return this.data.players.find((p) => p.id === playerId)?.paragonAddress;
    };

    getPlayerNickname = (playerId: string) => {
        return this.data.players.find((p) => p.id === playerId)?.nickname;
    };

    getResults = () => {
        if (this.isFinished && this.data.results?.finalResults) {
            return this.data.results?.finalResults;
        }

        return null;
    };
}
