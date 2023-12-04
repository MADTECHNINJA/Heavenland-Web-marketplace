<template>
    <cleave
        :modelValue="props.context._value"
        class="formkit-input"
        :disabled="readOnly"
        :max="props.context.max"
        autocomplete="off"
        :placeholder="0"
        @input="handleInput"
        :options="number.options"
        name="number"
    />
</template>

<script lang="ts" setup>
    import { reactive, computed } from 'vue';

    const props = defineProps<{
        context: any;
    }>();

    const readOnly = computed(() => {
        return props.context.readOnly;
    });

    const number = reactive({
        value: null,
        options: {
            numeralDecimalScale: props.context.digits ?? 4,
            numeral: true,
            numeralThousandsGroupStyle: 'thousand',
        },
    });

    const handleInput = (e: any) => {
        if (Number(e.target.value.toString().replace(/,/g, '')) > 0) {
            props.context.node.input(Number(e.target.value.toString().replace(/,/g, '')));
        } else {
            props.context.node.input(0);
        }
    };
</script>
