<template>
    <AppTooltip
        :disabled="tooltipHidden"
        wrap
        :text="`Breeding this paragon will cost ${price} HTO and will take ${duration} hours. </br>${
            5 - breedCount
        } breeding operations left.`"
    >
        <div
            :class="horizontal ? 'w-[40px]  ' : 'w-[50px] ml-1'"
            class="flex justify-start rounded-md py-1 mt-1 px-0.5 items-center"
        >
            <div
                :class="[
                    breedCount > 0 ? bulletColor : 'bg-green-500',
                    horizontal ? 'flex-row space-x-0.5  left-0 ' : ' flex-col space-y-0.5 left-1',
                    disableAbsolute ? 'relative' : 'absolute top-1',
                ]"
                class="flex rounded-full bg-opacity-20 px-1 py-1"
            >
                <div
                    v-for="bullet in breedCount"
                    :key="bullet"
                    :class="bulletColor"
                    class="w-1 h-1 flex rounded-full"
                />

                <div
                    v-for="bullet in 5 - breedCount"
                    :key="bullet"
                    class="w-1 h-1 bg-white bg-opacity-20 rounded-full"
                />
            </div>
        </div>
    </AppTooltip>
</template>

<script setup lang="ts">
    import { breedingPrice, breedingDuration } from '~/types/Paragon.utils';
    import { computed } from 'vue';
    const props = defineProps<{
        breedCount: number;
        horizontal?: boolean;
        tooltipHidden?: boolean;
        disableAbsolute?: boolean;
    }>();

    const bulletColor = computed(() => {
        return props.breedCount === 5
            ? 'bg-red-500'
            : props.breedCount === 4
            ? 'bg-orange-600'
            : props.breedCount === 3
            ? 'bg-amber-500'
            : props.breedCount === 2
            ? 'bg-lime-500'
            : props.breedCount === 1
            ? 'bg-green-500'
            : 'bg-white';
    });

    const price = computed(() => {
        return breedingPrice(props.breedCount);
    });

    const duration = computed(() => {
        return breedingDuration(props.breedCount);
    });
</script>

<style></style>
