<template>
    <div class="flex" v-if="fetched && hasFilters">
        <div class="flex justify-start flex-wrap">
            <button
                v-if="hasFilters"
                name="filter-selection"
                class="text-xs min-w-fit h-6 px-3 font-bold rounded-md border border-red-900 bg-gradient-to-r from-red-800 to-red-900 mb-2 mr-2"
                @click="clearAll"
            >
                <span class="font-normal">Clear all</span>
                <FontAwesomeIcon icon="times" class="ml-2" />
            </button>

            <template v-for="filter in filters" :key="filter.id">
                <template v-for="filterValue in filter.uiType.getUiActiveFilters()" :key="filterValue">
                    <button
                        @click="clearFilter(filter, filterValue)"
                        name="filter-selection"
                        class="rounded-md min-w-fit h-6 flex items-center text-xs bg-indigo-900 mb-2 mr-2"
                    >
                        <div class="rounded-l-md py-1 px-3 bg-indigo-930">
                            {{ filter.name }}
                        </div>
                        <div
                            class="flex py-1 px-3 rounded-r-md items-center bg-gradient-to-r from-indigo-900 to-indigo-920 font-medium"
                        >
                            <span>{{ filterValue }}</span>
                            <FontAwesomeIcon icon="times" class="ml-2 font-semibold" />
                        </div>
                    </button>
                </template>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { CollectionMetadata, CollectionFilters } from '~/types/Collection.types';
    import { resetAllFilters } from '~/types/Collection.utils';
    import { computed } from 'vue';

    const props = defineProps<{
        fetched: boolean;
        activeFilters: any;
        data: CollectionMetadata;
    }>();

    const emit = defineEmits<{
        (e: 'updateFilter'): void;
    }>();

    const clearFilter = (filter: CollectionFilters, active: any) => {
        filter.uiType.clearFilter(active);
        emit('updateFilter');
    };

    const clearAll = () => {
        resetAllFilters(props.data.filters);
        emit('updateFilter');
    };

    const hasFilters = computed(() => {
        if (!props.fetched) {
            return false;
        }

        let hasFilters = false;

        for (const filter of props.data.filters) {
            const filterParams = filter.uiType?.getUiActiveFilters();

            if (filterParams.length) {
                hasFilters = true;
            }
        }
        return hasFilters;
    });

    const filters = computed(() => {
        return props.data.filters as CollectionFilters[];
    });
</script>

<style scoped></style>
