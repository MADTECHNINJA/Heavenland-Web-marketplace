<template>
    <div class="text-right">
        <AppDropdown v-model="selected" :items="sortOptions">
            <template #icon-right>
                <FontAwesomeIcon
                    :icon="['fas', 'chevron-down']"
                    class="flex-shrink-0 ml-1.5 h-3 text-white"
                    aria-hidden="true"
                />
            </template>

            <template #content="{ selected }">{{ selected.name }}</template>

            <template #item="{ item }">
                {{ item.name }}
            </template>
        </AppDropdown>
    </div>
</template>

<script lang="ts" setup>
    import { sortOptions } from '~/js/query';
    import { computed, ref, WritableComputedRef } from 'vue';
    import { SortOption } from '~/js/query';

    const emit = defineEmits<{
        (e: 'sort:update', key: SortOption): void;
    }>();

    const _selected = ref<SortOption>(sortOptions.find((o) => o.current));

    const selected: WritableComputedRef<SortOption> = computed({
        get(): SortOption {
            return _selected.value;
        },
        set(option: SortOption) {
            _selected.value = option;
            emit('sort:update', option);
        },
    });
</script>
