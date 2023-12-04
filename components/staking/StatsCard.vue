<template>
    <div
        class="min-w-[230px] col-span-1 flex-col text-white rounded-lg text-sm justify-center flex items-center px-3 mb-1 py-3"
        :class="[backgroundClass]"
    >
        <slot v-if="$slots.title" name="title" />
        <span v-else>{{ title }}</span>

        <div v-if="error" class="mt-1 text-red-500">
            <FontAwesomeIcon icon="triangle-exclamation" />
            <span class="ml-1.5 font-semibold">Error</span>
        </div>

        <AppSpinner class="mt-2" v-else-if="!fetched" />

        <p v-else class="flex items-center mt-1 space-x-1 font-bold">
            <slot />
        </p>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';

    const props = defineProps<{
        title?: string;
        fetched: boolean;
        error: boolean;
        bg?: 'red' | 'accent';
    }>();

    const backgroundClass = computed(() => {
        switch (props.bg) {
            case 'accent':
                return 'bg-gradient-to-r from-indigo-700 to-indigo-900';

            case 'red':
                return 'bg-gradient-to-r from-red-900 to-red-700';

            default:
                return 'bg-indigo-920';
        }
    });
</script>

<style scoped></style>
