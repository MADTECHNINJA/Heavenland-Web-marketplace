<template>
    <div class="flex flex-col lg:grid grid-cols-3 gap-3">
        <div v-for="stakeRecord in stakeRecords" :key="stakeRecord.index">
            <slot v-bind="{ record: stakeRecord }" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    defineProps<{
        tokenId: string;
        stakeRecords: Array<{
            amount: number;
            earned: number;
            start: number;
            end: number;
            lastClaimed: number;
            index: number;
        }>;
    }>();
</script>

<style scoped></style>
