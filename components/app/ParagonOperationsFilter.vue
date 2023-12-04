<template>
    <div class="flex items-center justify-center md:justify-start gap-x-1 flex-wrap">
        <div
            class="px-7 py-[0.425rem] rounded-md text-xs cursor-pointer"
            :class="[
                modelValue === 'all'
                    ? 'bg-gradient-to-r from-indigo-700 to-indigo-900'
                    : 'border border-gray-800 hover:border-gray-700',
            ]"
            @click="changeFilterActivity('all')"
        >
            <span>All</span>
        </div>

        <template v-for="operation in OperationType" :key="operation">
            <div
                class="px-2 md:px-6 py-[0.425rem] rounded-md text-xs font-medium capitalize cursor-pointer relative overflow-clip"
                :class="[
                    modelValue === operation
                        ? 'bg-gradient-to-r from-indigo-700 to-indigo-900'
                        : 'border border-gray-800 hover:border-gray-700',
                ]"
                @click="changeFilterActivity(operation)"
            >
                <img
                    :src="operationImage(operation)"
                    :alt="operation"
                    class="absolute opacity-30 h-fit w-1/2 top-0 left-0"
                />
                <span class="text-white">{{ ` ${operation}` }}</span>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
    import { useRouter, useRoute } from '#app';
    import { OperationType } from '~/types/Paragon.types';
    import newBreedingLogo from '@/assets/paragons/breeding.png';
    import newFusionLogo from '@/assets/paragons/fusion.png';
    import newStampLogo from '@/assets/paragons/stamping.png';

    const operationImage = (operation) => {
        return operation === OperationType.BREEDING
            ? newBreedingLogo
            : operation === OperationType.FUSION
            ? newFusionLogo
            : newStampLogo;
    };

    const props = defineProps<{
        modelValue: string;
        withRouter: boolean;
    }>();

    const emits = defineEmits<{
        (e: 'update:modelValue', p: string): void;
    }>();

    const updateRouteQuery = (selected: string) => {
        const router = useRouter();
        const route = useRoute();

        router.push({
            path: route.path,
            query:
                selected === 'all'
                    ? null
                    : {
                          type: selected.toLowerCase(),
                      },
        });
    };

    const changeFilterActivity = (selected: string) => {
        if (props.withRouter) {
            updateRouteQuery(selected);
        }

        emits('update:modelValue', selected);
    };
</script>

<style></style>
