<template>
    <div v-if="main" class="mt-6">
        <div class="px-5 py-3.5 bg-indigo-900 bg-opacity-[35%]">
            <div class="flex text-xs text-center items-center font-medium">
                <img :src="getAttributeImage(Attribute.SCORE)" class="w-5 h-5" />
                <p class="ml-2">{{ Attribute.SCORE }}</p>
            </div>

            <div class="flex items-center space-x-2 text-xs font-bold mt-1.5 justify-between">
                <p class="bg-gradient-to-r from-[#9447bc] to-[#b24cb6] bg-clip-text text-transparent w-[25px]">
                    {{ main.score }}
                </p>

                <div class="w-full bg-indigo-900 h-1.5 rounded-full relative">
                    <div class="relative">
                        <div class="overflow-hidden h-1.5 mb-4 text-xs flex rounded bg-transparent">
                            <div
                                :style="{
                                    width: (100 / tierMaxScore) * main.score + '%',
                                }"
                                class="shadow-none flex transition-all flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-700 to-[#b24cb6]"
                            ></div>
                            <div
                                :style="{
                                    width: getMainParagonScoreIncreaseWidth + '%',
                                }"
                                class="shadow-none rounded-r-lg transition-all flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-600 to-green-800"
                            ></div>
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent w-[30px]">
                    <p v-if="getScoreIncreaseValues">+{{ getScoreIncreaseValues }}</p>
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
                    <p class="mt-2 bg-gradient-to-r from-[#9447bc] to-[#b24cb6] bg-clip-text text-transparent w-[25px]">
                        {{ getMainParagonAttributeValue(name) }}
                    </p>

                    <div v-if="isMainParagonSelected" class="w-full h-1.5 rounded-full relative">
                        <div class="absolute top-1 z-1 left-0 right-0 bg-indigo-900 h-1.5 rounded-full" />
                        <div class="overflow-hidden h-3.5 mb-4 text-xs flex rounded bg-transparent">
                            <div
                                :style="{
                                    width: (100 / attributeMaxScore) * getMainParagonAttributeValue(name) + '%',
                                }"
                                class="relative z-2 shadow-none flex h-1.5 my-1 rounded-l-lg transition-all flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-700 to-[#b24cb6]"
                            />

                            <div
                                v-if="isSecondaryParagonSelected"
                                :style="{
                                    width: (100 / attributeMaxScore) * Number(getAttributeMinIncreaseValue(key)) + '%',
                                }"
                                class="shadow-none rounded-sm transition-all h-1.5 flex flex-col text-center whitespace-nowrap text-white justify-center bg-transparent"
                            />

                            <div
                                v-if="isSecondaryParagonSelected"
                                :style="{
                                    width:
                                        (100 / attributeMaxScore) *
                                            (Number(getAttributeMaxIncreaseValue(key)) -
                                                Number(getAttributeMinIncreaseValue(key))) +
                                        '%',
                                }"
                                class="shadow-none rounded-sm transition-all h-3.5 flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-400 to-green-600 opacity-30"
                            />
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 -mt-1 w-[77px]">
                        <p
                            v-if="getScoreIncreaseValues"
                            class="flex flex-col items-center bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent"
                        >
                            <FontAwesomeIcon
                                icon="down-to-dotted-line"
                                class="text-green-400 ml-[0.1rem] mb-[0.1rem] h-2.5 w-2.5"
                            />
                            +{{ getAttributeMinIncreaseValue(key) }}
                        </p>

                        <p
                            v-if="getScoreIncreaseValues"
                            class="flex flex-col items-center bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent"
                        >
                            <FontAwesomeIcon
                                icon="up-to-dotted-line"
                                class="text-green-400 ml-[0.1rem] mb-[0.1rem] h-2.5 w-2.5"
                            />
                            <span>+{{ getAttributeMaxIncreaseValue(key) }}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { calculateFuseAttributes, getTierMaxScore } from '~/js/paragon/calculation';
    import { computed } from 'vue';
    import { CoreAttribute, Attribute } from '~/types/collections/Paragons.types';
    import { getNftAttribute } from '~/types/Nft.utils';
    import { getAttMaxValue } from '~/js/paragon/calculation';
    import { getAttributeImage } from '~/types/Paragon.utils';

    const props = defineProps<{
        tier: string;
        main: IParagonBase;
        secondary: IParagonBase[];
    }>();

    const fuseCalculation = computed(() => {
        if (isMainParagonSelected.value && isSecondaryParagonSelected.value) {
            return calculateFuseAttributes(props.main, props.secondary, Number(props.tier));
        }

        return null;
    });

    const getMainParagonScoreIncreaseWidth = computed(() => {
        if (getScoreIncreaseValues.value) {
            return (100 / tierMaxScore.value) * getScoreIncreaseValues.value;
        }

        return 0;
    });

    const tierMaxScore = computed(() => {
        if (!props.tier) {
            return null;
        }

        return getTierMaxScore(Number(props.tier) + 1);
    });

    const attributeMaxScore = computed(() => {
        if (!props.tier) {
            return null;
        }

        return getAttMaxValue(Number(props.tier) + 1);
    });

    const getMainParagonAttributeValue = (attributeName: string) => {
        return getNftAttribute(props.main, attributeName);
    };

    const isMainParagonSelected = computed(() => {
        return props.main;
    });

    const isSecondaryParagonSelected = computed(() => {
        return props.secondary && props.secondary.length === 4;
    });

    const getScoreIncreaseValues = computed(() => {
        return fuseCalculation?.value?.scoreIncrease ?? null;
    });

    const getAttributeMinIncreaseValue = (attributeKey: string) => {
        if (props.secondary.length !== 4) {
            return null;
        }

        const attribute = fuseCalculation.value.attributesIncreaseValues[attributeKey];

        if (attribute) {
            return attribute.minIncrease;
        } else {
            return null;
        }
    };

    const getAttributeMaxIncreaseValue = (attributeKey: string) => {
        if (props.secondary.length !== 4) {
            return null;
        }

        const attribute = fuseCalculation.value.attributesIncreaseValues[attributeKey];

        if (attribute) {
            return attribute.maxIncrease;
        } else {
            return null;
        }
    };
</script>

<style scoped></style>
