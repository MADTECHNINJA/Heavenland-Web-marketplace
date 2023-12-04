<template>
    <div>
        <AppCardTitle title="Preview" icon="images" />

        <div class="flex flex-col pt-4" :class="{ 'pb-9': !isMainParagonSelected }">
            <div class="grid grid-cols-2 mt-3 gap-x-2 px-5">
                <div class="border border-gray-400 border-opacity-20 aspect-square rounded-md h-full">
                    <img v-if="main?.image" :src="main.image" class="rounded-lg" alt="Main paragon" />
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <div v-for="i in 4" :key="i">
                        <div class="border border-gray-400 border-opacity-20 aspect-square rounded-md h-full">
                            <img
                                v-if="secondary.length && secondary[i - 1]?.image"
                                :src="secondary[i - 1].image"
                                class="rounded-lg"
                                :alt="'Secondary paragon' + i"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <FuseAttributesPreview :secondary="secondary" :tier="tier" :main="main" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { computed } from 'vue';
    import FuseAttributesPreview from '~/components/paragon/FuseAttributesPreview.vue';

    const props = defineProps<{
        tier: string;
        main: IParagonBase;
        secondary: IParagonBase[];
    }>();

    const isMainParagonSelected = computed(() => {
        return props.main;
    });
</script>

<style></style>
