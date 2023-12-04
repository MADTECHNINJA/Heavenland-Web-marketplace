<template>
    <div class="py-3 px-6 md:p-6 justify-center md:justify-start flex items-center space-x-3">
        <div v-for="[tier, count] in paragonTiers" :key="tier">
            <div
                @click="selectTier(tier, count)"
                class="rounded-lg pt-3 pb-1 px-6 border aspect-square"
                :class="[
                    tier === modelValue ? 'border-green-400' : 'border border-gray-400 border-opacity-20',
                    count >= quantity ? 'cursor-pointer' : 'opacity-25',
                ]"
            >
                <div class="h-28 w-28 flex items-center justify-center">
                    <img :src="getParagonTierImage(tier)" :alt="'Tier' + tier" />
                </div>
                <p class="text-xs text-center mt-3 font-medium capitalize cursor-pointer relative overflow-clip">
                    Tier {{ tier }}
                </p>
            </div>

            <div class="flex flex-col w-100 items-center mt-2 mx-3">
                <div class="flex items-center space-x-2 w-full">
                    <FontAwesomeIcon v-if="count >= quantity" icon="circle-check" class="text-green-500 h-2.5 w-2.5" />
                    <div class="w-full bg-indigo-900 grow h-1.5 rounded-full overflow-clip">
                        <div
                            class="bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1.5 rounded-full"
                            :class="[
                                count >= quantity ? 'from-green-900 to-green-700' : 'from-indigo-700 to-[#b24cb6]',
                            ]"
                            :style="{ width: (100 / quantity) * count + '%' }"
                        ></div>
                    </div>
                    <span v-if="count > quantity" class="text-xs text-center font-medium"> {{ quantity }}+</span>
                    <span v-else class="text-xs text-center font-medium"> {{ count }}/{{ quantity }} </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { computed } from 'vue';
    import { getParagonTierImage } from '~/types/Paragon.utils';

    const props = defineProps<{
        modelValue: string;
        paragons: IParagonBase[];
        quantity: number;
    }>();

    const emits = defineEmits<{
        (e: 'update:modelValue', p: string): void;
        (e: 'select'): void;
    }>();

    const paragonTiers = computed<IParagonBase[]>(() => {
        return props.paragons
            .reduce((acc, item) => {
                const tierIndex = acc.findIndex(([tier, _]) => tier === item.tier);

                if (tierIndex === -1) {
                    acc.push([item.tier, 1]);
                } else {
                    acc[tierIndex][1]++;
                }

                return acc;
            }, [])
            .sort((a, b) => (a[0] > b[0] ? 1 : -1));
    });

    const selectTier = (tier: string, count: number) => {
        if (count >= props.quantity) {
            emits('update:modelValue', tier);
            emits('select');
        }
    };
</script>

<style scoped></style>
