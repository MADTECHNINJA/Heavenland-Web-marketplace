<template>
    <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-6">
        <DaoCard :showBanner="showBanner" :data="item" :onGoing="onGoing" v-for="item in data" :key="item.id" />
    </div>
</template>
<script lang="ts" setup>
    import { DaoVote } from '~~/types/Dao.types';

    defineProps<{
        data: Array<DaoVote>;
        onGoing?: boolean;
        showBanner?: boolean;
    }>();
</script>

<style></style>
