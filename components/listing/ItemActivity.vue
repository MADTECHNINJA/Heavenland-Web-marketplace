<template>
    <section class="rounded-lg w-full flex flex-col">
        <AppCardTitle title="Item activity" icon="list-timeline" />
        <AppTable
            sharp
            isPaginated
            :allowFilter="false"
            :columns="columns"
            :fetched="activities.fetched"
            :data="data"
            unavailable="No data available for this NFT."
        >
            <template #createdAt="{ item }">
                {{ formatDateWithTime(item.createdAt, true) }}
            </template>
            <template #price="{ item }">
                <template class="flex">
                    <span v-if="item?.price">
                        {{ formatNumberToDecimal(item?.price) }}
                        <img :src="htoCurrency" class="h-5 mb-1 rounded-full inline-block" />
                    </span>
                    <span v-else-if="item?.offeredPrice">
                        {{ formatNumberToDecimal(item?.offeredPrice) }}
                        <img :src="htoCurrency" class="h-5 mb-1 rounded-full inline-block" />
                    </span>
                    <span v-else>--</span>
                </template>
            </template>

            <template #type="{ item }">
                <span>{{ ActivityActionTitle[item.type] }} </span>
            </template>

            <template #wallet.id="{ item }">
                <template v-if="item?.wallet?.id">
                    <template v-if="!isWalletAddress(item?.wallet?.id)">
                        <NuxtLink
                            v-if="item?.wallet?.id"
                            :to="'https://solscan.io/account/' + item.wallet.id"
                            target="_blank"
                        >
                            <img :src="solscanLogo" alt="Solscan" class="mr-2 mb-0.5 h-4 w-4 inline-block" />
                        </NuxtLink>
                        <FontAwesomeIcon
                            v-if="item?.wallet?.id"
                            :icon="['fas', 'copy']"
                            class="mr-2 z-99 text-indigo-500 hover:text-indigo-400 cursor-pointer"
                            @click="copyClipboard(item.wallet.id)"
                        />
                        <span>{{ formatAddress(item.wallet.id) }} </span>
                    </template>
                    <span v-else>You</span>
                </template>
                <span v-else>--</span>
            </template>

            <template #transactionId="{ item }">
                <FontAwesomeIcon
                    v-if="item?.transactionId"
                    :icon="['fas', 'copy']"
                    class="mr-2 z-99 text-indigo-500 hover:text-indigo-400 cursor-pointer"
                    @click="copyClipboard(item.transactionId)"
                />
                <span>{{ formatAddress(item.transactionId) }} </span>
            </template>

            <template #wallet.buyer.id="{ item }">
                <template v-if="item?.wallet?.buyer?.id">
                    <template v-if="!isWalletAddress(item?.wallet?.buyer?.id)">
                        <NuxtLink
                            v-if="item?.wallet?.buyer?.id"
                            :to="'https://solscan.io/account/' + item?.wallet?.buyer?.id"
                            target="_blank"
                        >
                            <img :src="solscanLogo" alt="Solscan" class="mr-2 mb-0.5 h-4 w-4 inline-block" />
                        </NuxtLink>
                        <FontAwesomeIcon
                            v-if="item?.wallet?.buyer?.id"
                            :icon="['fas', 'copy']"
                            class="mr-2 z-99 text-indigo-500 hover:text-indigo-400 cursor-pointer"
                            @click="copyClipboard(item?.wallet?.buyer?.id)"
                        />
                        <span>{{ formatAddress(item?.wallet?.buyer?.id) }} </span>
                    </template>
                    <span v-else-if="item?.wallet?.buyer?.id">You</span>
                </template>
                <span class="text-end" v-else>--</span>
            </template>
        </AppTable>
    </section>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';
    import { formatDateWithTime, formatNumberToDecimal, formatAddress } from '~/js/formatting';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { ActivityActionTitle, ActivityResponse } from '~/types/Activity.types';
    import { copyClipboard } from '~/js/clipboard';
    import solscanLogo from '@/assets/logo/solscan.png';
    import { isWalletAddress } from '~/composables/useAccount';

    const props = defineProps<{
        activities: DataWrapper<ActivityResponse[]>;
    }>();

    const data = computed(() => {
        return props.activities?.data?.map((item) => {
            item.price = item.price ?? item.offeredPrice;
            return item;
        });
    });

    const columns = [
        {
            field: 'createdAt',
            label: 'Date',
        },

        {
            field: 'type',
            label: 'Event',
        },

        {
            field: 'price',
            label: 'Price',
        },
        {
            field: 'wallet.id',
            label: 'Seller',
        },
        {
            field: 'wallet.buyer.id',
            label: 'Buyer',
        },
        {
            field: 'transactionId',
            label: 'Transaction ID',
        },
    ];
</script>

<style scoped></style>
