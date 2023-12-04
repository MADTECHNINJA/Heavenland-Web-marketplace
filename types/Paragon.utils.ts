import tier0 from 'assets/paragons/frames/p0.png';
import tier1 from 'assets/paragons/frames/p1.png';
import tier2 from 'assets/paragons/frames/p2.png';
import tier3 from 'assets/paragons/frames/p3.png';
import tier4 from 'assets/paragons/frames/p4.png';
import tier5 from 'assets/paragons/frames/p5.png';

import emptyTier0 from 'assets/paragons/frames/ep0.png';
import emptyTier1 from 'assets/paragons/frames/ep1.png';
import emptyTier2 from 'assets/paragons/frames/ep2.png';
import emptyTier3 from 'assets/paragons/frames/ep3.png';
import emptyTier4 from 'assets/paragons/frames/ep4.png';
import emptyTier5 from 'assets/paragons/frames/ep5.png';

import attribute0 from '@/assets/paragons/attributes/score.png';
import attribute6 from '@/assets/paragons/attributes/sprint_speed.png';
import attribute8 from '@/assets/paragons/attributes/max_translocation_distance.png';
import attribute9 from '@/assets/paragons/attributes/translocation_recovery.png';
import attribute7 from '@/assets/paragons/attributes/jump_height.png';
import attribute2 from '@/assets/paragons/attributes/stamina_recovery_rate.png';
import attribute3 from '@/assets/paragons/attributes/stamina_usage_during_sprint.png';
import attribute4 from '@/assets/paragons/attributes/stamina_usage_per_translocation.png';
import attribute1 from '@/assets/paragons/attributes/stamina.png';
import attribute5 from '@/assets/paragons/attributes/walk_speed.png';
import { IStampable } from '~/types/Paragon.types';
import { INftBase } from '~/types/Nft.types';
import { Attribute, CoreAttribute } from '~/types/collections/Paragons.types';
import { BREEDING_DEFAULT_PRICE } from '~/types/Paragon.data';

export const getParagonTierImage = (tier: string | number) => {
    const tierParsed = typeof tier === 'string' ? Number(tier) : tier;

    if (!isNaN(tierParsed)) {
        switch (tierParsed) {
            case 0:
                return tier0;
            case 1:
                return tier1;
            case 2:
                return tier2;
            case 3:
                return tier3;
            case 4:
                return tier4;
            case 5:
                return tier5;
        }
    }

    return null;
};

export const getParagonEmptyTierImage = (tier: string | number) => {
    const tierParsed = typeof tier === 'string' ? Number(tier) : tier;

    if (!isNaN(tierParsed)) {
        switch (tierParsed) {
            case 0:
                return emptyTier0;
            case 1:
                return emptyTier1;
            case 2:
                return emptyTier2;
            case 3:
                return emptyTier3;
            case 4:
                return emptyTier4;
            case 5:
                return emptyTier5;
        }
    }

    return null;
};

export const getParagonFusePrice = (tier: string) => {
    if (tier) {
        switch (Number(tier)) {
            case 0:
                return 20;
            case 1:
                return 40;
            case 2:
                return 80;
            case 3:
                return 160;
            case 4:
                return 320;
        }
    }

    return null;
};

export const getParagonFuseDuration = (tier: string) => {
    if (tier) {
        switch (Number(tier)) {
            case 0:
                return 3;
            case 1:
                return 5;
            case 2:
                return 8;
            case 3:
                return 15;
            case 4:
                return 30;
        }
    }

    return null;
};

export const cropImage = (canvas, nft: IStampable & INftBase) => {
    const { x, y, r } = nft.cropParameters(canvas.width);

    const ctx = canvas.getContext('2d');
    const factor = (2 * r) / canvas.width;
    const image = new Image(2 * r, 2 * r);
    image.src = nft.image;
    const add = canvas.width * (1 - factor);
    ctx.arc(x, y, canvas.width / 2 - 10, 0, Math.PI * 2, true); // x, y, radius, circle
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, 0, 0, image.width + add, image.height + add); // possible shift
    ctx.restore();
};

export const sortArrayByTags = (tags, array, reverse) => {
    for (let i = 0; i < tags.length; i++) {
        const field = tags[i];
        if (i > 0) {
            const lastField = tags[i - 1];
            array.sort(sortArrayByProperty(field, reverse, lastField));
        } else {
            array.sort(sortArrayByProperty(field, reverse));
        }
    }

    return array;
};

const sortArrayByProperty = (field, reverse = null, previous = null) => {
    const reverseSorting = reverse ? -1 : 1;

    return function (a, b) {
        if (
            (previous &&
                Number(a.attributes.find((attribute) => attribute.displayName === previous)?.value) ===
                    Number(b.attributes.find((attribute) => attribute.displayName === previous)?.value)) ||
            !previous
        )
            return Number(a.attributes.find((attribute) => attribute.displayName === field)?.value) <
                Number(b.attributes.find((attribute) => attribute.displayName === field)?.value)
                ? reverseSorting
                : -reverseSorting;
    };
};

export const getAttributeImage = (item) => {
    switch (item) {
        case Attribute.SCORE:
            return attribute0;

        case CoreAttribute.STAMINA:
            return attribute1;

        case CoreAttribute.STAMINA_RECOVERY_RATE:
            return attribute2;

        case CoreAttribute.STAMINA_USAGE_DURING_SPRINT:
            return attribute3;

        case CoreAttribute.STAMINA_USAGE_PER_TRANSLOCATION:
            return attribute4;

        case CoreAttribute.WALK_SPEED:
            return attribute5;

        case CoreAttribute.SPRINT_SPEED:
            return attribute6;

        case CoreAttribute.JUMP_HEIGHT:
            return attribute7;

        case CoreAttribute.MAX_TRANSLOCATION_DISTANCE:
            return attribute8;

        case CoreAttribute.TRANSLOCATION_RECOVERY:
            return attribute9;
    }
};

export const breedingPrice = (breedCount: number) => {
    return (Number(breedCount) + 1) * BREEDING_DEFAULT_PRICE;
};

export const breedingDuration = (breedCount: number) => {
    return Math.pow(2, Number(breedCount));
};
