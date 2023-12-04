import type { OffChainMetadata, OnChainMetadata } from '@/js/metaplex';
import { Attributes, IListable, Listing } from '~/types/Listing.types';
import { CollectionMetadata, CollectionName } from '~/types/Collection.types';
import { INftBase } from '~/types/Nft.types';

export enum ELoyaltySymbol {
    LOYALTY = 'LOYAL NFT',
}

export interface ILoyaltyBase extends INftBase {
    readonly id: string;
    readonly type: string;
    readonly name: string;
    readonly image?: string;
    readonly royalties: number;
    readonly mint: string;
    readonly attributes?: Array<Attributes>;
}

export class Loyalty implements IListable, ILoyaltyBase {
    onChain: OnChainMetadata;
    offChain: OffChainMetadata;

    readonly attributes: Array<Attributes>;
    readonly id: string;
    readonly name: string;
    readonly royalties: number;
    readonly type: string;
    readonly cname: CollectionName;

    constructor(onChain: OnChainMetadata, offChain?: OffChainMetadata) {
        this.onChain = onChain;
        this.offChain = offChain;

        this.cname = CollectionName.LOYALTIES;
        this.type = onChain.data.symbol;
        this.royalties = onChain.data.sellerFeeBasisPoints;
        this.id = offChain?.external_url.slice(offChain?.external_url.lastIndexOf('/') + 1) ?? onChain.data.name;
        this.name = onChain.data.name;
        this.attributes = offChain?.attributes
            .map((a: { trait_type: string; value: string | number }) => {
                return {
                    displayName: a.trait_type,
                    value: a.value,
                };
            })
            .sort((a, b) => (a.displayName[0] >= b.displayName[0] ? 1 : -1));
    }

    get image() {
        return this.offChain?.image;
    }

    get mint() {
        return this.onChain.mint;
    }
}

export class LoyaltyListingNFT implements ILoyaltyBase, IListable {
    id: string;
    mint: string;
    name: string;
    attributes: Array<Attributes>;
    royalties: number;
    type: string;
    image: string;
    collection: Pick<CollectionMetadata, 'id' | 'name' | 'traits'>;
    cname: CollectionName;

    constructor(data: any) {
        this.id = data.id;
        this.mint = data.mint;
        this.name = data.name;
        this.attributes = data.attributes?.sort((a, b) => (a.displayName[0] >= b.displayName[0] ? 1 : -1));
        this.royalties = data.royalties;
        this.type = data.symbol;
        this.image = data.image;
        this.collection = data.collection;
        this.cname = CollectionName.LOYALTIES;
    }
}

export class LoyaltyListing extends Listing {
    readonly nft: LoyaltyListingNFT;

    constructor(data: any) {
        super(data);

        data.nft.mint = data.nft.address;

        this.nft = new LoyaltyListingNFT(data.nft);
    }

    get mint() {
        return this.nft.mint;
    }
}
