<template>
    <o-tabs v-model="selected">
        <o-tab-item v-for="(item, index) in items" :key="index" :value="item.value" :label="item.label" />
    </o-tabs>
</template>

<script setup lang="ts">
    import { watch, ref, onMounted } from 'vue';

    const props = defineProps<{
        items: { label: string; value: string }[];
        modelValue: string;
    }>();

    const emit = defineEmits<{
        (event: 'update:modelValue', p: string): void;
    }>();

    const selected = ref('');

    onMounted(() => {
        selected.value = props.items.find((i) => i.value === props?.modelValue)?.value ?? props.items[0].value;
    });

    watch(props, () => {
        selected.value = props.items.find((i) => i.value === props?.modelValue)?.value ?? props.items[0].value;
    });

    watch(selected, () => {
        emit('update:modelValue', selected.value);
    });
</script>

<style></style>
