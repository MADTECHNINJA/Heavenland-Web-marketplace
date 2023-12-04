<template>
    <a
        :class="phone ? 'hidden md:flex' : 'flex md:hidden'"
        class="justify-center items-center -mt-20 lg:-mt-10"
        href="#collections"
    >
        <FontAwesomeIcon
            :icon="['fas', 'chevron-down']"
            class="flex-shrink-0 h-4 mr-2 text-gray-300"
            aria-hidden="true"
        />
        <h2 class="text-base pt-0.5 text-gray-300">Find out more</h2>
    </a>
</template>

<script setup lang="ts">
    defineProps<{
        phone?: boolean;
    }>();
</script>
