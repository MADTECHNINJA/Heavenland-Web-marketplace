<template>
    <div>
        <AppCardTitle title="Main Paragon" icon="circle-dashed" />
        <div class="flex flex-col md:flex-row md:items-start items-center justify-between px-6 py-3">
            <div class="md:mr-2">
                <div class="flex items-center space-x-1 mt-2">
                    <p class="text-sm text-gray-300">Select one of your Paragons NFTs as main paragon for fusing.</p>
                </div>
            </div>

            <div class="flex justify-between w-full mt-4 md:mt-0 md:w-auto flex-row items-center md:space-x-9">
                <AppSecondaryButton icon="chevron-left" @click="previousStep">Back</AppSecondaryButton>
                <AppButton :disabled="!main" @click="nextStep">Continue...</AppButton>
            </div>
        </div>

        <div class="px-6 mt-3 mb-6">
            <div class="flex flex-col md:flex-row justify-between items-end mb-4 md:mb-6">
                <ParagonsSortingComponent
                    @reverse="reverse = $event"
                    @selected="sortingPriority = $event"
                    :paragons="sortedParagonCollections"
                    :sorting-priority="sortingPriority"
                />

                <div v-if="props.paragons?.length && tier === '0'">
                    <ParagonBreedCountFilter
                        :breedCount="breedCount"
                        @update="onBreedCountFilterSelected"
                        :paragons="props.paragons"
                    />
                </div>
            </div>

            <ParagonContainer
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-1 md:mt-3 mb-6"
                v-if="hasParagons"
            >
                <ParagonOperationCard
                    v-for="paragon in sortedParagonCollections"
                    :breed-count="paragon.tier === '0' ? paragon.breedCount : undefined"
                    :nft="paragon"
                    :key="paragon.mint"
                    :selected="main?.mint === paragon.mint"
                    @select="onMainSelected"
                />
            </ParagonContainer>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, onMounted } from 'vue';
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { sortArrayByTags } from '~/types/Paragon.utils';

    const emits = defineEmits<{
        (e: 'update:main', mint: IParagonBase): void;
        (e: 'update:secondary', mints: IParagonBase[]): void;
        (e: 'update:breedCount', breedCount: number[]): void;
        (e: 'return'): void;
        (e: 'next', sortingPriority: string[] | null): void;
    }>();

    const sortingPriority = ref<string[]>();
    const reverse = ref(null);

    const props = defineProps<{
        tier: string;
        main: IParagonBase;
        secondary: IParagonBase[];
        paragons?: IParagonBase[];
        sortingPriority: string[];
        breedCount: number[];
    }>();

    onMounted(() => {
        if (props.sortingPriority) {
            sortingPriority.value = props.sortingPriority;
        }
    });

    const onBreedCountFilterSelected = (filter: number[]) => {
        emits('update:breedCount', filter);
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
        emits('return');
    };

    const nextStep = () => {
        emits('next', sortingPriority.value);
    };

    const onMainSelected = (value: IParagonBase) => {
        const paragonInSecondaryArray = props.secondary.find((p) => p.mint === value.mint);

        if (paragonInSecondaryArray) {
            emits(
                'update:secondary',
                props.secondary.filter((p) => p.mint !== paragonInSecondaryArray.mint)
            );
        }

        emits('update:main', value);
    };
</script>
