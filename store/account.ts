import { defineStore } from 'pinia';
import { ITokenMetadata, Metaplex } from '@/js/metaplex';
import type { PublicKey } from '@solana/web3.js';
import type { IParcelBase } from '@/types/Parcel.types';
import { DataWrapper } from '@/types/DataWrapper.types';
import { logger } from '@/plugins/logger.client';
import { API } from '~/api';
import { CollectionList } from '~/types/Collection.data';
import { ParcelListing } from '~/types/Parcel.types';
import { ActivityResponse, PurchaseState } from '~/types/Activity.types';
import { QueryProvider } from '~/types/QueryProvider.types';
import { APIResponse } from '~/api/types';
import { ILoyaltyBase, LoyaltyListing } from '~/types/Loyalty.types';
import { CollectionDetails, CollectionName } from '~/types/Collection.types';
import { ISolamidsBase, SolamidsListing } from '~/types/Solamids.types';
import { filterTokens, sortTokens } from '~/types/Collection.utils';
import { AlphaListing, IAlphaBase } from '~/types/Alphas.types';
import { Solanauts } from '~/types/collections/Solanauts.types';
import { IParagonBase, ParagonListing } from '~/types/collections/Paragons.types';
import { CollectionFactory } from '~/types/CollectionFactory.types';
import { ExcomsListing, IExcomsBase } from '~/types/collections/Excoms.types';
import { IMetacityBase } from '~~/types/collections/Metacity.types';
import { IPrimateBase } from '~/types/collections/Primates.types';
import { ID0ggiesBase } from '~/types/collections/D0ggies.types';
import { IABCBase } from '~/types/collections/ABC.types';
import { IAnybodiesBase } from '~/types/collections/Anybodies.types';

export const useAccountStore = defineStore({
    id: 'account',

    state: () => ({
        tokens: {
            parcels: new DataWrapper<IParcelBase[]>(),
            loyalties: new DataWrapper<ILoyaltyBase[]>(),
            solamids: new DataWrapper<ISolamidsBase[]>(),
            alphas: new DataWrapper<IAlphaBase[]>(),
            solanauts: new DataWrapper<Solanauts[]>(),
            paragons: new DataWrapper<IParagonBase[]>(),
            excoms: new DataWrapper<IExcomsBase[]>(),
            metacity: new DataWrapper<IMetacityBase[]>(),
            primates: new DataWrapper<IPrimateBase[]>(),
            anybodies: new DataWrapper<IAnybodiesBase[]>(),
            abc: new DataWrapper<IABCBase[]>(),
            d0ggies: new DataWrapper<ID0ggiesBase[]>(),
        },
        listedTokens: {
            parcels: new DataWrapper<APIResponse<ParcelListing[]>>(),
            loyalties: new DataWrapper<APIResponse<LoyaltyListing[]>>(),
            solamids: new DataWrapper<APIResponse<SolamidsListing[]>>(),
            alphas: new DataWrapper<APIResponse<AlphaListing[]>>(),
            paragons: new DataWrapper<APIResponse<ParagonListing[]>>(),
            excoms: new DataWrapper<APIResponse<ExcomsListing[]>>(),
        },
        walletActivity: new DataWrapper<APIResponse<ActivityResponse[]>>(),
    }),

    getters: {
        getListingTokenCollections: (state) => {
            const listingCollections = {};

            for (const [cname, tokens] of Object.entries(state.tokens)) {
                if (CollectionList.get(cname as CollectionName)?.featureFlags?.allowListing) {
                    listingCollections[cname] = tokens;
                }
            }

            return listingCollections;
        },

        getStampingPfpTokenCollections: (state) => {
            const listingCollections = {};

            for (const [cname, tokens] of Object.entries(state.tokens)) {
                if (CollectionList.get(cname as CollectionName)?.featureFlags?.allowStamping) {
                    listingCollections[cname] = tokens;
                }
            }

            return listingCollections;
        },

        getStakingTokenCollections: (state): { [key: string]: DataWrapper<any> } => {
            const stakingCollections = {};

            for (const [cname, tokens] of Object.entries(state.tokens)) {
                if (CollectionList.get(cname as CollectionName)?.featureFlags?.allowStaking) {
                    stakingCollections[cname] = tokens;
                }
            }

            return stakingCollections;
        },

        escrowProcessingAmount: (state) =>
            state.walletActivity.data?.items?.reduce((acc, a) => {
                const isBuyNowProcessing = a.buyNow && a.purchaseState === PurchaseState.PROCESSING;
                return acc + (isBuyNowProcessing ? a.offeredPrice : 0);
            }, 0) ?? 0,
    },

    actions: {
        clearTokens() {
            for (const tokenType in this.tokens) {
                this.tokens[tokenType].clear();
            }
        },

        clearUser() {
            this.clearTokens();

            for (const tokenType in this.listedTokens) {
                this.listedTokens[tokenType].clear();
            }

            this.walletActivity.clear();
        },

        async fetchWalletActivity(publicKey: PublicKey) {
            try {
                const queryProvider = new QueryProvider([
                    ['filter[wallet]', publicKey.toBase58()],
                    ['sort-by[date]', 'desc'],
                ]);

                const walletActivity = await API.ActivityService.getActivities(queryProvider);

                if (walletActivity) {
                    this.walletActivity.setData(walletActivity);
                } else {
                    this.walletActivity.setError();
                }
            } catch (error: any) {
                this.walletActivity.setError();

                logger.error(error);
                throw new Error(error);
            }
        },

        async refetchTokens(collection: CollectionName, publicKey: PublicKey | null) {
            this.tokens[collection].clear();

            await this.fetchTokens(publicKey);
        },

        async fetchTokensCollection(
            publicKey: PublicKey | null,
            allTokens: ITokenMetadata[],
            collectionId: CollectionName,
            collectionData: CollectionDetails
        ) {
            if (collectionData.isComingSoon) {
                return;
            }

            const tokens = filterTokens(collectionId, allTokens);

            try {
                if (tokens) {
                    this.tokens[collectionId].setData(tokens);
                } else {
                    this.tokens[collectionId].setError();
                }
            } catch (error: any) {
                this.tokens[collectionId].setError();

                logger.error(error);
                throw new Error(error);
            }

            if (!collectionData.featureFlags?.allowListing) {
                return;
            }

            try {
                const queryProvider = new QueryProvider([
                    ['filter[collection]', collectionData.id],
                    ['filter[wallet]', publicKey.toBase58()],
                    ['limit', '50'],
                ]);

                const listedTokens = await API.ListingService.getListings(collectionId, queryProvider);

                if (listedTokens) {
                    const typedArray = CollectionFactory.typeListingResponseArray(collectionId, listedTokens);
                    this.listedTokens[collectionId].setData(typedArray as any);
                } else {
                    this.listedTokens[collectionId].setError();
                }

                if (!this.listedTokens[collectionId].error && !this.tokens[collectionId].error) {
                    this.tokens[collectionId].setData(
                        sortTokens(collectionId, this.tokens[collectionId].data, this.listedTokens[collectionId].data)
                    );
                }
            } catch (error: any) {
                this.listedTokens[collectionId].setError();

                logger.error(error);
                throw new Error(error);
            }
        },

        async fetchTokens(publicKey: PublicKey | null) {
            const allTokens = await Metaplex.getInstance().fetchTokens(publicKey);

            await Promise.all(
                Array.from(CollectionList.entries()).map(([collectionId, collectionDetails]) =>
                    this.fetchTokensCollection(publicKey, allTokens, collectionId, collectionDetails)
                )
            );
        },
    },
});
