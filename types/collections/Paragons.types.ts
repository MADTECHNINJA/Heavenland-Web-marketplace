import type { OffChainMetadata, OnChainMetadata } from '@/js/metaplex';
import { CollectionMetadata, CollectionName } from '~/types/Collection.types';
import { INftBase } from '~/types/Nft.types';
import { Attributes, IListable, Listing } from '~/types/Listing.types';

export enum EParagonsSymbol {
    PARAGON = 'PARAGON',
}

export enum Attribute {
    SCORE = 'Score',
}

export enum CoreAttribute {
    STAMINA = 'Stamina',
    STAMINA_RECOVERY_RATE = 'Stamina Recovery Rate',
    STAMINA_USAGE_DURING_SPRINT = 'Stamina Usage during Sprint',
    STAMINA_USAGE_PER_TRANSLOCATION = 'Stamina Usage per Translocation',
    WALK_SPEED = 'Walk Speed',
    SPRINT_SPEED = 'Sprint Speed',
    JUMP_HEIGHT = 'Jump Height',
    MAX_TRANSLOCATION_DISTANCE = 'Max Translocation Distance',
    TRANSLOCATION_RECOVERY = 'Translocation Recovery',
}

export interface IParagonBase extends INftBase {
    readonly id: string;
    readonly type: string;
    readonly name: string;
    readonly image?: string;
    readonly royalties: number;
    readonly mint: string;
    readonly attributes?: Array<Attributes>;
    readonly tier?: string;
    readonly score?: string;
    readonly breedCount?: number;
}

export class Paragons implements IListable, IParagonBase {
    onChain: OnChainMetadata;
    offChain: OffChainMetadata;

    readonly attributes?: Array<Attributes>;
    readonly id: string;
    readonly name: string;
    readonly royalties: number;
    readonly type: string;
    readonly cname: CollectionName;

    constructor(onChain: OnChainMetadata, offChain: OffChainMetadata) {
        this.onChain = onChain;
        this.offChain = offChain;

        this.cname = CollectionName.PARAGONS;
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

    get tier() {
        return this.attributes?.find((a) => a.displayName === 'Tier')?.value as string;
    }

    get score() {
        return this.attributes?.find((a) => a.displayName === 'Score')?.value as string;
    }

    get breedCount() {
        return Number(this.attributes?.find((a) => a.displayName === 'Breed Count')?.value);
    }
}

export class ParagonListingNFT implements IParagonBase, IListable {
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
        this.attributes = data.attributes.sort((a, b) => (a.displayName[0] >= b.displayName[0] ? 1 : -1));
        this.royalties = data.royalties;
        this.type = data.symbol;
        this.image = data.image;
        this.collection = data.collection;
        this.cname = CollectionName.PARAGONS;
    }
}

export class ParagonListing extends Listing {
    readonly nft: ParagonListingNFT;

    constructor(data: any) {
        super(data);

        data.nft.mint = data.nft.address;

        this.nft = new ParagonListingNFT(data.nft);
    }
}
