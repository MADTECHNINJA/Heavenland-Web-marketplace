<template>
    <div
        class="flex flex-col items-center lg:items-start sm:grid sm:grid-cols-2 md:grid-cols-3 xlg:grid-cols-3 lg:grid-cols-3 xxl:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-6 gap-3"
    >
        <template v-for="(collection, index) in collections" :key="index">
            <CollectionCardSkeleton bottom-panel v-if="!collection.fetched" />

            <CollectionCard
                v-else-if="collection.data"
                display-price
                :name="collection.data.name"
                :loading="!collection.fetched"
                :total-listed="collection.data.stats.totalListed"
                :floor-price="collection.data.stats.floorPrice"
                :img="CollectionFactory.getCollectionCover(collection.data.id)"
                :coming-soon="isComingSoon(collection.data.route)"
                @click="
                    !isComingSoon(collection.data.route) ? $router.push('/collections/' + collection.data.route) : ''
                "
            />
        </template>
    </div>
</template>

<script lang="ts" setup>
    import { CollectionMetadata, CollectionName } from '~/types/Collection.types';
    import { CollectionList } from '~/types/Collection.data';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { CollectionFactory } from '~/types/CollectionFactory.types';

    defineProps<{
        collections: DataWrapper<CollectionMetadata>[];
    }>();

    const isComingSoon = (id: string) => {
        return CollectionList.get(id as CollectionName)?.isComingSoon;
    };
</script>

<style scoped></style>
