import type { OffChainMetadata, OnChainMetadata } from '@/js/metaplex';
import { IStakable } from '~/types/Staking.types';
import { CollectionName } from '~/types/Collection.types';

export enum ESolanautsSymbol {
    SOLANAUT = 'NAUT',
}

export class Solanauts implements IStakable {
    onChain: OnChainMetadata;
    offChain: OffChainMetadata;

    readonly id: string;
    readonly name: string;
    readonly royalties: number;
    readonly type: string;
    readonly cname: CollectionName;

    constructor(onChain: OnChainMetadata, offChain: OffChainMetadata) {
        this.onChain = onChain;
        this.offChain = offChain;

        this.cname = CollectionName.SOLANAUTS;
        this.type = onChain.data.symbol;
        this.royalties = onChain.data.sellerFeeBasisPoints;
        this.id = offChain?.external_url.slice(offChain?.external_url.lastIndexOf('/') + 1) ?? onChain.data.name;
        this.name = onChain.data.name;
    }

    get image() {
        return this.offChain?.image;
    }

    get mint() {
        return this.onChain.mint;
    }
}
