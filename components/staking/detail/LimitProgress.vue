<template>
    <div class="grid grid-cols-3 gap-3 mb-1">
        <div class="col-span-1 flex items-center w-full justify-center">
            <div class="w-full bg-gray-800 h-1.5 rounded-full">
                <div
                    class="bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1.5 rounded-full"
                    :style="{ width: stakingPercentage + '%' }"
                ></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from 'vue';

    const props = defineProps<{
        stakeAvailable: number;
        stakeTotal: number;
    }>();

    const stakingPercentage = computed(() => {
        return (props.stakeAvailable / props.stakeTotal) * 100;
    });
</script>

<style scoped></style>
