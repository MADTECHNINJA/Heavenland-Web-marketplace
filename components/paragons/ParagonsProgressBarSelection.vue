<template>
    <div
        class="flex items-center px-3 py-1 transition-colors"
        :class="[
            value === limit ? 'bg-green-500 bg-opacity-20' : 'bg-indigo-900 bg-opacity-30',
            value > 0 ? 'rounded-l-xl' : 'rounded-xl',
        ]"
    >
        <span class="text-xs text-gray-300 mr-1">Selected</span>
        <div class="flex flex-col rounded-md py-1 px-0.5 w-full items-center w-[50px]">
            <div class="flex items-center space-x-2 w-full">
                <div class="w-full bg-indigo-900 grow h-1.5 rounded-full overflow-clip">
                    <div
                        class="transition-all bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1.5 rounded-full"
                        :class="[value === limit ? 'from-green-900 to-green-700' : 'from-indigo-700 to-[#b24cb6]']"
                        :style="{ width: (value * 100) / limit + '%' }"
                    />
                </div>
            </div>
        </div>
        <FontAwesomeIcon v-if="value === limit" icon="circle-check" class="text-green-500 w-2.5 h-2.5" />
        <span class="text-xs text-center whitespace-nowrap ml-2 font-semibold"> {{ value }}/{{ limit }} </span>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        value: number;
        limit: number;
    }>();
</script>

<style></style>
