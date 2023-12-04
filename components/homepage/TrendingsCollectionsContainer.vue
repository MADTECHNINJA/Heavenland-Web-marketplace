<template>
    <div
        class="flex w-full justify-center lg:w-auto flex-col px-4 items-center lg:items-start sm:grid sm:grid-cols-1 md:grid-cols-3 mt-6 mb-4 gap-4 lg:gap-8"
    >
        <template v-for="(collection, index) in collections" :key="index">
            <HomepageTrendingsCard
                :description="collection.data.description"
                :name="collection.data.name"
                :img="collection.data.img"
                @click="$router.push('/collections/' + collection.data.route)"
            />
        </template>
    </div>
</template>

<script lang="ts" setup>
    defineProps<{
        collections: Array<any>;
    }>();
</script>

<style scoped></style>
