<template>
    <div class="relative">
        <div v-if="!loaded" class="w-full aspect-square flex-col">
            <div
                class="border-gray-400 h-full w-full aspect-square bg-[#020E33] border animate-pulse rounded-lg border-opacity-20"
            ></div>
        </div>
        <div class="flex w-full aspect-square md:aspect-auto md:w-auto flex-col">
            <div
                v-if="nft"
                @click="select"
                class="aspect-square w-full md:w-auto min-h-full min-w-full md:min-w-0 md:min-h-0 md:mx-auto lg:block rounded-lg relative"
                :class="[
                    selected ? 'border-green-400' : 'border-gray-400 border-opacity-20',
                    disabled ? 'opacity-30' : 'cursor-pointer',
                    !loaded ? 'opacity-0' : 'border',
                ]"
            >
                <ParagonsBreedingCountBar
                    :breedCount="breedCount"
                    :limit="5"
                    class="absolute left-1"
                    v-if="breedCount !== undefined && loaded"
                />

                <img
                    class="rounded-lg min-h-full min-w-full h-full w-full aspect-square"
                    v-if="nft && nft.image"
                    v-lazy="{ src: nft.image, lifecycle: lazyOptions.lifecycle }"
                    :class="{ 'opacity-0': !loaded }"
                    :alt="nft.name"
                />
            </div>
        </div>
        <p class="text-center w-full text-xs pt-1.5">{{ nft.name }}</p>
    </div>
</template>

<script lang="ts" setup>
    import { reactive, ref } from 'vue';
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { INftBase } from '~/types/Nft.types';
    import { API } from '~/api';
    import { ImageResource } from '~/api/_services/NftService';

    const props = defineProps<{
        nft: IParagonBase | INftBase;
        selected: boolean;
        disabled?: boolean;
        breedCount?: number;
    }>();

    const loaded = ref(false);

    const emits = defineEmits<{
        (e: 'select', p: INftBase | IParagonBase): void;
    }>();

    const select = () => {
        if (!props.disabled) {
            emits('select', props.nft);
        }
    };

    const lazyOptions = reactive({
        src: API.NftService.getImage({
            address: props.nft.image,
            resource: ImageResource.URL,
        }),
        lifecycle: {
            loading: () => {
                loaded.value = false;
            },
            loaded: () => {
                loaded.value = true;
            },
        },
    });
</script>

<style scoped></style>
