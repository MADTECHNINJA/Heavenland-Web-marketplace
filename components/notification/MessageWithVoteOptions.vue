<template>
    <div class="flex flex-col gap-y-1">
        <div class="flex items-start gap-y-1">
            <span class="mr-1.5 italic font-normal">Vote: </span>
            <span class="font-semibold text-gray-100">{{ data.vote }}</span>
        </div>

        <div class="flex items-start">
            <span class="mr-1.5 italic font-normal">Option: </span>
            <span class="font-semibold text-gray-100">{{ data.displayId }}:&nbsp;{{ data.option }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
    defineProps<{
        data: {
            displayId: string;
            vote: string;
            option: string;
        };
    }>();
</script>

<style scoped></style>
