<template>
    <div class="flex justify-center lg:justify-start">
        <div
            @click="goBack(path)"
            class="text-sm z-40 w-fit cursor-pointer mb-1 text-gray-400 text-center lg:text-left hover:text-white transition-all ease-in-out duration-500"
        >
            <FontAwesomeIcon :icon="['fas', 'chevron-left']" class="mr-1" />
            <span> {{ title }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router';

    const props = defineProps<{
        title: string;
        path?: string;
    }>();

    const router = useRouter();
    const goBack = () => {
        if (props.path) {
            return router.push({ path: props.path });
        }
        return router.back();
    };
</script>

<style></style>
