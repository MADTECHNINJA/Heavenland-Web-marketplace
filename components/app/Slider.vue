<template>
    <div>
        <div v-if="max !== min" class="flex w-full items-center justify-between">
            <span class="text-indigo-100 text-opacity-80 text-xs mt-0.5">
                <slot v-if="$slots['min']" name="min" v-bind="{ min }" />
                <span v-else>{{ min }}</span>
            </span>
            <span class="text-white text-xs border-opacity-10 border font-medium border-white px-6 py-1 rounded-md">
                <slot v-if="$slots['value']" name="value" v-bind="{ value }" />
                <span v-else>{{ value }}</span>
            </span>
            <span class="text-indigo-100 text-opacity-80 text-xs mt-0">
                <slot v-if="$slots['max']" name="max" v-bind="{ max }" />
                <span v-else>{{ max }}</span>
            </span>
        </div>
        <div class="flex justify-center w-full" v-else>
            <span
                class="text-indigo-100 border-opacity-10 border font-medium border-white px-6 py-1 rounded-md text-opacity-80 text-xs mt-0.5"
                >{{ min }}</span
            >
        </div>
        <o-slider
            v-if="max !== min"
            class="mx-1"
            :step="step"
            :min="min"
            :max="max"
            v-model="slider"
            :value="modelValue"
            @change="$emit('update:modelValue', $event)"
        >
        </o-slider>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed, watch } from 'vue';

    const props = withDefaults(
        defineProps<{
            min?: number;
            max?: number;
            step?: number;
            range?: boolean;
            modelValue?: Array<number> | number;
        }>(),
        { range: false, step: 1, min: 0, max: 100 }
    );
    const slider = ref();

    const value = computed(() => {
        return slider.value && slider.value.length ? `${slider.value[0]}-${slider.value[1]}` : slider.value;
    });

    onMounted(() => {
        slider.value = props.modelValue;
    });
    watch(
        () => props.modelValue,
        () => {
            slider.value = props.modelValue;
        }
    );
</script>
