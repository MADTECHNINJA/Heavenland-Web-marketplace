<template>
    <div class="flex items-center gap-x-1 mt-3">
        <div
            class="px-7 py-[0.425rem] rounded-md text-xs cursor-pointer"
            :class="[
                activeFilter === 'all'
                    ? 'bg-gradient-to-r from-indigo-700 to-indigo-900'
                    : 'border border-gray-800 hover:border-gray-700',
            ]"
            @click="changeFilterActivity('all')"
        >
            <span>All</span>
        </div>

        <div
            v-for="cname in collections"
            :key="cname"
            class="px-6 py-[0.425rem] rounded-md text-xs font-medium capitalize cursor-pointer relative overflow-clip"
            :class="[
                activeFilter === cname
                    ? 'bg-gradient-to-r from-indigo-700 to-indigo-900'
                    : 'border border-gray-800 hover:border-gray-700',
            ]"
            @click="changeFilterActivity(cname)"
        >
            <img :src="getCollectionImage(cname)" :alt="cname" class="absolute opacity-20 -top-2/3 left-0" />
            <span class="text-white">{{ cname }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { CollectionList } from '~/types/Collection.data';
    import { CollectionName } from '~/types/Collection.types';
    import { ref } from 'vue';
    import { CollectionFactory } from '~/types/CollectionFactory.types';

    const getCollectionImage = (cname: string) => {
        return CollectionFactory.getCollectionCover(
            (CollectionList.get(cname as CollectionName).isHeavenland ? 'heavenland-' : '') + cname
        );
    };

    defineProps<{
        collections: string[];
    }>();

    const emits = defineEmits<{
        (e: 'change', p: string): void;
    }>();

    const activeFilter = ref('all');

    const changeFilterActivity = (selected: string) => {
        activeFilter.value = selected;
        emits('change', selected);
    };
</script>

<style scoped></style>
