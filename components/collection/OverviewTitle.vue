<template>
    <div class="flex items-center">
        <div class="flex space-x-2 items-center text-xl">
            <p class="font-bold"><slot /></p>
            <FontAwesomeIcon v-if="amount" class="h-2 w-2 text-gray-400" icon="circle-small" />
            <p v-if="amount" class="font-bold">{{ amount }}</p>
        </div>
        <NuxtLink v-if="redirectUrl" :to="redirectUrl">
            <div class="text-sm ml-6 text-indigo-500">
                <span>Explore all</span>
                <FontAwesomeIcon class="ml-2" icon="chevron-right" />
            </div>
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>
    defineProps<{
        amount: number;
        redirectUrl?: string;
    }>();
</script>

<style scoped></style>
