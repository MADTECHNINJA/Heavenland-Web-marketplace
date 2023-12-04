<template>
    <form>
        <div class="bg-indigo-930 rounded-lg">
            <div v-for="filter in data?.filters" :key="filter.filterId">
                <Disclosure as="div" class="relative py-3.5 px-6" v-slot="{ open }">
                    <h3 class="-my-3 flow-root border-b border-white border-opacity-5">
                        <DisclosureButton
                            class="py-3 w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-500"
                        >
                            <div class="flex items-center space-x-3">
                                <FontAwesomeIcon icon="filter-list" class="h-3.5 text-gray-300" />
                                <span class="font-semibold text-left text-gray-300 text-[0.825rem]">
                                    {{ filter.name }}
                                </span>
                            </div>
                            <span class="right-4 absolute flex items-center text-white text-opacity-50 ml-2">
                                <FontAwesomeIcon v-if="!open" icon="chevron-down" class="h-3" />
                                <FontAwesomeIcon v-else icon="chevron-up" class="h-3" />
                            </span>
                        </DisclosureButton>
                    </h3>
                    <div :class="open ? 'navbar-menu__active' : 'navbar-menu__inactive'">
                        <transition
                            enter-active-class="transition duration-1000 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-out"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0"
                        >
                            <DisclosurePanel class="pt-6">
                                <div class="space-y-4">
                                    <div v-if="filter.uiType.type === FilterType.RADIUS">
                                        <FormKit
                                            id="coord"
                                            placeholder="e.g. 200"
                                            class="mt-2"
                                            type="number"
                                            @keypress.enter.prevent
                                            validation-message="Value must be a number."
                                            v-model="filter.uiType.amount"
                                            @input="changeRadius(filter.uiType, $event)"
                                        />

                                        <div class="text-gray-300 text-opacity-75 text-xs mt-2">
                                            <AppTooltip text="Enter a coordinate to search for a neighbourhood item">
                                                <div class="flex space-x-1.5 items-center">
                                                    <FontAwesomeIcon icon="info-circle" />
                                                    <span>Radius search is enabled</span>
                                                </div>
                                            </AppTooltip>
                                        </div>
                                    </div>
                                    <div
                                        v-else-if="filter.uiType.type === FilterType.SLIDER"
                                        class="flex-col flex items-center"
                                    >
                                        <AppSlider
                                            range
                                            v-model="filter.uiType.slider.amount"
                                            class="w-full"
                                            :min="filter.uiType.slider.min"
                                            :max="filter.uiType.slider.max"
                                            @update:modelValue="changeRange(filter.uiType, $event)"
                                        />
                                    </div>
                                    <div
                                        v-else-if="filter.uiType.type === FilterType.OPTIONS"
                                        class="grid grid-cols-2 flex-wrap gap-x-1.5 gap-y-2"
                                    >
                                        <button
                                            v-for="option in filter.uiType.values"
                                            :key="option.label"
                                            name="filter-selection"
                                            class="text-xs px-3 py-1 rounded-md border-white"
                                            :class="
                                                option.checked
                                                    ? 'text-white bg-indigo-900'
                                                    : 'border border-indigo-300 border-opacity-[10%] text-indigo-100 text-opacity-80'
                                            "
                                            :value="option.label"
                                            @click.prevent="changeOptionSelect(filter.uiType, option)"
                                        >
                                            {{ option.label }}
                                        </button>
                                    </div>
                                </div>
                            </DisclosurePanel>
                        </transition>
                    </div>
                </Disclosure>
            </div>
        </div>
    </form>
</template>

<script lang="ts" setup>
    import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
    import { CollectionMetadata, FilterType, FilterValueOption, IFilterType } from '~/types/Collection.types';
    import * as _ from 'lodash';

    defineProps<{
        fetched: boolean;
        error: boolean;
        data: CollectionMetadata;
    }>();

    const emit = defineEmits<{
        (e: 'updateFilter'): void;
    }>();

    const changeRange = (filter: IFilterType, event: number[]) => {
        filter.updateFilter(event);

        emit('updateFilter');
    };

    const changeOptionSelect = (filter: IFilterType, option: FilterValueOption) => {
        filter.updateFilter(option);

        emit('updateFilter');
    };

    const changeRadius = (filter: IFilterType, amount: number) => {
        amount ? filter.updateFilter(amount) : filter.updateFilter(null);

        emit('updateFilter');
    };
</script>

<style scoped>
    .navbar-menu__active {
        opacity: 1;
        max-height: 2000px;
        transition: max-height 1s, opacity 1s;
    }

    .navbar-menu__inactive {
        transition: max-height 0s, opacity 0.5s;
        max-height: 0px;

        opacity: 0;
    }
</style>
