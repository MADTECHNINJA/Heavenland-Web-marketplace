<template>
    <div class="gap-y-6 flex flex-col">
        <template v-for="i in 2" :key="i">
            <div>
                <div
                    class="w-[150px] h-[24px] bg-indigo-940 rounded-full animate-pulse mx-auto md:mx-0 mb-6"
                    v-if="route.path.includes('/account') || route.path === '/'"
                ></div>
                <div
                    class="flex-col items-center lg:items-start sm:grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 2xl:grid-cols-4"
                >
                    <NftCardSkeleton v-for="x in 6" :key="x" :price="!route.path.includes('/account')" />
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { useRoute } from '#app';

    const route = useRoute();
</script>
