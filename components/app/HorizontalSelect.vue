<template>
    <div
        class="flex bg-indigo-930 container-snap custom-scrollbar custom-scrollbar-hidden gap-2 overflow-x-scroll md:overflow-x-hidden scroll-smooth justify-between md:w-fit rounded-lg"
    >
        <div class="m-1" v-for="item in items" :key="item">
            <button
                :active="modelValue"
                :class="active === item ? 'bg-gradient-to-r from-indigo-800 to-purple-920' : 'opacity-90'"
                class="p-2 rounded-md ext-white hover:bg-indigo-900 transition duration-1000 ease-in-out font-medium transform text-sm px-5 py-1.5 text-center"
                @click="selectedOption(item)"
            >
                {{ item }}
            </button>
        </div>
    </div>
    <p v-if="valid && !active && hint" class="text-red-500 text-sm mt-1.5">
        {{ hint }}
    </p>
    <p v-if="valid && !active && error" class="text-red-500 text-sm mt-1.5">
        {{ error }}
    </p>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    const active = ref(null);

    const emit = defineEmits<{
        (event: 'update:modelValue', payload: number | string): void;
    }>();

    const selectedOption = (item: number | string) => {
        active.value = item;
        emit('update:modelValue', item);
    };

    onMounted(() => {
        if (props.modelValue) {
            active.value = props.modelValue;
        }
    });

    const props = defineProps<{
        items: Array<string | number>;
        modelValue?: string | number;
        valid?: boolean;
        hint?: string;
        error?: string;
    }>();
</script>

<style scoped></style>
