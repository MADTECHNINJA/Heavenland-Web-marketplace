<template>
    <AppContainer>
        <AppTitle>Collections</AppTitle>

        <div class="mt-6 flex items-center justify-center md:justify-start">
            <div class="flex space-x-2 items-center">
                <p class="text-md font-bold">Heavenland</p>
            </div>
        </div>

        <CollectionContainer :collections="heavenlandCollections" />

        <div class="flex items-center justify-center md:justify-start mt-6">
            <div class="flex space-x-2 items-center">
                <p class="text-md font-bold">Partners</p>
            </div>
        </div>

        <CollectionContainer :collections="partneredCollections" />
    </AppContainer>
</template>

<script lang="ts" setup>
    import { useCollectionStore } from '~/store/collections';
    import { CollectionList } from '~/types/Collection.data';
    import { CollectionName } from '~/types/Collection.types';
    import { computed } from 'vue';

    const collectionStore = useCollectionStore();

    const heavenlandCollections = computed(() => {
        const hc = [];

        for (const [cname, tokens] of Object.entries(collectionStore.metadata)) {
            if (CollectionList.get(cname as CollectionName).isHeavenland) {
                hc.push(tokens);
            }
        }

        return hc;
    });

    const partneredCollections = computed(() => {
        const pc = [];

        for (const [cname, tokens] of Object.entries(collectionStore.metadata)) {
            if (!CollectionList.get(cname as CollectionName).isHeavenland) {
                pc.push(tokens);
            }
        }

        return pc;
    });
</script>

<style scoped></style>
