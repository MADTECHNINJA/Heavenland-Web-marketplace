<template>
    <button
        type="button"
        @click.prevent="onClick"
        :class="[
            backgroundEffect,
            textEffect,
            hoverEffect,
            { shadow: type === ButtonType.BACKGROUND },
            { 'min-h-[30px] text-xs': small },
            loading
                ? ' focus:ring-0  focus:ring-offset-0 cursor-not-allowed'
                : 'hover:brightness-125 focus:ring-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2',
            { 'min-h-[36px] text-sm': !isLarge && !small },
            { 'py-2 px-6 text-base font-semibold tracking-normal min-h-[40px]': isLarge },
        ]"
        class="bg-gradient-to-r transition min-w-[125px] inline-flex disabled:opacity-60 disabled:brightness-100 tracking-tight items-center justify-center px-4 py-2 font-medium rounded-md"
        :disabled="loading"
    >
        <template v-if="!loading">
            <FontAwesomeIcon v-if="icon" :icon="icon" class="mr-2" />
            <slot />
        </template>
        <AppSpinner v-else />
    </button>
</template>

<script lang="ts" setup>
    import { ButtonVariant, ButtonType } from '~/types/Button.utils';
    import { computed } from 'vue';
    import { useAttrs } from 'vue';

    const attrs = useAttrs();

    const emits = defineEmits<{
        (e: 'click', p: any): void;
    }>();

    const props = defineProps<{
        icon?: string;
        type?: ButtonType;
        variant?: ButtonVariant;
        isLarge?: boolean;
        small?: boolean;
        loading?: boolean;
    }>();

    const onClick = (p) => {
        if (!props.loading) {
            emits('click', p);
        }
    };

    const hoverEffect = computed(() => {
        if (attrs.disabled) {
            return '';
        }

        switch (props.type) {
            case ButtonType.BACKGROUND:
                switch (props.variant) {
                    case ButtonVariant.DANGER:
                        return 'hover:bg-red-700';

                    default:
                        return 'hover:bg-indigo-700';
                }

            case ButtonType.BORDER:
                switch (props.variant) {
                    case ButtonVariant.DANGER:
                        return 'hover:border-red-600';

                    default:
                        return 'hover:border-indigo-600';
                }

            default:
                return '';
        }
    });

    const backgroundEffect = computed(() => {
        switch (props.type) {
            case ButtonType.BORDER:
                return 'bg-white';

            default:
                switch (props.variant) {
                    case ButtonVariant.DANGER:
                        return 'from-red-700 to-red-900';

                    default:
                        return 'from-indigo-700 to-indigo-900';
                }
        }
    });

    const textEffect = computed(() => {
        switch (props.type) {
            case ButtonType.BORDER:
                switch (props.variant) {
                    case ButtonVariant.DANGER:
                        return 'text-red-600';

                    default:
                        return 'text-indigo-600';
                }

            default:
                return 'text-white';
        }
    });
</script>

<style scoped></style>
