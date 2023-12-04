<template>
    <div class="w-full md:w-fit relative md:justify-start justify-center items-center">
        <AppDropdown
            @reverse="reverseOrder"
            @update:model-value="addSortingProperty($event)"
            v-model="selectedItem"
            :title="state.selected?.length ? selectedAttributes : 'Sorting priority'"
            :items="attributes"
            :selectedArray="state.selected"
            is-small
            nft-helper
            ordered-by
            class="relative"
        >
            <template #icon-right>
                <FontAwesomeIcon
                    :icon="['fas', 'chevron-down']"
                    class="flex-shrink-0 ml-1.5 h-3 absolute md:relative right-12 md:right-auto text-white"
                    aria-hidden="true"
                />
            </template>

            <template #item="{ item }">
                <span
                    v-if="state.selected?.length"
                    class="bg-gradient-to-r from-[#9447bc] to-[#b24cb6] font-bold bg-clip-text text-transparent"
                    :class="state.selected?.length >= 10 ? 'w-[22px]' : 'w-[19px]'"
                >
                    {{ order(item) }}
                </span>

                <img class="h-4 w-4 mr-1" :src="getAttributeImage(item)" alt="Attribute image" />
                <span class="text-gray-300 text-xs"> {{ item }}</span>
            </template>
        </AppDropdown>
    </div>
</template>

<script setup lang="ts">
    import { computed, reactive, ref, onUpdated } from 'vue';
    import { IParagonBase, CoreAttribute, Attribute } from '~/types/collections/Paragons.types';
    import { getAttributeImage } from '~/types/Paragon.utils';

    const props = defineProps<{
        paragons: IParagonBase[];
        sortingPriority: string[];
    }>();

    const selectedItem = ref('');

    const emits = defineEmits<{
        (e: 'selected', selected: Array<string>): void;
        (e: 'reverse', reversed: boolean): void;
    }>();

    const order = (item) => {
        return state.selected.indexOf(item) >= 0 ? state.selected.indexOf(item) + 1 + '.' : null;
    };

    const state = reactive({
        selected: [] as string[],
    });

    onUpdated(() => {
        if (props.sortingPriority) {
            state.selected = props.sortingPriority;
        }
    });

    const reverseOrder = (value) => {
        emits('reverse', value);
    };

    const addSortingProperty = (property) => {
        if (state.selected.findIndex((item) => item === property) === -1) {
            state.selected.push(property);
        } else {
            state.selected.splice(
                state.selected.findIndex((item) => item === property),
                1
            );
        }
        emits('selected', state.selected);
    };

    const selectedAttributes = computed(() => {
        return `${state.selected[0]} ${state.selected?.length > 1 ? ', ...' : ''}`;
    });

    const attributes = computed(() => {
        const attrs = Object.values(CoreAttribute);
        attrs.splice(0, 0, Attribute.SCORE as any);
        return attrs;
    });
</script>

<style></style>
