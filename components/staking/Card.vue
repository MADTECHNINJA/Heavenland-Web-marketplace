<template>
    <div
        class="bg-indigo-930 relative rounded-t-lg w-full shadow not:disabled:cursor-pointer transition-all"
        :class="[
            { [selectableProps]: selectable && !disabled },
            { 'rounded-b-lg': !hasExtension },
            { 'opacity-50 cursor-auto': disabled },
        ]"
        @click="redirectToDetail"
    >
        <div class="relative">
            <StakingDaoNftBadge v-if="allowsDao" />

            <div
                class="rounded-t-lg aspect-square bg-indigo-940 overflow-hidden"
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
                        :src="stakingBgImage"
                        alt="Staking"
                        class="opacity-[15%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    />
                </div>
            </div>

            <img
                v-if="(!item.image || loaded) && isFrozenImage"
                :src="getFrozenImage"
                alt="Frozen NFT"
                class="absolute top-0 left-0 rounded-t-lg"
                :class="[!item.image ? 'opacity-25' : 'opacity-50']"
            />
        </div>

        <div class="px-3 py-5 flex flex-col items-center">
            <div class="flex items-center h-12">
                <h2 class="text-sm leading-6 font-semibold text-gray-100">
                    {{ item.name }}
                </h2>
            </div>
        </div>

        <slot />
    </div>
</template>

<script lang="ts" setup>
    import { RouteLocationRaw, useRouter } from 'vue-router';
    import { computed, reactive, ref } from 'vue';
    import frozenTypeA from 'assets/staking/frozen-type-a.png';
    import frozenTypeB from 'assets/staking/frozen-type-b.png';
    import { IStakable } from '~/types/Staking.types';
    import { CollectionList } from '~/types/Collection.data';
    import { CollectionName } from '~/types/Collection.types';
    import { useUserInfo } from '~/store/staking/userPool';
    import { mapState } from 'pinia';
    import NftService, { ImageResource } from '~/api/_services/NftService';
    import { CollectionFactory } from '~/types/CollectionFactory.types';

    const router = useRouter();

    const props = defineProps<{
        item: IStakable;
        selectable?: boolean;
        bottomRounded?: boolean;
        disabled?: boolean;
        hasExtension: boolean;
        cardRedirect?: (item: IStakable) => RouteLocationRaw;
    }>();

    const allowsDao = computed(() => {
        return CollectionList.get(props.item.cname).featureFlags?.allowDao;
    });

    const selectableProps = 'hover:brightness-125 hover:shadow-lg cursor-pointer transition-shadow';

    const stakingBgImage = computed(() => {
        return CollectionFactory.getCollectionCoverByCname(props.item.cname);
    });

    const stakedTokens = computed(() => {
        return mapState(useUserInfo, {
            fetched: (store) => store.stakedTokens.fetched,
            error: (store) => store.stakedTokens.error,
            data: (store) => store.stakedTokens.data,
        });
    });

    const isFrozenImage = computed(() => {
        return stakedTokens.value.data()?.find((p) => p.mint === props.item.mint);
    });

    const getFrozenImage = computed(() => {
        switch (props.item.cname) {
            case CollectionName.SOLAMIDS:
                return frozenTypeB;

            default:
                return frozenTypeA;
        }
    });

    const redirectToDetail = () => {
        if (props.selectable && props.cardRedirect && !props.disabled) {
            router.push(props.cardRedirect(props.item));
        }
    };

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
