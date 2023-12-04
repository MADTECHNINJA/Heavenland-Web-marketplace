<template>
    <div class="flex items-center justify-center md:justify-start gap-x-1 flex-wrap">
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

        <template v-for="paragon in paragonTiers" :key="paragon.mint">
            <div
                v-if="paragon.tier"
                class="px-6 py-[0.425rem] rounded-md text-xs font-medium capitalize cursor-pointer relative overflow-clip"
                :class="[
                    activeFilter === paragon.tier
                        ? 'bg-gradient-to-r from-indigo-700 to-indigo-900'
                        : 'border border-gray-800 hover:border-gray-700',
                ]"
                @click="changeFilterActivity(paragon.tier)"
            >
                <img
                    :src="getParagonTierImage(paragon.tier)"
                    :alt="paragon.cname"
                    class="absolute opacity-30 top-0 left-0"
                />
                <span class="text-white whitespace-nowrap">{{ `Tier ${paragon.tier}` }}</span>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
    import { getParagonTierImage } from '~/types/Paragon.utils';
    import { ref, computed } from 'vue';

    import { IParagonBase } from '~/types/collections/Paragons.types';

    const props = defineProps<{
        paragons: IParagonBase[];
    }>();

    const emits = defineEmits<{
        (e: 'change', p: string): void;
    }>();

    const activeFilter = ref('all');

    const paragonTiers = computed(() => {
        return props.paragons.reduce((acc, item) => {
            if (acc.findIndex((p) => p.tier === item.tier) === -1) {
                acc.push(item);
            }

            return acc.sort((a, b) => (a.tier > b.tier ? 1 : -1));
        }, []);
    });

    const changeFilterActivity = (selected: string) => {
        activeFilter.value = selected;
        emits('change', selected);
    };
</script>

<style></style>
