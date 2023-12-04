<template>
    <div
        class="bg-indigo-930 relative rounded-t-lg relative w-full shadow not:disabled:cursor-pointer hover:brightness-125 transition-all"
        :class="[
            { [selectableProps]: selectable && !disabled },
            { 'rounded-b-lg': !hasExtension },
            { 'opacity-50 cursor-auto': disabled },
        ]"
        @click="redirectToDetail"
    >
        <ListingOwnedNftBadge v-if="isInWallet" />

        <div class="relative">
            <div
                class="rounded-t-md aspect-square bg-indigo-940 overflow-hidden w-full"
                :class="{ 'animate-pulse': item.image && !loaded }"
            >
                <img
                    v-if="item.image"
                    v-lazy="{ src: lazyOptions.src, lifecycle: lazyOptions.lifecycle }"
                    :class="{ 'opacity-0': !loaded }"
                    :alt="item.name"
                />

                <div v-else>
                    <FontAwesomeIcon
                        icon="image-slash"
                        class="absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2"
                    />

                    <img
                        :src="bgCover"
                        class="opacity-[15%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                </div>
            </div>
        </div>

        <div class="px-3 py-5 flex flex-col items-center">
            <h2 class="text-sm leading-6 font-semibold text-gray-100">
                {{ item.name }}
            </h2>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { RouteLocationRaw, useRouter } from 'vue-router';
    import { ref, reactive, computed } from 'vue';
    import { useAccountStore } from '~/store/account';
    import { useWallet } from 'solana-wallets-vue';
    import { IAlphaBase } from '~/types/Alphas.types';
    import { INftBase } from '~/types/Nft.types';
    import { CollectionFactory } from '~/types/CollectionFactory.types';
    import NftService, { ImageResource } from '~/api/_services/NftService';

    const { publicKey } = useWallet();

    const accountStore = useAccountStore();

    const router = useRouter();

    const props = defineProps<{
        item: INftBase;
        selectable?: boolean;
        showOwnedBadge?: boolean;
        hasExtension?: boolean;
        disabled?: boolean;
        cardRedirect?: (item: IAlphaBase) => RouteLocationRaw;
    }>();

    const selectableProps = 'hover:shadow-lg cursor-pointer transition-shadow';

    const hasConnectedWallet = computed(() => {
        return publicKey.value !== null;
    });

    const isInWallet = computed(() => {
        return (
            accountStore.tokens[props.item.cname].fetched &&
            accountStore.tokens[props.item.cname].data?.findIndex((p) => p.mint === props.item.mint) !== -1 &&
            props.showOwnedBadge &&
            hasConnectedWallet.value
        );
    });

    const redirectToDetail = () => {
        if (props.selectable && props.cardRedirect && !props.disabled) {
            router.push(props.cardRedirect(props.item));
        }
    };

    const bgCover = computed(() => {
        return CollectionFactory.getCollectionCover(props.item.cname);
    });

    const loaded = ref(false);

    const lazyOptions = reactive({
        src: NftService.getImage({
            address: props.item.image,
            resource: ImageResource.URL,
        }),
        lifecycle: {
            loading: () => {
                loaded.value = false;
            },
            loaded: () => {
                loaded.value = true;
            },
        },
    });
</script>

<style scoped></style>
