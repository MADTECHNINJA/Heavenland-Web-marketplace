<template>
    <section class="rounded-lg w-full flex flex-col">
        <AppCardTitle title="Paragon" icon="circle-dashed" />

        <div class="rounded-b-lg px-5 py-3 relative min-h-[100px relative overflow-hidden bg-indigo-940">
            <div class="flex justify-center md:justify-start items-center">
                <div class="grid grid-cols-4 w-full justify-center items-center md:items-start">
                    <div class="col-span-1">
                        <p class="text-sm mb-3 text-gray-400 text-center md:text-left">Breedings left</p>
                        <div class="flex items-center text-xs text-gray-400">
                            <div
                                class="flex text-lg font-semibold text-gray-300 justify-center items-center bg-opacity-50 object-contain h-12 w-12 top-0 right-0 rounded-md"
                                :class="[bulletColor]"
                            >
                                <span>{{ 5 - breedCount }}</span>
                            </div>

                            <div class="flex relative">
                                <ParagonsBreedingCountBar
                                    tooltip-hidden
                                    :breedCount="breedCount"
                                    :limit="5"
                                    disable-absolute
                                />
                            </div>
                        </div>
                    </div>

                    <div v-if="props.pfp" class="col-span-1">
                        <p class="text-sm mb-3 text-gray-400 text-center md:text-left font-normal">Stamped with PFP</p>
                        <div class="flex items-center">
                            <img
                                v-if="nft?.data?.offChain?.image"
                                :src="nft?.data?.offChain?.image"
                                class="object-contain mr-3 h-12 w-12 top-0 right-0 rounded-md"
                            />
                            <div
                                v-else
                                class="object-contain mr-3 animate-pulse bg-indigo-920 h-12 w-12 top-0 right-0 rounded-md"
                            />
                            <div>
                                <p
                                    v-if="nft?.data?.onChain?.data?.name"
                                    class="text-sm text-white font-semibold md:text-left text-center"
                                >
                                    {{ nft?.data?.onChain?.data?.name }}
                                </p>

                                <p v-else class="text-sm text-white font-semibold md:text-left text-center">
                                    Loading..
                                </p>
                                <p class="text-indigo-300 text-xs">{{ nft?.data?.offChain?.collection?.name }}</p>
                            </div>
                        </div>
                    </div>

                    <img
                        :src="paragon"
                        class="object-contain h-full lg:h-full absolute -bottom-2 -right-6 opacity-[0.15]"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { onMounted, ref, computed } from 'vue';
    import { ITokenMetadata, Metaplex } from '~/js/metaplex';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import paragon from '~/assets/paragons/stamping.png';
    import { IParagonBase } from '~~/types/collections/Paragons.types';

    const props = defineProps<{
        pfp: string | number;
        paragon: IParagonBase;
    }>();

    const bulletColor = computed(() => {
        if (props.paragon?.breedCount === undefined) {
            return null;
        }

        return props.paragon.breedCount === 5
            ? 'bg-red-500'
            : props.paragon.breedCount === 4
            ? 'bg-orange-600'
            : props.paragon.breedCount === 3
            ? 'bg-amber-500'
            : props.paragon.breedCount === 2
            ? 'bg-lime-500'
            : props.paragon.breedCount === 1
            ? 'bg-green-500'
            : 'bg-green-500';
    });

    const breedCount = computed(() => {
        return Number(props.paragon?.attributes.find((item) => item.displayName === 'Breed Count')?.value);
    });

    const nft = ref(new DataWrapper<ITokenMetadata>());

    onMounted(async () => {
        if (props.pfp) {
            try {
                const response = await Metaplex.getInstance().retrieveRequestItems([props.pfp.toString()]);

                if (response !== null && response.length) {
                    nft.value.setData(response[0]);
                } else {
                    nft.value.setError();
                }
            } catch (e: any) {
                nft.value.setError();
            }
        }
    });
</script>

<style></style>
