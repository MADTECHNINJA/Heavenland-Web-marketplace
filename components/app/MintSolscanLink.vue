<template>
    <NuxtLink :to="getTokenSolscanUrl(mint)" target="_blank">
        <img :src="solscanLogo" alt="Solscan" class="mr-2 mb-0.5 h-4 w-4" />
    </NuxtLink>
</template>

<script setup lang="ts">
    import solscanLogo from '@/assets/logo/solscan.png';
    import { getTokenSolscanUrl } from '@/js/url';

    defineProps<{
        mint: string;
    }>();
</script>

<style></style>
