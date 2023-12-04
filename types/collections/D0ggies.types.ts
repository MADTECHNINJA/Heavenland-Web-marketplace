import { INftBase } from '../Nft.types';
import { Attributes } from '~/types/Listing.types';
import { CollectionName } from '../Collection.types';
import type { OffChainMetadata, OnChainMetadata } from '@/js/metaplex';
import { IStampable } from '~/types/Paragon.types';

export enum ED0ggiesSymbol {
    D0GGIES = 'D0GG',
}

export interface ID0ggiesBase extends INftBase {
    readonly id: string;
    readonly type: string;
    readonly name: string;
    readonly image?: string;
    readonly royalties: number;
    readonly mint: string;
    readonly attributes?: Array<Attributes>;
}

export class D0ggies implements ID0ggiesBase, IStampable {
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

        this.cname = CollectionName.D0GGIES;
        this.type = onChain.data.symbol;
        this.royalties = onChain.data.sellerFeeBasisPoints;
        this.id = offChain?.external_url?.slice(offChain?.external_url?.lastIndexOf('/') + 1) ?? onChain.data.name;
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

    cropParameters(size: number) {
        const x = size / 2;
        const y = size / 2;

        return {
            x,
            y,
            r: Math.min(x, y) - 2,
        };
    }
}
