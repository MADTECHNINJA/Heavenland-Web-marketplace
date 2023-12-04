import axios from 'axios';

import { logger } from '@/plugins/logger.client';

import { Root, Path } from '@/api/resources';
import { APIResponse } from '~/api/types';
import { QueryProvider } from '~/types/QueryProvider.types';
import { Listing } from '~/types/Listing.types';
import { CollectionName } from '~/types/Collection.types';
import { CollectionFactory } from '~/types/CollectionFactory.types';

class ListingService {
    async getListings(collectionId: CollectionName, queryProvider: QueryProvider): Promise<APIResponse<Listing[]>> {
        await logger.info('[API]', 'ListingService', 'getLístings', collectionId, queryProvider);

        const res = await axios.get(`${Root.MARKETPLACE}/${Path.LISTINGS}${queryProvider.decode()}`);

        res.data.items = res.data.items.map((l) => CollectionFactory.createListing(collectionId, l));

        return res.data;
    }
}

export default new ListingService();
