<template>
    <div class="rounded-lg">
        <div class="py-4 max-w-7xl">
            <div class="space-y-4">
                <div class="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
                    <h2 class="font-bold text-lg tracking-tight mt-1">{{ title }}</h2>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-6 lg:grid-flow-row gap-3">
                    <template v-for="(collection, index) in collectionsMetadata" :key="index">
                        <CollectionMiniCardSkeleton v-if="!collection.fetched" />
                        <CollectionMiniCard
                            @click="$router.push('/collections/' + collection.data.route)"
                            v-if="collection?.data?.stats?.totalListed > 0"
                            :title="collection?.data?.name"
                            :count="collection?.data?.stats?.totalListed"
                            :loading="!collection.fetched"
                            :img="CollectionFactory.getCollectionCover(collection?.data?.id)"
                        />
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useCollectionStore } from '~/store/collections';
    import { computed, reactive } from 'vue';
    import { useRoute } from '#app';

    import { CollectionMetadata, CollectionName } from '~/types/Collection.types';
    import { CollectionFactory } from '~/types/CollectionFactory.types';
    import { DataWrapper } from '~/types/DataWrapper.types';

    const route = useRoute();

    defineProps<{
        title: string;
    }>();

    const collectionStore = useCollectionStore();

    const currentCollectionId = computed(() => {
        return (
            Array.isArray(route.params.collection) ? route.params.collection[0] : route.params.collection
        ) as CollectionName;
    });

    const collectionsMetadata = computed(() => {
        const collections = reactive<DataWrapper<CollectionMetadata>[]>([]);

        for (const collectionId of Object.keys(collectionStore.metadata)) {
            if (currentCollectionId.value !== collectionId) {
                collections.push(collectionStore.metadata[collectionId]);
            }
        }

        return collections;
    });
</script>
