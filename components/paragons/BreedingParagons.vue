<template>
    <div>
        <AppCardTitle title="Paragons selection" icon="circle-dashed" />
        <div class="flex flex-col md:flex-row md:items-start items-center justify-between px-6 space-x-2 py-3">
            <div>
                <div class="flex items-center space-x-1 mt-2">
                    <p class="text-sm text-gray-300">
                        Select two of your Tier 0 Paragon NFTs for breeding. Paragon NFTs already bred 5 times are not
                        allowed for another breeding.
                    </p>
                </div>
            </div>
            <div
                class="flex md:justify-between justify-center w-full mt-4 md:mt-0 md:w-auto flex-row items-center md:space-x-9"
            >
                <AppButton :disabled="paragonsSelected.length < 2" @click="nextStep">Continue...</AppButton>
            </div>
        </div>

        <AppActionCard transparent v-if="paragonCollections.error()" :type="AlertType.ERROR">
            <template #desc> {{ ErrorMsg.FETCHING_ERROR_PARCELS }}</template>
        </AppActionCard>

        <AppActionCard transparent v-else-if="!paragonCollections.fetched()" :type="AlertType.LOADING">
            <template #title>Loading wallet...</template>
        </AppActionCard>

        <AppActionCard transparent v-else-if="!hasParagons" :type="AlertType.INFO" icon="empty-set">
            <template #title>No Paragons</template>
            <template #desc>Breeding requires <b>Tier 0</b> Paragon NFTs.</template>
        </AppActionCard>

        <div v-if="hasParagons" class="flex flex-col md:flex-row justify-between items-end py-3">
            <div class="flex w-full items-center">
                <ParagonsSortingComponent
                    @reverse="reverse = $event"
                    @selected="sortingPriority = $event"
                    class="px-6 w-full"
                    :sortingPriority="sortingPriority"
                    :paragons="sortedParagonCollections"
                />
            </div>

            <div class="w-full md:w-auto" v-if="paragonCollections.data()?.length">
                <ParagonBreedCountFilter
                    :breedCount="breedCount"
                    @update="onBreedCountFilterSelected"
                    :paragons="paragonCollections.data()"
                />
            </div>

            <div
                class="flex mt-4 md:mt-0 w-full md:w-auto justify-center md:justify-start items-center rounded-md pl-3 pr-6"
            >
                <ParagonsProgressBarSelection :limit="2" :value="paragonsSelected.length" />
                <ParagonsResetParagonsSelection
                    v-if="paragonsSelected.length > 0"
                    class="ml-1"
                    @click="resetParagonState"
                />
            </div>
        </div>

        <ParagonContainer
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-6 mt-1 md:mt-3 mb-6"
            v-if="hasParagons"
        >
            <ParagonOperationCard
                v-for="paragon in sortedParagonCollections"
                :nft="paragon"
                :key="paragon.id"
                :breed-count="paragon.breedCount"
                :disabled="paragon.breedCount === 5"
                :selected="paragons.findIndex((p) => p.mint === paragon.mint) !== -1"
                @select="onParagonToggle"
            />
        </ParagonContainer>
    </div>
</template>

<script lang="ts" setup>
    import { computed, reactive, onMounted, ref } from 'vue';
    import { useAccountStore } from '~/store/account';
    import { mapState } from 'pinia';
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { sortArrayByTags } from '~/types/Paragon.utils';
    import { AlertType } from '~/types/Alert.utils';
    import { ErrorMsg } from '~/locales/core';

    const paragonsSelected = ref([]);
    const sortingPriority = ref<string[]>();
    const reverse = ref(null);

    const props = defineProps<{
        paragons: IParagonBase[];
        tier: string;
        breedCount: number[];
        sortingPriority: string[];
    }>();

    onMounted(() => {
        if (props.paragons) {
            paragonsSelected.value = props.paragons;
        }
        if (props.sortingPriority) {
            sortingPriority.value = props.sortingPriority;
        }
    });

    const emits = defineEmits<{
        (e: 'update:paragons', paragonsSelected: IParagonBase[]): void;
        (e: 'update:breedCount', breedCount: number[]): void;
        (e: 'return'): void;
        (e: 'next', sortingPriority: string[] | null): void;
    }>();

    const resetParagonState = () => {
        paragonsSelected.value = reactive([]);
        emits('update:paragons', paragonsSelected.value);
    };

    const onParagonToggle = (value: IParagonBase) => {
        const paragonInArray = paragonsSelected.value.findIndex((p) => p.mint === value.mint);

        if (paragonInArray !== -1) {
            paragonsSelected.value.splice(paragonInArray, 1);
        } else if (paragonsSelected.value.length < 2) {
            const paragon = paragonCollections.data()?.find((p) => p.mint === value.mint);

            if (paragon) {
                paragonsSelected.value.push(paragon);
            }
        }

        emits('update:paragons', paragonsSelected.value);
    };

    const hasParagons = computed(() => {
        return paragonCollections.data()?.filter((p) => p.tier === props.tier)?.length ?? false;
    });

    const paragonCollections = mapState(useAccountStore, {
        fetched: (store) => store.tokens.paragons.fetched,
        error: (store) => store.tokens.paragons.error,
        data: (store) => store.tokens.paragons.data,
    });

    const onBreedCountFilterSelected = (filter: number[]) => {
        resetParagonState();
        emits('update:breedCount', filter);
    };

    const sortedParagonCollections = computed(() => {
        if (sortingPriority.value?.length) {
            return sortArrayByTags(
                sortingPriority.value,
                paragonCollections
                    .data()
                    .filter(
                        (p) =>
                            p.tier === props.tier &&
                            (props.breedCount.length ? props.breedCount.includes(p.breedCount) : true)
                    ),
                reverse.value
            );
        } else {
            return paragonCollections
                .data()
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

    const nextStep = () => {
        emits('next', sortingPriority.value);
    };
</script>

<style scoped></style>
