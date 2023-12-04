import { defineStore } from 'pinia';
import { DataWrapper } from '@/types/DataWrapper.types';
import { logger } from '@/plugins/logger.client';
import { API } from '~/api';
import { ParcelListing } from '~/types/Parcel.types';
import { QueryProvider } from '~/types/QueryProvider.types';
import { APIResponse } from '~/api/types';
import { CollectionName } from '~/types/Collection.types';
import { LoyaltyListing } from '~/types/Loyalty.types';
import { SolamidsListing } from '~/types/Solamids.types';
import { AlphaListing } from '~/types/Alphas.types';
import { ParagonListing } from '~/types/collections/Paragons.types';
import { ExcomsListing } from '~/types/collections/Excoms.types';

export const useListingsStore = defineStore({
    id: 'listings',

    state: () => ({
        collections: {
            parcels: new DataWrapper<APIResponse<ParcelListing[]>>(),
            loyalties: new DataWrapper<APIResponse<LoyaltyListing[]>>(),
            solamids: new DataWrapper<APIResponse<SolamidsListing[]>>(),
            alphas: new DataWrapper<APIResponse<AlphaListing[]>>(),
            paragons: new DataWrapper<APIResponse<ParagonListing[]>>(),
            excoms: new DataWrapper<APIResponse<ExcomsListing[]>>(),
        },
    }),

    actions: {
        async fetchCollection(identifier: CollectionName, queryProvider: QueryProvider, append?: boolean) {
            logger.info('[COLLECTIONS] Fetching new collection with ID', identifier);

            try {
                const collection = await API.ListingService.getListings(identifier, queryProvider);

                if (collection) {
                    if (this.collections[identifier].data?.items?.length && append) {
                        collection.items = [...this.collections[identifier].data.items, ...collection.items];
                    }

                    this.collections[identifier].setData(collection);
                } else {
                    this.collections[identifier].setError();
                }
            } catch (error: any) {
                this.collections[identifier].setError();

                logger.error(error);
                throw new Error(error);
            }
        },
    },
});
