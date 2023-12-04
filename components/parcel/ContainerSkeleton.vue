<template>
    <div class="gap-y-6 flex flex-col">
        <template v-for="i in 2" :key="i">
            <div>
                <div
                    class="w-[150px] h-[24px] bg-indigo-920 rounded-full animate-pulse mx-auto md:mx-0 mb-6"
                    v-if="route.path === '/'"
                ></div>
                <div
                    :class="
                        route.path.includes('/account') || route.path.includes('/staking')
                            ? 'md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  '
                            : 'md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4'
                    "
                    class="flex flex-col items-center lg:items-start sm:grid sm:grid-cols-2 gap-3"
                >
                    <ParcelCardSkeleton v-for="x in 10" :key="x" :price="!route.path.includes('/account')" />
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { useRoute } from '#app';

    const route = useRoute();
</script>
