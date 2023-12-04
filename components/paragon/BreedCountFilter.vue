<template>
    <div
        v-if="calculatedBreedCountOptions.length > 1"
        class="flex w-full md:w-auto justify-center md:justify-start space-x-1 mt-6 md:mt-0"
    >
        <template v-for="dots in 6" :key="dots">
            <div
                v-if="calculatedBreedCountOptions.findIndex((p) => p === dots - 1) !== -1"
                @click="toggleOption(dots - 1)"
                :class="[
                    selectedOptions.includes(dots - 1)
                        ? 'bg-gradient-to-r from-indigo-900 to-indigo-900/75'
                        : 'bg-indigo-900 bg-opacity-30',
                ]"
                class="flex cursor-pointer transition-color justify-center items-center first-of-type:pl-2 last-of-type:pr-2 first-of-type:rounded-l-xl last-of-type:rounded-r-xl px-1"
            >
                <div class="relative top-0.5 left-0.5">
                    <BreedingCountBar :breed-count="dots - 1" horizontal tooltip-hidden />
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { watch, computed, ref } from '#imports';
    import BreedingCountBar from '~/components/paragons/BreedingCountBar.vue';
    import { IParagonBase } from '~/types/collections/Paragons.types';
    import { onMounted } from 'vue';

    const props = defineProps<{
        breedCount: number[];
        paragons: IParagonBase[];
    }>();

    const emits = defineEmits<{
        (e: 'update', p: number[]): void;
    }>();

    const selectedOptions = ref([]);

    onMounted(() => {
        if (props.breedCount) {
            selectedOptions.value = props.breedCount;
        }
    });

    watch(props.breedCount, () => {
        selectedOptions.value = props.breedCount;
    });

    const calculatedBreedCountOptions = computed<number[]>(() => {
        return props.paragons.reduce((acc, paragon) => {
            if (!acc.includes(paragon.breedCount)) {
                acc.push(paragon.breedCount);
            }

            return acc;
        }, []);
    });

    const toggleOption = (dots: number) => {
        const arrIndex = selectedOptions.value.findIndex((item) => item === dots);

        if (arrIndex !== -1) {
            selectedOptions.value.splice(arrIndex, 1);
        } else {
            selectedOptions.value.push(dots);
        }

        emits('update', selectedOptions.value);
    };
</script>

<style scoped></style>
