<template>
    <div class="flex items-center text-xs px-2 py-1 rounded-full" :class="[bgColor]">
        <FontAwesomeIcon
            v-if="icon"
            :icon="icon"
            class="h-3 w-3 mr-2"
            :class="[color, animate ? 'animate-' + animate : '']"
        />
        <p class="truncate font-semibold tracking-tight" :class="[color]">
            <slot />
        </p>
    </div>
</template>

<script lang="ts" setup>
    defineProps<{
        icon?: string;
        bgColor: string;
        color: string;
        animate?: string;
    }>();
</script>

<style scoped></style>
