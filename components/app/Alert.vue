<template>
    <div v-if="text" class="rounded-md px-4 py-2" :class="[color.bg]">
        <div class="flex items-center">
            <div class="flex-shrink-0 flex">
                <FontAwesomeIcon
                    :icon="icon"
                    class="h-5 w-5"
                    :class="[color.color, small ? 'h-3 w-3' : 'h-5 w-5']"
                    aria-hidden="true"
                />
            </div>
            <div
                :class="small && 'items-center'"
                class="ml-2 flex-1 md:flex md:flex-wrap md:justify-between tracking-tight"
            >
                <p class="font-semibold" :class="[color.color, small ? 'text-xs' : 'text-sm']">{{ text }}</p>
                <p class="mt-3 md:mt-0 md:ml-6" v-if="button">
                    <a href="#" class="whitespace-nowrap text-sm font-medium" :class="[color.color, color.hover]">
                        {{ buttonText }}
                    </a>
                </p>
                <div v-if="desc" class="mt-2 basis-full" :class="[color.color]">
                    <p>
                        {{ desc }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import type { ComputedRef } from 'vue';
    import { AlertType } from '~/types/Alert.utils';

    const props = withDefaults(
        defineProps<{
            small?: boolean;
            text?: string;
            button?: boolean;
            buttonText?: string;
            type?: AlertType;
            desc?: string;
        }>(),
        {
            button: false,
            buttonText: '',
            type: AlertType.INFO,
        }
    );

    const icon = computed(() => {
        switch (props.type) {
            case AlertType.INFO:
                return 'circle-info';
            case AlertType.ERROR:
                return 'triangle-exclamation';
            case AlertType.WARNING:
                return 'circle-exclamation';

            default:
                return 'circle-info';
        }
    });

    type ColorSet = { color: string; bg: string; hover: string };

    const color: ComputedRef<ColorSet> = computed(() => {
        switch (props.type) {
            case AlertType.INFO:
                return { color: 'text-indigo-700', bg: 'bg-indigo-50', hover: 'hover:text-indigo-600' };
            case AlertType.ERROR:
                return { color: 'text-red-600', bg: 'bg-indigo-930', hover: 'hover:text-red-500' };
            case AlertType.WARNING:
                return { color: 'text-yellow-700', bg: 'bg-yellow-50', hover: 'hover:text-yellow-600' };

            default:
                return { color: 'text-indigo-700', bg: 'bg-indigo-50', hover: 'hover:text-indigo-600' };
        }
    });
</script>

<style scoped></style>
