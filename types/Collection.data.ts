import { CollectionDetails, CollectionName } from '~/types/Collection.types';
import { EParcelSymbol } from '~/types/Parcel.types';
import { ESolamidSymbol } from '~/types/Solamids.types';
import { EMetacitySymbol } from './collections/Metacity.types';
import { EAlphaSymbol } from '~/types/Alphas.types';
import { ELoyaltySymbol } from '~/types/Loyalty.types';
import { ESolanautsSymbol } from '~/types/collections/Solanauts.types';
import { EParagonsSymbol } from '~/types/collections/Paragons.types';
import { EExcomsSymbol } from '~/types/collections/Excoms.types';
import { EPrimateSymbol } from '~/types/collections/Primates.types';
import { ED0ggiesSymbol } from '~/types/collections/D0ggies.types';
import { EABCSymbol } from '~/types/collections/ABC.types';
import { EAnybodiesSymbol } from '~/types/collections/Anybodies.types';

export const CollectionSymbol = new Map<CollectionName, { [key: string]: string }>([
    [CollectionName.METACITY, EMetacitySymbol],
    [CollectionName.PARCELS, EParcelSymbol],
    [CollectionName.LOYALTIES, ELoyaltySymbol],
    [CollectionName.SOLAMIDS, ESolamidSymbol],
    [CollectionName.ALPHAS, EAlphaSymbol],
    [CollectionName.SOLANAUTS, ESolanautsSymbol],
    [CollectionName.PARAGONS, EParagonsSymbol],
    [CollectionName.EXCOMS, EExcomsSymbol],
    [CollectionName.PRIMATES, EPrimateSymbol],
    [CollectionName.ANYBODIES, EAnybodiesSymbol],
    [CollectionName.ABC, EABCSymbol],
    [CollectionName.D0GGIES, ED0ggiesSymbol],
]);

export const CollectionList = new Map<CollectionName, CollectionDetails>([
    [
        CollectionName.PARAGONS,
        {
            id: 'heavenland-paragons',
            name: 'Paragons',
            creator: 'Heavenland',
            isHeavenland: true,
            isComingSoon: false,
            featureFlags: {
                allowListing: true,
            },
            unit: 'Paragon',
            description:
                "Paragon is a new class of NFT that's been introduced in Heavenland. It's breedable, it provides a lot of utilities to its owner, and it looks sexy. Paragon is very closely tied with PFP - if PFP is a profile picture, Paragon is the frame around it, which enhances not only the PFP but also the avatar qualities in the game.",
        },
    ],
    [
        CollectionName.METACITY,
        {
            id: 'metacity',
            name: 'MetaCity',
            creator: 'MetaCity',
            isHeavenland: false,
            isComingSoon: false,
            featureFlags: {
                allowStaking: true,
                allowDao: true,
            },
            unit: 'MetaCity Pass',
            description:
                'The MetaCity Organization Collection is a 3 tier NFT pass that grants its owners access to the project’s utilities, ranging from access to exclusive properties to Play-To-Earn opportunities in a metaverse.',
        },
    ],
    [
        CollectionName.SOLANAUTS,
        {
            id: 'solanauts',
            name: 'Solanauts',
            creator: 'Zero G Labs',
            isHeavenland: false,
            isComingSoon: false,
            featureFlags: {
                allowStaking: true,
            },
            unit: 'Solanaut',
            description:
                'An Exclusive 500 NFT Collection, the First on Solana, Representing our Wonder of the Universe and our Yearning for Exploration into the Unknown. Featuring Derivative Collection airdrops, Quarterly Revolution Rewards Raffles and more.',
        },
    ],
    [
        CollectionName.EXCOMS,
        {
            id: 'excoms',
            name: 'Excom Society',
            creator: 'Excom',
            isHeavenland: false,
            isComingSoon: false,
            featureFlags: {
                allowListing: true,
                allowStamping: true,
            },
            unit: 'Excom',
            description: 'From the dust of a burning world, a society that should have never existed has been born.',
        },
    ],
    [
        CollectionName.ALPHAS,
        {
            id: 'heavenland-alphas',
            name: 'Alphas',
            creator: 'Heavenland',
            isHeavenland: true,
            isComingSoon: false,
            featureFlags: {
                allowListing: true,
                allowStamping: true,
            },
            unit: 'Alpha',
            description:
                'Where there is life there is tribe. No Metaverse could exist without Avatars and Heavenland is not an exception. In the world of Heavenland our Avatars are unique, special, bring joy and utility to holders and also work as a PFP collection that would shine on your Twitter profile.',
        },
    ],
    [
        CollectionName.PARCELS,
        {
            id: 'heavenland-parcels',
            name: 'Parcels',
            creator: 'Heavenland',
            isHeavenland: true,
            isComingSoon: false,
            featureFlags: {
                allowStaking: true,
                allowDao: true,
                allowListing: true,
            },
            unit: 'Parcel',
            description:
                "Heaven Land's Clusters comprise 30,000 individual Parcels (in total) with sizes of 25x25m. Simply put, Parcels are NFTs with some attributes directly encoded into NFT and some attributes derived from aParcel location in the Heaven Land.",
        },
    ],
    [
        CollectionName.LOYALTIES,
        {
            id: 'heavenland-loyalties',
            name: 'Loyalties',
            creator: 'Heavenland',
            unit: 'Loyalty',
            isHeavenland: true,
            isComingSoon: false,
            featureFlags: {
                allowListing: true,
            },
            description:
                'Heaven Land builds a virtual reality platform where users can experience, improve and monetize their assets. Loyalty NFTs serve as multifunctional assets for the Heaven Land Metaverse. The NFTs bring their owners advantages every time they make an HTO payment through Heaven Land services - marketplace, parcel merging, avatar breeding, in-game payments, with much more to come.',
        },
    ],
    [
        CollectionName.SOLAMIDS,
        {
            id: 'solamids',
            name: 'Solamids',
            creator: 'Solamids',
            unit: 'Apartment',
            isHeavenland: false,
            isComingSoon: false,
            featureFlags: {
                allowStaking: true,
                allowDao: true,
                allowListing: true,
            },
            description:
                'Solamids represents a building in Metaverse of Heaven Land. Owners of Solamids apartments will be able to experience, upgrade and monetize their assets while interacting with other users on the platform. The ultimate goal is to offer anyone a possibility to build their own wealth and live their dream life.',
        },
    ],
    [
        CollectionName.PRIMATES,
        {
            id: 'primates',
            name: 'Primates',
            creator: 'Primates',
            unit: 'Primate',
            isHeavenland: false,
            isComingSoon: false,
            featureFlags: {
                allowStamping: true,
            },
            description:
                'Primates is a project built for the community, by the community. The goal of Primates is to create a brand that facilitates a seamless adoption of the web3 space through our community fueled ventures and collaborations.',
        },
    ],
    [
        CollectionName.ANYBODIES,
        {
            id: 'anybodies',
            name: 'Anybodies',
            creator: 'Anybodies',
            unit: 'Anybody',
            isHeavenland: false,
            isComingSoon: false,
            featureFlags: {
                allowStamping: true,
            },
            description:
                'The leading web3 apparel brand. Holder Benefits: Stake to earn $STYLE, our utility token that can be used for in store discounts and giveaways. Whitelist reserved on all collaborations for holders. Exclusive benefits to the Diamond Vault, solana’s largest NFT staking platform.',
        },
    ],
    [
        CollectionName.ABC,
        {
            id: 'abc',
            name: 'ABC',
            creator: 'ABC',
            unit: 'ABC',
            isHeavenland: false,
            isComingSoon: false,
            featureFlags: {
                allowStamping: true,
            },
            description:
                'ABC - Abracadabra A collection of 10K immutable NFTs, 0% royalties. Made to remind you of how fun things were when we were kids, before growing up - let’s never stop having fun!',
        },
    ],
    [
        CollectionName.D0GGIES,
        {
            id: 'd0ggies',
            name: 'd0ggies',
            creator: 'd0ggies',
            unit: 'd0ggies',
            isHeavenland: false,
            isComingSoon: false,
            featureFlags: {
                allowStamping: true,
            },
            description:
                'd0GGies is a PFP collection cute d0GGs living in web3. Their purpose is to create a strong community of holders who can shine on Twitter with their d0GGie PFP while earning rewards and getting advantages in web3.',
        },
    ],
]);
