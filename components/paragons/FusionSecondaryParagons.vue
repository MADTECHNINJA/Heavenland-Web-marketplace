<template>
    <div>
        <AppCardTitle title="Secondary Paragons" icon="circle-dashed" />
        <div class="flex flex-col md:flex-row md:items-start items-center justify-between px-6 py-3">
            <div>
                <div class="flex items-center space-x-6 mt-2">
                    <p class="text-sm text-gray-300">
                        Select 4 of your Paragons NFTs as secondary paragons for fusing.
                    </p>
                </div>
            </div>

            <div class="flex justify-between w-full mt-4 md:mt-0 md:w-auto flex-row items-center md:space-x-9">
                <AppSecondaryButton icon="chevron-left" @click="previousStep">Back</AppSecondaryButton>
                <AppButton :disabled="secondary.length < 4" @click="nextStep">Continue...</AppButton>
            </div>
        </div>

        <div v-if="hasParagons" class="flex flex-col md:flex-row justify-between items-end py-3">
            <div class="flex w-full items-center">
                <ParagonsSortingComponent
                    @reverse="reverse = $event"
                    @selected="sortingPriority = $event"
                    :sorting-priority="sortingPriority"
                    class="px-6 w-full"
                    :paragons="sortedParagonCollections"
                />
            </div>

            <div v-if="props.paragons?.length && tier === '0'">
                <ParagonBreedCountFilter
                    :breed-count="breedCount"
                    @update="onBreedCountFilterSelected"
                    :paragons="paragons"
                />
            </div>

            <div
                class="flex mt-4 md:mt-0 w-full md:w-auto justify-center md:justify-start items-center rounded-md pl-3 pr-6"
            >
                <ParagonsProgressBarSelection title="Paragons selected" :limit="4" :value="secondary.length" />
                <ParagonsResetParagonsSelection v-if="secondary.length > 0" class="ml-1" @click="resetParagonState" />
            </div>
        </div>

        <ParagonContainer
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-1 md:mt-3 mb-6 px-6"
            v-if="hasParagons"
        >
            <ParagonOperationCard
                v-for="paragon in sortedParagonCollections"
                :nft="paragon"
                :key="paragon.id"
                :breed-count="paragon.tier === '0' ? paragon.breedCount : undefined"
                :disabled="paragon.mint === main.mint"
                :selected="secondary.findIndex((p) => p.mint === paragon.mint) !== -1"
                @select="onParagonToggle"
            />
        </ParagonContainer>
    </div>
</template>

<script lang="ts" setup>
    import { computed, onMounted, ref } from 'vue';

    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { INftBase } from '~/types/Nft.types';
    import { sortArrayByTags } from '~/types/Paragon.utils';

    const sortingPriority = ref<string[]>();

    const emits = defineEmits<{
        (e: 'update:secondary', mints: IParagonBase[]): void;
        (e: 'update:breedCount', breedCount: number[]): void;
        (e: 'return', sortingPriority: string[] | null): void;
        (e: 'next', sortingPriority: string[] | null): void;
    }>();

    onMounted(() => {
        if (props.sortingPriority) {
            sortingPriority.value = props.sortingPriority;
        }
    });

    const reverse = ref(null);

    const props = defineProps<{
        tier: string;
        secondary: IParagonBase[];
        main: IParagonBase;
        paragons: IParagonBase[];
        breedCount: number[];
        sortingPriority: string[];
    }>();

    const resetParagonState = () => {
        emits('update:secondary', []);
    };

    const onParagonToggle = (value: INftBase) => {
        const secondary = props.secondary;
        const paragonInArray = props.secondary.findIndex((p) => p.mint === value.mint);

        if (paragonInArray !== -1) {
            secondary.splice(paragonInArray, 1);
        } else if (secondary.length < 4) {
            const paragon = props.paragons?.find((p) => p.mint === value.mint);

            if (paragon) {
                secondary.push(paragon);
            }
        }

        emits('update:secondary', secondary);
    };

    const onBreedCountFilterSelected = (filter: number[]) => {
        emits('update:breedCount', filter);
        resetParagonState();
    };

    const sortedParagonCollections = computed(() => {
        if (sortingPriority.value?.length) {
            return sortArrayByTags(
                sortingPriority.value,
                props.paragons.filter(
                    (p) =>
                        p.tier === props.tier &&
                        (props.breedCount.length ? props.breedCount.includes(p.breedCount) : true)
                ),
                reverse.value
            );
        } else {
            return props.paragons
                .filter(
                    (p) =>
                        p.tier === props.tier &&
                        (props.breedCount.length ? props.breedCount.includes(p.breedCount) : true)
                )
                .sort((a, b) => {
                    return a.score < b.score ? 1 : -1;
                });
        }
    });

    const hasParagons = computed(() => {
        return props.paragons?.length > 0 ?? false;
    });

    const previousStep = () => {
        emits('return', sortingPriority.value);
    };

    const nextStep = () => {
        emits('next', sortingPriority.value);
    };
</script>
