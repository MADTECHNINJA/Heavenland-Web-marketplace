import { CollectionName } from '~/types/Collection.types';
import { Parcel, ParcelListing, EParcelSymbol, ParcelBucket } from '~/types/Parcel.types';
import { Loyalty, LoyaltyListing } from '~/types/Loyalty.types';
import { Solamids, SolamidsListing } from '~/types/Solamids.types';
import { Alpha, AlphaListing } from '~/types/Alphas.types';
import { ParagonListing, Paragons } from '~/types/collections/Paragons.types';
import { APIResponse } from '~/api/types';
import { ITokenMetadata } from '~/js/metaplex';
import { Solanauts } from '~/types/collections/Solanauts.types';
import { CollectionList, CollectionSymbol } from '~/types/Collection.data';
import parcelCollectionImg from 'assets/collections/heavenland-parcels.png';
import loyaltyCollectionImg from 'assets/collections/heavenland-loyalties.png';
import solamidsCollectionImg from 'assets/collections/solamids.png';
import alphasCollectionImg from 'assets/collections/heavenland-alphas.png';
import solanautsCollectionImg from 'assets/collections/excoms.png';
import paragonsCollectionImg from 'assets/collections/heavenland-paragons.png';
import excomsCollectionImg from 'assets/collections/excoms.png';
import metacityCollectionImg from 'assets/collections/metacity.png';
import primatesCollectionImg from 'assets/collections/primates.png';
import d0ggiesCollectionImg from 'assets/collections/d0ggies.png';
import anybodiesCollectionImg from 'assets/collections/anybodies.png';
import abcCollectionImg from 'assets/collections/abc.png';
import { Excoms, ExcomsListing } from '~/types/collections/Excoms.types';
import { Metacity } from './collections/Metacity.types';
import { ABC } from '~/types/collections/ABC.types';
import { Primates } from '~/types/collections/Primates.types';
import { Anybodies } from '~/types/collections/Anybodies.types';
import { D0ggies } from '~/types/collections/D0ggies.types';

export class CollectionFactory {
    static #updateAuthorities = {
        [CollectionName.METACITY]: import.meta.env.VITE_HL_UPDATE_AUTHORITY_METACITY.split(','),
        [CollectionName.PARCELS]: import.meta.env.VITE_HL_UPDATE_AUTHORITY_PARCELS.split(','),
        [CollectionName.SOLAMIDS]: import.meta.env.VITE_HL_UPDATE_AUTHORITY_SOLAMIDS.split(','),
        [CollectionName.ALPHAS]: import.meta.env.VITE_HL_UPDATE_AUTHORITY_ALPHAS.split(','),
        [CollectionName.EXCOMS]: import.meta.env.VITE_HL_UPDATE_AUTHORITY_EXCOMS.split(','),
        [CollectionName.PARAGONS]: import.meta.env.VITE_HL_UPDATE_AUTHORITY_PARAGONS.split(','),
        [CollectionName.LOYALTIES]: import.meta.env.VITE_HL_UPDATE_AUTHORITY_LOYALTIES.split(','),
        [CollectionName.SOLANAUTS]: import.meta.env.VITE_HL_UPDATE_AUTHORITY_SOLANAUTS.split(','),
        [CollectionName.ABC]: import.meta.env.VITE_HL_UPDATE_AUTHORITY_ABC.split(','),
        [CollectionName.D0GGIES]: import.meta.env.VITE_HL_UPDATE_AUTHORITY_D0GGIES.split(','),
        [CollectionName.ANYBODIES]: import.meta.env.VITE_HL_UPDATE_AUTHORITY_ANYBODIES.split(','),
        [CollectionName.PRIMATES]: import.meta.env.VITE_HL_UPDATE_AUTHORITY_PRIMATES.split(','),
    };

    public static createInstanceWithSymbol(symbol: string, t: ITokenMetadata) {
        const cname = Array.from(CollectionSymbol.entries())?.find(([_, v]) => Object.values(v)?.includes(symbol))?.[0];

        if (!cname) {
            throw new Error('[CF] createInstanceWithSymbol: cname null');
        }

        return this.createInstance(cname, t);
    }

    public static createInstance(cname: CollectionName, t: ITokenMetadata) {
        switch (cname) {
            case CollectionName.SOLANAUTS:
                return new Solanauts(t.onChain, t.offChain);

            case CollectionName.PARCELS:
                if (t.onChain.data.symbol === EParcelSymbol.PARCEL_BUCKET) {
                    return new ParcelBucket(t.onChain, t.offChain);
                } else {
                    return new Parcel(t.onChain, t.offChain);
                }

            case CollectionName.LOYALTIES:
                return new Loyalty(t.onChain, t.offChain);

            case CollectionName.SOLAMIDS:
                return new Solamids(t.onChain, t.offChain);

            case CollectionName.ALPHAS:
                return new Alpha(t.onChain, t.offChain);

            case CollectionName.PARAGONS:
                return new Paragons(t.onChain, t.offChain);

            case CollectionName.EXCOMS:
                return new Excoms(t.onChain, t.offChain);

            case CollectionName.METACITY:
                return new Metacity(t.onChain, t.offChain);

            case CollectionName.ABC:
                return new ABC(t.onChain, t.offChain);

            case CollectionName.PRIMATES:
                return new Primates(t.onChain, t.offChain);

            case CollectionName.ANYBODIES:
                return new Anybodies(t.onChain, t.offChain);

            case CollectionName.D0GGIES:
                return new D0ggies(t.onChain, t.offChain);
        }
    }

    public static typeListing(cname: CollectionName, data: any) {
        switch (cname) {
            case CollectionName.PARCELS:
                return data as ParcelListing;

            case CollectionName.LOYALTIES:
                return data as LoyaltyListing;

            case CollectionName.SOLAMIDS:
                return data as SolamidsListing;

            case CollectionName.ALPHAS:
                return data as AlphaListing;

            case CollectionName.PARAGONS:
                return data as ParagonListing;

            case CollectionName.EXCOMS:
                return data as ExcomsListing;

            default:
                return null;
        }
    }

    public static createListing(cname: CollectionName, data: any) {
        switch (cname) {
            case CollectionName.PARCELS:
                return new ParcelListing(data);

            case CollectionName.LOYALTIES:
                return new LoyaltyListing(data);

            case CollectionName.SOLAMIDS:
                return new SolamidsListing(data);

            case CollectionName.ALPHAS:
                return new AlphaListing(data);

            case CollectionName.PARAGONS:
                return new ParagonListing(data);

            case CollectionName.EXCOMS:
                return new ExcomsListing(data);
        }
    }

    public static typeListingArray(
        cname: CollectionName,
        data: any
    ): ParcelListing[] | LoyaltyListing[] | SolamidsListing[] | AlphaListing[] | ParagonListing[] {
        switch (cname) {
            case CollectionName.PARCELS:
                return data as ParcelListing[];

            case CollectionName.LOYALTIES:
                return data as LoyaltyListing[];

            case CollectionName.SOLAMIDS:
                return data as SolamidsListing[];

            case CollectionName.ALPHAS:
                return data as AlphaListing[];

            case CollectionName.PARAGONS:
                return data as ParagonListing[];

            case CollectionName.EXCOMS:
                return data as ExcomsListing[];

            default:
                return null;
        }
    }

    public static typeListingResponseArray(
        cname: CollectionName,
        data: any
    ):
        | APIResponse<ParcelListing[]>
        | APIResponse<LoyaltyListing[]>
        | APIResponse<SolamidsListing[]>
        | APIResponse<AlphaListing[]>
        | APIResponse<ParagonListing[]> {
        switch (cname) {
            case CollectionName.PARCELS:
                return data as APIResponse<ParcelListing[]>;

            case CollectionName.LOYALTIES:
                return data as APIResponse<LoyaltyListing[]>;

            case CollectionName.SOLAMIDS:
                return data as APIResponse<SolamidsListing[]>;

            case CollectionName.ALPHAS:
                return data as APIResponse<AlphaListing[]>;

            case CollectionName.PARAGONS:
                return data as APIResponse<ParagonListing[]>;

            case CollectionName.EXCOMS:
                return data as APIResponse<ExcomsListing[]>;

            default:
                return null;
        }
    }

    public static getCollectionCoverByCname = (cname: CollectionName) => {
        const id = CollectionList.get(cname)?.id;

        if (id) {
            return this.getCollectionCover(id);
        }
    };

    public static getCollectionCover = (id: string) => {
        switch (id) {
            case CollectionList.get(CollectionName.PARCELS).id:
                return parcelCollectionImg;

            case CollectionList.get(CollectionName.LOYALTIES).id:
                return loyaltyCollectionImg;

            case CollectionList.get(CollectionName.SOLAMIDS).id:
                return solamidsCollectionImg;

            case CollectionList.get(CollectionName.ALPHAS).id:
                return alphasCollectionImg;

            case CollectionList.get(CollectionName.SOLANAUTS).id:
                return solanautsCollectionImg;

            case CollectionList.get(CollectionName.PARAGONS).id:
                return paragonsCollectionImg;

            case CollectionList.get(CollectionName.EXCOMS).id:
                return excomsCollectionImg;

            case CollectionList.get(CollectionName.METACITY).id:
                return metacityCollectionImg;

            case CollectionList.get(CollectionName.PRIMATES).id:
                return primatesCollectionImg;

            case CollectionList.get(CollectionName.ABC).id:
                return abcCollectionImg;

            case CollectionList.get(CollectionName.ANYBODIES).id:
                return anybodiesCollectionImg;

            case CollectionList.get(CollectionName.D0GGIES).id:
                return d0ggiesCollectionImg;

            default:
                return null;
        }
    };

    public static getUpdateAuthorities = () => {
        return Object.values(CollectionFactory.#updateAuthorities).reduce((acc, item) => [...acc, ...item]);
    };

    public static getUpdateAuthority = (cname: CollectionName) => {
        return CollectionFactory.#updateAuthorities[cname];
    };
}
