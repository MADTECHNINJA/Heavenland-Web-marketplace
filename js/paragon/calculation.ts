import { CoreAttribute, IParagonBase } from '~/types/collections/Paragons.types';
import { getNftAttribute } from '~/types/Nft.utils';

const EPS = 1e-9;

export const calculateFuseAttributes = (nftMain: IParagonBase, nftSubs: IParagonBase[], tier: number) => {
    if (tier > 4) {
        throw new Error('getScoreIncrease: invalid nftMain tier');
    }

    if (nftSubs.length !== 4) {
        throw new Error('getScoreIncrease: invalid number of nftSubs');
    }

    if (Number(nftMain.tier) !== tier) {
        throw new Error('getScoreIncrease: invalid nftMain tier');
    }

    for (const nftSub of nftSubs) {
        if (Number(nftSub.tier) !== tier) {
            throw new Error('getScoreIncrease: invalid tier of nftSub');
        }
    }

    const attMax = getAttMaxValue(tier);

    for (const attribute of Object.values(CoreAttribute)) {
        const mainNftAttribute = Number(getNftAttribute(nftMain, attribute));

        if (!(mainNftAttribute >= 0 && mainNftAttribute <= attMax)) {
            throw new Error('getScoreIncrease: invalid attribute of nftMain');
        }

        for (const nftSub of nftSubs) {
            const subNftAttribute = Number(getNftAttribute(nftSub, attribute));
            if (!(subNftAttribute >= 0 && subNftAttribute <= attMax)) {
                throw new Error('getScoreIncrease: invalid attribute of nftSub');
            }
        }
    }

    let scoreIncrease = getScoreIncrease(nftMain, nftSubs, tier);

    const nftResult = {};
    for (const attribute of Object.values(CoreAttribute)) {
        nftResult[attribute] = Number(getNftAttribute(nftMain, attribute));
    }

    let cdValues = [];
    for (let i = 0; i < scoreIncrease; i++) {
        cdValues = getCumulativeDensityFusionValues(nftResult, nftMain, nftSubs, tier);
    }

    scoreIncrease = parseInt(scoreIncrease.toFixed(0));

    const attributesPercentage = getPercentageAttributeValues(cdValues);
    const attributesIncreaseValues = getIncreaseAttributeValues(scoreIncrease, attributesPercentage);

    return {
        scoreIncrease,
        attributesIncreaseValues,
    };
};

const getIncreaseAttributeValues = (
    scoreIncrease: number,
    attributesPercentage: [string, number][]
): { [p: string]: { percentage: number; minIncrease: number; maxIncrease: number } } => {
    const result = {};

    for (const [name, percentage] of attributesPercentage.values()) {
        let minIncrease = 0;
        let maxIncrease = 0;
        let totalProbability = 0;

        for (let iteration = 0; iteration < scoreIncrease; iteration++) {
            const pIncrease = binomialDistributionFunctionCumulative(iteration, scoreIncrease, percentage / 100);

            if (totalProbability < 0.1 && totalProbability + pIncrease > 0.1) {
                minIncrease = iteration;
            }

            if (totalProbability < 0.9 && totalProbability + pIncrease > 0.9) {
                maxIncrease = iteration;
            }

            totalProbability += pIncrease;
        }

        result[name] = {
            minIncrease,
            maxIncrease,
            percentage,
        };
    }

    return result;
};

const factorial = (num) => {
    let factorial = 1;

    for (let i = 0; i < num; i++) {
        factorial *= num - i;
    }

    return factorial;
};

const n_choose_k = function (n, k) {
    return factorial(n) / (factorial(n - k) * factorial(k));
};

const binomialDistributionFunctionCumulative = function (k, n, p) {
    return n_choose_k(n, k) * p ** k * (1 - p) ** (n - k);
};

const getPercentageAttributeValues = (densities: [string, number][]): [string, number][] => {
    const result = [];

    const totalDensity = densities.reduce((acc, [_, density]) => {
        return acc + density;
    }, 0);

    const densityPoint = 100 / totalDensity;

    for (const [attribute, density] of densities) {
        result.push([attribute, parseFloat((densityPoint * density).toFixed(2))]);
    }

    return result;
};

const getCumulativeDensityFusionValues = (
    nftResult: { [k: string]: number },
    nftMain: IParagonBase,
    nftSubs: IParagonBase[],
    tier: number
) => {
    const result = [];

    for (const [name, value] of Object.entries(CoreAttribute)) {
        let weight = 0;

        const mainNftAttribute = Number(getNftAttribute(nftMain, value));
        if (mainNftAttribute >= getAttMaxValue(tier + 1)) {
            result.push(weight);
            continue;
        }

        weight += EPS;
        weight += Number(getNftAttribute(nftMain, value));

        for (const nftSub of nftSubs) {
            const subNftAttribute = Number(getNftAttribute(nftSub, value));
            weight += 0.25 * subNftAttribute;
        }

        result.push([name, parseFloat(weight.toFixed(2))]);
    }

    return result;
};

const getScoreIncrease = (nftMain: IParagonBase, nftSubs: IParagonBase[], tier: number) => {
    const mainParagonScore = Number(nftMain.score);

    if (!mainParagonScore) {
        throw new Error('getScoreIncrease: invalid nftMain score');
    }

    const cAlpha = (mainParagonScore - getTierMinScore(tier)) / getTierScoreRange(tier);

    let cBeta = 0;
    for (const nftSub of nftSubs) {
        const subParagonScore = Number(nftSub.score);

        if (!subParagonScore) {
            throw new Error('getScoreIncrease: invalid nftSub score');
        }

        cBeta += (0.25 * (subParagonScore - getTierMinScore(tier))) / getTierScoreRange(tier);
    }

    let cBetaSigma = 1 - getVariance(nftSubs.map((sub) => Number(sub.score))) / getTierScoreRange(tier);
    cBetaSigma = Math.max(cBetaSigma, 0);

    const scoreIncreaseMin = getTierMinScore(tier + 1) - mainParagonScore;
    const totalScoreIncrease =
        scoreIncreaseMin + getTierScoreRange(tier + 1) * Math.max(Math.tanh(cAlpha + cBeta + cBetaSigma - 1), 0);

    return Math.floor(totalScoreIncrease);
};

const getVariance = (streamSupplier: number[]) => {
    const avg = streamSupplier.reduce((a, b) => a + b, 0) / streamSupplier.length;
    return streamSupplier.map((x) => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / streamSupplier.length;
};

export const getAttMaxValue = (tier: number) => {
    return 50 + 10 * tier;
};

const getTierScoreRange = (tier: number) => {
    return getTierMaxScore(tier) - getTierMinScore(tier);
};

const getTierMinScore = (tier: number) => {
    return tier * 100;
};

export const getTierMaxScore = (tier: number) => {
    if (tier == 5) {
        return 700;
    }

    return 99 + 100 * tier;
};

export const calculateBreedAttributes = (nft1: IParagonBase, nft2: IParagonBase) => {
    const nft1Tier = Number(nft1?.tier);
    const nft2Tier = Number(nft2?.tier);

    if (nft1Tier !== 0) {
        throw new Error('calculateBreedAttributes: invalid nft1 tier');
    } else if (nft2Tier !== 0) {
        throw new Error('calculateBreedAttributes: invalid nft2 tier');
    }

    for (const attribute of Object.values(CoreAttribute)) {
        const nft1Attribute = Number(getNftAttribute(nft1, attribute));
        const nft2Attribute = Number(getNftAttribute(nft2, attribute));

        if (!(nft1Attribute >= 0 && nft1Attribute <= 50)) {
            throw new Error('calculateBreedAttributes: invalid attribute value of nft1Attribute');
        } else if (!(nft2Attribute >= 0 && nft2Attribute <= 50)) {
            throw new Error('calculateBreedAttributes: invalid attribute value of nft2Attribute');
        }
    }

    const nftResult: { [p: string]: number[] } = {};

    for (const [name, value] of Object.entries(CoreAttribute)) {
        const attValue1 = Number(getNftAttribute(nft1, value));
        const attValue2 = Number(getNftAttribute(nft2, value));

        nftResult[name] = getCumulativeDensityBreedingValues(attValue1, attValue2);
        nftResult[name] = getCumulativeDensityPercentageValues(nftResult[name]);
    }

    return nftResult;
};

const getCumulativeDensityPercentageValues = (values: number[]): any[] => {
    const totalValue = Object.values(values).reduce((acc, v) => acc + v);
    const valuePerUnit = 100 / totalValue;

    for (const [index, value] of Object.entries(values)) {
        values[index] = value * valuePerUnit;
    }

    return values;
};

const getCumulativeDensityBreedingValues = (a1: number, a2: number) => {
    // make sure a1 ≤ a2
    if (a1 > a2) {
        const b = a2;
        a2 = a1;
        a1 = b;
    }

    // constants
    const sigma = 5;
    const sigmaR = sigma * Math.exp(1 + (a1 - a2) / 10);
    const C = 1 - (a2 - a1) / 50;

    const result = [];
    let value = 0;

    for (let i = 0; i <= 50; i++) {
        value = Math.exp(-0.5 * Math.pow((i - a1) / sigma, 2));
        if (i > a2) {
            value += C * Math.exp(-0.5 * Math.pow((i - a2) / sigmaR, 2));
        } else {
            value += C * Math.exp(-0.5 * Math.pow((i - a2) / sigma, 2));
        }
        result.push(parseFloat(value.toFixed(3)));
    }

    return result;
};
