<template>
    <div>
        <AppCardTitle title="Preview" icon="images" />

        <div class="flex flex-col py-4">
            <div class="flex p-3">
                <div
                    class="flex w-full md:w-1/3 lg:w-1/4 xl:w-full flex-col justify-center relative border border-gray-400 border-opacity-20 aspect-square rounded-lg"
                >
                    <div class="flex items-center relative aspect-square justify-center">
                        <img
                            v-if="paragons[0]"
                            :src="paragons[0]?.image"
                            class="w-full rounded-md z-[2]"
                            alt="Preview"
                        />
                    </div>
                </div>

                <div
                    class="flex w-full md:w-1/3 lg:w-1/4 xl:w-full ml-3 flex-col justify-center relative border border-gray-400 border-opacity-20 aspect-square rounded-lg"
                >
                    <div class="flex items-center relative justify-center">
                        <img
                            v-if="paragons[1]"
                            :src="paragons[1]?.image"
                            class="w-full rounded-md z-[2]"
                            alt="Preview"
                        />
                    </div>
                </div>
            </div>

            <BreedingAttributesPreview :paragons="paragons" />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import BreedingAttributesPreview from '~/components/paragon/BreedingAttributesPreview.vue';

    defineProps<{
        paragons: IParagonBase[];
    }>();
</script>

<style></style>
