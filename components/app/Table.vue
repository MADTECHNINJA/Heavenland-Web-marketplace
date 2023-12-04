<template>
    <section
        :class="[
            !filteredData.length || sharp || !fetched ? 'rounded-b-lg' : 'rounded-lg',
            !fetched ? 'pb-10 loading' : 'bg-gradient-to-r from-indigo-930/60 to-indigo-930/25',
        ]"
    >
        <div v-if="data && allowSearch" class="md:flex w-auto relative items-center">
            <FormKit
                v-model="filter"
                autocomplete="off"
                :classes="{ outer: 'search-outer my-1 pl-4', input: 'search-input' }"
                type="search"
                placeholder="Search ..."
            />
            <FontAwesomeIcon
                icon="search"
                class="ml-1 left-2 text-indigo-300 top-3 md:top-4 flex absolute items-center justify-center h-3.5 w-3.5 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950"
                @click="filter = ''"
            />
            <FontAwesomeIcon
                v-if="filter"
                icon="times"
                class="ml-1 cursor-pointer text-indigo-300 right-2 top-3 md:top-4 text-gray-400 flex absolute items-center justify-center h-4 w-4 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950"
                @click="filter = ''"
            />
        </div>

        <div class="relative">
            <div v-if="!fetched" :class="!fetched && 'loading'" class="absolute z-10 h-full w-full"></div>

            <div class="w-full md:py-2 h-full">
                <o-table
                    @page-change="$emit('update:currentPage', currentPage)"
                    v-model:currentPage="currentPage"
                    :data="filteredData"
                    @click="cellClick"
                    :total="total"
                    :paginated="
                        (isPaginated && filteredData.length > perPage && fetched && filteredData.length) ||
                        (total > 0 && total > perPage)
                    "
                    :backendPagination="backendPagination"
                    :per-page="perPage"
                    :hoverable="true"
                    :loading="!fetched"
                    :pagination-simple="isPaginationSimple"
                    :pagination-position="paginationPosition"
                    :default-sort-direction="defaultSortDirection"
                    :sort-icon="sortIcon"
                    :sort-icon-size="sortIconSize"
                    default-sort="user.first_name"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page"
                >
                    <template #loading>
                        <AppSpinner
                            v-if="!fetched"
                            :size="8"
                            class="md:absolute z-20 mt-8 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
                        />
                    </template>
                    <o-table-column
                        :sortable="sortable"
                        :key="col.field"
                        :field="col.field"
                        :label="col.label"
                        v-for="col in columns"
                    >
                        <template #default="{ row, index }">
                            <div :class="clickable && 'cursor-pointer'">
                                <slot v-if="$slots[col.field]" :name="col.field" v-bind="{ item: row, index }" />
                                <span v-else> {{ getValue(row, col) }}</span>
                            </div>
                        </template>
                    </o-table-column>
                </o-table>
            </div>

            <div v-if="!filteredData.length && fetched">
                <p class="text-sm py-5 px-5 text-center text-white">{{ unavailable }}</p>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import { ref, reactive, onMounted, computed } from 'vue';
    import { useRouter, useRoute } from '#app';

    const router = useRouter();
    const route = useRoute();

    const sortIconSize = ref('small');

    const props = withDefaults(
        defineProps<{
            columns: Array<{ field: string; label: string }>;
            data?: Array<{}>;
            isPaginated?: boolean;
            perPage?: number;
            sortable?: boolean;
            allowSearch?: boolean;
            fetched: boolean;
            unavailable?: string;
            rounded?: boolean;
            clickable?: boolean;
            total?: number;
            hoverable?: boolean;
            backendPagination?: boolean;
            sharp?: boolean;
        }>(),
        { hoverable: true, backendPagination: false, perPage: 15 }
    );

    defineEmits<{
        (e: 'update:currentPage'): void;
    }>();

    const state = reactive({
        columnsFields: [],
    });

    const currentPage = ref(1);

    onMounted(() => {
        state.columnsFields = props.columns.map((item) => {
            return item.field;
        });
    });

    const filteredData = computed(() => {
        const filtered = [];

        if (props.fetched && props.allowSearch) {
            for (let i = 0; i < state.columnsFields.length; i++) {
                const splitProperty = state.columnsFields[i].split('.');
                if (splitProperty.length > 1) {
                    let item = null;
                    props.data.forEach((dataItem) => {
                        item = iterate(dataItem, splitProperty[splitProperty.length - 1], '', true, 0, item);
                        if (item) {
                            filtered.push(item);
                        }
                    });
                } else {
                    const data = props.data?.filter((item) => {
                        return item[state.columnsFields[i]]
                            ? item[state.columnsFields[i]]
                                  .toString()
                                  .toLowerCase()
                                  .includes(filter.value.toString().toLowerCase())
                            : '';
                    });
                    filtered.push(...data);
                }
            }
            return [...new Set(filtered)];
        } else if (props.fetched) {
            return props.data;
        } else {
            return [];
        }
    });

    const iterate = (obj: object, path: Array<string>, stack: string, filtered = false, depth = 0, item = null) => {
        if (depth === 0 && filtered) {
            item = obj;
        }
        for (const property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] == 'object' && obj[property]) {
                    depth++;
                    return iterate(obj[property], path, stack + '.' + property, filtered, depth, item);
                } else if (!filtered) {
                    if (property === path[path.length - 1] && property == path[depth]) {
                        return obj[property];
                    }
                } else {
                    if (obj[property]) {
                        if (obj[property].toString().toLowerCase().includes(filter.value.toString().toLowerCase())) {
                            return item;
                        }
                    }
                }
            }
        }
    };

    const getValue = (row: any, col: any) => {
        const splitProperty = col.field.split('.');

        let item = null;
        if (splitProperty) {
            if (splitProperty.length > 1) {
                item = iterate(row, splitProperty, '');
            } else {
                item = row[col.field] ? row[col.field] : '';
            }
        } else item = '';

        return item;
    };

    const cellClick = (row, col) => {
        if (props.clickable) {
            let id;
            if (row.id) id = row.id;
            else if (row.data.id) {
                id = row.data.id;
            }

            router.push({
                path: `${route.path}/${id}`,
            });
        }
    };

    const filter = ref('');

    const sortIcon = 'arrow-up';
    const isPaginationSimple = false;
    const paginationPosition = 'bottom';
    const defaultSortDirection = 'asc';
</script>
