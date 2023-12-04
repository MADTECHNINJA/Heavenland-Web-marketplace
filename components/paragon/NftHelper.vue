<template>
    <div
        class="flex items-center bg-gradient-to-r md:from-indigo-930 rounded-r-lg md:to-indigo-940 justify-between mb-4 md:mb-0 md:px-5"
    >
        <div class="relative">
            <img
                class="w-64 h-64 p-0.5 rounded-md opacity-50 border-gray-400 border-opacity-20 border aspect-square"
                :src="nftHelperImage"
                alt="NFT Helper"
            />
            <AppTooltip class="absolute top-5 left-5">
                <div :class="[staticClassList, dynamicClassList('Stamina Recovery Rate')]" />
                <template #text>
                    <div class="flex justify-center space-x-1 w-[100px]">
                        <img class="h-4 w-4" :src="getAttributeImage('Stamina Recovery Rate')" alt="Attribute image" />
                        <span class="text-gray-300 text-xs"> Stamina Recovery Rate </span>
                    </div>
                </template>
            </AppTooltip>
            <AppTooltip class="absolute bottom-12 left-5">
                <div :class="[staticClassList, dynamicClassList('Translocation Recovery')]" />
                <template #text>
                    <div class="flex justify-center space-x-1 w-[100px]">
                        <img class="h-4 w-4" :src="getAttributeImage('Translocation Recovery')" alt="Attribute image" />
                        <span class="text-gray-300 text-xs"> Translocation Recovery </span>
                    </div>
                </template>
            </AppTooltip>
            <AppTooltip class="left-2 top-1/2 absolute">
                <div :class="[staticClassList, dynamicClassList('Stamina Usage during Sprint')]" />
                <template #text>
                    <div class="flex justify-center space-x-1 w-[120px]">
                        <img
                            class="h-4 w-4"
                            :src="getAttributeImage('Stamina Usage during Sprint')"
                            alt="Attribute image"
                        />
                        <span class="text-gray-300 text-xs"> Stamina Usage during Sprint </span>
                    </div>
                </template>
            </AppTooltip>
            <AppTooltip class="bottom-[80px] left-16 absolute">
                <div :class="[staticClassList, dynamicClassList('Stamina Usage per Translocation')]" />
                <template #text>
                    <div class="flex justify-center space-x-1 w-[120px]">
                        <img
                            class="h-4 w-4"
                            :src="getAttributeImage('Stamina Usage per Translocation')"
                            alt="Attribute image"
                        />
                        <span class="text-gray-300 text-xs"> Stamina Usage per Translocation </span>
                    </div>
                </template>
            </AppTooltip>

            <AppTooltip class="absolute left-[48%] top-4">
                <div :class="[staticClassList, dynamicClassList('Stamina')]" />
                <template #text>
                    <div class="flex justify-center space-x-1 w-[70px]">
                        <img class="h-4 w-4" :src="getAttributeImage('Stamina')" alt="Attribute image" />
                        <span class="text-gray-300 text-xs"> Stamina </span>
                    </div>
                </template>
            </AppTooltip>
            <AppTooltip class="absolute right-5 top-5">
                <div :class="[staticClassList, dynamicClassList('Walk Speed')]" />
                <template #text>
                    <div class="flex justify-center space-x-1 w-[100px]">
                        <img class="h-4 w-4" :src="getAttributeImage('Walk Speed')" alt="Attribute image" />
                        <span class="text-gray-300 text-xs"> Walk Speed </span>
                    </div>
                </template>
            </AppTooltip>

            <AppTooltip class="absolute bottom-12 right-5">
                <div :class="[staticClassList, dynamicClassList('Max Translocation Distance')]" />
                <template #text>
                    <div class="flex justify-center space-x-1 w-[100px]">
                        <img
                            class="h-4 w-4"
                            :src="getAttributeImage('Max Translocation Distance')"
                            alt="Attribute image"
                        />
                        <span class="text-gray-300 text-xs"> Max Translocation Distance </span>
                    </div>
                </template>
            </AppTooltip>
            <AppTooltip class="bottom-[80px] right-16 absolute">
                <div :class="[staticClassList, dynamicClassList('Jump Height')]" />
                <template #text>
                    <div class="flex justify-center space-x-1 w-[100px]">
                        <img class="h-4 w-4" :src="getAttributeImage('Jump Height')" alt="Attribute image" />
                        <span class="text-gray-300 text-xs"> Jump Height </span>
                    </div>
                </template>
            </AppTooltip>
            <AppTooltip class="right-2 top-1/2 absolute">
                <div :class="[staticClassList, dynamicClassList('Sprint Speed')]" />
                <template #text>
                    <div class="flex justify-center space-x-1 w-[100px]">
                        <img class="h-4 w-4" :src="getAttributeImage('Sprint Speed')" alt="Attribute image" />
                        <span class="text-gray-300 text-xs"> Sprint Speed </span>
                    </div>
                </template>
            </AppTooltip>
            <AppTooltip class="right-[48%] bottom-7 absolute">
                <div :class="[staticClassList, dynamicClassList('Score')]" />
                <template #text>
                    <div class="flex justify-center space-x-1 w-[60px]">
                        <img class="h-4 w-4" :src="getAttributeImage('Score')" alt="Attribute image" />
                        <span class="text-gray-300 text-xs"> Score </span>
                    </div>
                </template>
            </AppTooltip>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { INftBase } from '~~/types/Nft.types';
    import { DataWrapper } from '~~/types/DataWrapper.types';
    import nftHelperImage from '@/assets/paragons/helper.png';
    import { getAttributeImage } from '~/types/Paragon.utils';

    const props = defineProps<{
        nft: DataWrapper<INftBase>;
        mouseOverItem?: string;
        selectedArray?: Array<string>;
    }>();

    const staticClassList = 'rounded-full shadow border-2';

    const dynamicClassList = (attr) => {
        return props.mouseOverItem === attr
            ? 'bg-amber-500 border-amber-900 h-3.5 w-3.5'
            : props.selectedArray?.includes(attr)
            ? 'bg-green-500 border-green-900 h-3.5 w-3.5'
            : 'bg-red-500 border-red-900 h-2.5 w-2.5';
    };
</script>

<style></style>
