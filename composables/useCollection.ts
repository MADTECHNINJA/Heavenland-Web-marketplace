import { mapState } from 'pinia';
import { useListingsStore } from '~/store/listings';
import { useCollectionStore } from '~/store/collections';

export const useCollection = () => {
    return {
        listings: (collectionId: string) =>
            mapState(useListingsStore, {
                fetched: (store) => store.collections[collectionId].fetched,
                error: (store) => store.collections[collectionId].error,
                data: (store) => store.collections[collectionId].data?.items,
                dataCount: (store) => store.collections[collectionId].data?.items?.length,
                totalCount: (store) => store.collections[collectionId].data?.totalCount,
                clear: (store) => store.collections[collectionId].clear(),
            }),

        metadata: (collectionId: string) =>
            mapState(useCollectionStore, {
                fetched: (store) => store.metadata[collectionId].fetched,
                error: (store) => store.metadata[collectionId].error,
                data: (store) => store.metadata[collectionId].data,
            }),
    };
};
