<template>
    <div v-if="paragons?.length > 0" class="mt-6">
        <div class="px-5 py-3.5 bg-indigo-900 bg-opacity-[35%]">
            <div class="flex text-xs text-center items-center font-medium">
                <img :src="getAttributeImage(Attribute.SCORE)" class="w-5 h-5" />
                <p class="ml-2">{{ Attribute.SCORE }}</p>
            </div>

            <div class="flex items-center space-x-2 text-xs font-bold mt-1.5 justify-between">
                <div class="w-full bg-indigo-900 h-1.5 rounded-full relative">
                    <div class="relative">
                        <div class="relative overflow-hidden h-1.5 mb-4 text-xs flex rounded bg-transparent">
                            <div
                                class="absolute w-1.5 h-1.5 top-0 shadow-none flex rounded-full transition-all flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-700 to-[#b24cb6]"
                                :style="{
                                    left: paragons[0].score * (100 / 102.5) + '%',
                                }"
                            />
                            <div
                                v-if="paragons[1]?.score"
                                class="absolute w-1.5 h-1.5 shadow-none top-0 flex rounded-full transition-all flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-700 to-[#b24cb6]"
                                :style="{
                                    left: paragons[1].score * (100 / 102.5) + '%',
                                }"
                            />
                        </div>
                    </div>
                </div>

                <div class="flex w-[77px] justify-end space-x-2">
                    <p
                        class="bg-gradient-to-r from-[#9447bc] text-end to-[#b24cb6] bg-clip-text text-transparent w-[25px]"
                    >
                        {{ paragons[0].score }}
                    </p>

                    <p
                        v-if="paragons[1]?.score"
                        class="bg-gradient-to-r from-[#9447bc] to-[#b24cb6] text-end bg-clip-text text-transparent w-[25px]"
                    >
                        {{ paragons[1].score }}
                    </p>
                </div>
            </div>
        </div>

        <div
            v-for="[key, name] in Object.entries(CoreAttribute)"
            :key="key"
            class="even:bg-indigo-900 even:bg-opacity-10 px-5"
        >
            <div class="py-3">
                <div class="flex text-xs text-center items-center font-medium">
                    <img :src="getAttributeImage(name)" class="w-5 h-5" />
                    <p class="ml-2">{{ name }}</p>
                </div>

                <div class="flex items-center space-x-2 text-xs font-bold">
                    <div class="w-full mt-2 h-1.5 rounded-full relative">
                        <div class="relative">
                            <div class="absolute z-1 top-1 left-0 right-0 bg-indigo-900 h-1.5 rounded-full" />
                            <div class="relative overflow-hidden h-3.5 mb-4 text-xs flex bg-transparent">
                                <div
                                    v-if="paragons[0]"
                                    class="absolute top-1 w-1.5 h-1.5 top-0 shadow-none flex rounded-full transition-all flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-700 to-[#b24cb6]"
                                    :style="{
                                        left: getParagonAttributeValue(paragons[0], name) * ((100 / 102.5) * 2) + '%',
                                    }"
                                />
                                <div
                                    v-if="paragons[1]"
                                    class="absolute top-1 w-1.5 h-1.5 shadow-none top-0 flex rounded-full transition-all flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-700 to-[#b24cb6]"
                                    :style="{
                                        left: getParagonAttributeValue(paragons[1], name) * ((100 / 102.5) * 2) + '%',
                                    }"
                                />

                                <template v-if="paragons.length >= 2 && getCalculatedThresholdWidth(key)">
                                    <template v-for="(thMax, index) in getCalculatedThresholdWidth(key)" :key="index">
                                        <div
                                            :style="{
                                                width: 2 * thMax.range[0] + '%',
                                            }"
                                            class="shadow-none rounded-l-sm transition-all h-3.5 flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r bg-transparent"
                                        />

                                        <div
                                            :style="{
                                                width: 2 * thMax.range[1] + '%',
                                            }"
                                            class="shadow-none rounded-sm transition-all h-3.5 flex bg-gradient-to-r from-[#9447bc] via-[#b24cb6] to-[#9447bc] flex-col text-center whitespace-nowrap text-white justify-center"
                                            :class="[thMax.value > 30 ? 'opacity-[35%]' : 'opacity-[20%]']"
                                        />
                                    </template>
                                </template>
                            </div>
                        </div>
                    </div>

                    <div class="flex w-[77px] justify-end space-x-2">
                        <p
                            class="flex flex-col items-end bg-gradient-to-r from-[#9447bc] to-[#b24cb6] bg-clip-text text-transparent w-[25px]"
                        >
                            <FontAwesomeIcon
                                :icon="
                                    getParagonAttributeValue(paragons[0], name) >=
                                    getParagonAttributeValue(paragons[1], name)
                                        ? 'up'
                                        : 'down'
                                "
                                class="text-[#9447bc] ml-[0.1rem] mb-[0.2rem] h-2.5 w-2.5"
                            />
                            {{ getParagonAttributeValue(paragons[0], name) }}
                        </p>

                        <p
                            v-if="paragons[1]"
                            class="flex flex-col items-end bg-gradient-to-r from-[#9447bc] to-[#b24cb6] bg-clip-text text-transparent w-[25px]"
                        >
                            <FontAwesomeIcon
                                :icon="
                                    getParagonAttributeValue(paragons[1], name) >
                                    getParagonAttributeValue(paragons[0], name)
                                        ? 'up'
                                        : 'down'
                                "
                                class="text-[#9447bc] ml-[0.1rem] mb-[0.2rem] h-2.5 w-2.5"
                            />
                            {{ getParagonAttributeValue(paragons[1], name) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { computed } from 'vue';
    import { CoreAttribute, Attribute } from '~/types/collections/Paragons.types';
    import { getNftAttribute } from '~/types/Nft.utils';
    import { calculateBreedAttributes } from '~/js/paragon/calculation';
    import { getAttributeImage } from '~/types/Paragon.utils';

    const props = defineProps<{
        paragons: IParagonBase[];
    }>();

    const MIN_LEFT_INDEX = 0;
    const MAX_RIGHT_INDEX = 50;

    const decreaseLeftIndex = (index) => {
        if (index > MIN_LEFT_INDEX) {
            return --index;
        } else {
            return null;
        }
    };

    const increaseRightIndex = (index) => {
        if (index < MAX_RIGHT_INDEX) {
            return ++index;
        } else {
            return null;
        }
    };

    const getValueForIndex = (attribute: string, index: number) => {
        return breedCalculation.value?.[attribute][index];
    };

    const calculateThresholdRanges = computed(() => {
        const attributeThresholds = {};

        for (const attribute of Object.keys(CoreAttribute)) {
            const thMax = [];

            for (const interval of calculateThresholdIntervals.value[attribute]) {
                if (interval) {
                    thMax.push({
                        value: 0,
                        leftBoundary: 0,
                        rightBoundary: interval[0],
                    });

                    let leftIndex = decreaseLeftIndex(interval[0]);
                    let rightIndex = increaseRightIndex(interval[0]);

                    while (leftIndex !== null || rightIndex !== null) {
                        if (
                            leftIndex !== null &&
                            getValueForIndex(attribute, leftIndex) >= 1.3 &&
                            (getValueForIndex(attribute, leftIndex) >= getValueForIndex(attribute, rightIndex) ||
                                rightIndex === null)
                        ) {
                            if (thMax[thMax.length - 1].value < 70) {
                                thMax[thMax.length - 1].value += getValueForIndex(attribute, leftIndex);
                                thMax[thMax.length - 1].leftBoundary = leftIndex;
                                leftIndex = decreaseLeftIndex(leftIndex);
                            } else {
                                break;
                            }
                        } else if (
                            rightIndex !== null &&
                            getValueForIndex(attribute, rightIndex) >= 1.3 &&
                            (getValueForIndex(attribute, leftIndex) < getValueForIndex(attribute, rightIndex) ||
                                leftIndex === null)
                        ) {
                            if (thMax[thMax.length - 1].value < 70) {
                                thMax[thMax.length - 1].value += getValueForIndex(attribute, rightIndex);

                                thMax[thMax.length - 1].rightBoundary = rightIndex;
                                rightIndex = increaseRightIndex(rightIndex);
                            } else {
                                thMax[thMax.length - 1].rightBoundary = rightIndex;
                                break;
                            }
                        } else {
                            break;
                        }
                    }

                    attributeThresholds[attribute] = {
                        thMax,
                    };
                }
            }
        }

        return attributeThresholds;
    });

    const calculateThresholdWidth = computed(() => {
        const thresholdWidth = {};

        for (const attribute of Object.keys(CoreAttribute)) {
            const ranges = [];

            if (calculateThresholdRanges.value[attribute]?.thMax?.length) {
                for (const [index, thMax] of calculateThresholdRanges.value[attribute].thMax.entries()) {
                    if (index > 0) {
                        const previousRange = calculateThresholdRanges.value[attribute]?.thMax?.[index - 1];

                        ranges.push({
                            value: thMax.value,
                            range: [
                                thMax.leftBoundary - (previousRange.rightBoundary - previousRange.leftBoundary),
                                thMax.rightBoundary - thMax.leftBoundary,
                            ],
                        });
                    } else {
                        ranges.push({
                            value: thMax.value,
                            range: [thMax.leftBoundary, thMax.rightBoundary - thMax.leftBoundary],
                        });
                    }
                }
            }

            thresholdWidth[attribute] = ranges;
        }

        return thresholdWidth;
    });

    const getCalculatedThresholdWidth = (attribute: string) => {
        return calculateThresholdWidth.value?.[attribute];
    };

    const calculateThresholdIntervals = computed(() => {
        const attributeValues = {};

        for (const attribute of Object.keys(CoreAttribute)) {
            if (breedCalculation.value?.[attribute]) {
                attributeValues[attribute] = Object.entries(breedCalculation.value?.[attribute])
                    .reduce(
                        (acc, [index, value]) => {
                            if (value > acc[acc.length - 1][1]) {
                                acc[acc.length - 1] = [index, value];
                            } else if (value === 0 && acc[acc.length - 1][1] !== 0) {
                                acc.push(['0', 0]);
                            }

                            return acc;
                        },
                        [['0', 0]]
                    )
                    .filter(([_, value]) => value !== 0);
            }
        }

        return attributeValues;
    });

    const breedCalculation = computed(() => {
        if (props.paragons && props.paragons.length >= 2) {
            return calculateBreedAttributes(props.paragons[0], props.paragons[1]);
        }

        return null;
    });

    const getParagonAttributeValue = (nft: IParagonBase, attributeName: string) => {
        return Number(getNftAttribute(nft, attributeName));
    };
</script>

<style scoped></style>
