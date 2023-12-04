<template>
    <AppContainer>
        <AppMainSectionLabel class="pt-4 md:pt-0" title="Events" />

        <AppTitle>Gaming</AppTitle>

        <AppDescriptionText class="mb-6">
            Events offer a unique way to bring people together from all over the world and create memorable experiences
            within the virtual world of Heavenland. They can be organized by Heavenland, community or individuals. Some
            events allow winning prizes by participating in tournaments or taking bets on those who participate.
            Possibilities are endless.
        </AppDescriptionText>

        <AppActionCard v-if="events.error()" :type="AlertType.ERROR">
            <template #desc> {{ ErrorMsg.FETCHING_ERROR }}</template>
        </AppActionCard>

        <AppActionCard v-else-if="!events.fetched()" :type="AlertType.LOADING">
            <template #title>Loading events...</template>
        </AppActionCard>

        <div v-else>
            <AppTabs v-model="activeTab" :items="tabItems" />

            <AppTable
                class="mt-3"
                rounded
                clickable
                v-if="tableEvents"
                :columns="columns"
                :fetched="events.fetched()"
                :data="tableEvents"
                unavailable="No event available at the moment"
            >
                <template #name="{ item }">
                    {{ item.data.title }}
                </template>

                <template #startsAt="{ item }">
                    <span>{{ formatDateWithTime(item.data.parameters.startsAt, true) }} </span>
                </template>

                <template #typeTag="{ item }">
                    <AppTooltip wrap :text="item.typeTag.tooltip">
                        <EventBadge :tag="item.typeTag" />
                    </AppTooltip>
                </template>

                <template #entryFee="{ item }">
                    <p class="mt-1 font-medium tracking-tight flex items-center">
                        <img
                            v-if="item.data.parameters.currency === 'HTO'"
                            :src="htoCurrency"
                            alt="HTO"
                            class="h-4 rounded-full mr-1"
                        />
                        {{ formatNumberToDecimal(item.data.parameters.entryFee) }}
                    </p>
                </template>

                <template #reward="{ item }">
                    <p class="mt-1 font-medium tracking-tight flex items-center">
                        <img
                            v-if="item.data.parameters.currency === 'HTO'"
                            :src="htoCurrency"
                            alt="HTO"
                            class="h-4 rounded-full mr-1"
                        />
                        {{ formatNumberToDecimal(item.data.parameters.rewardPool) }}
                    </p>
                </template>

                <template #players="{ item }">
                    <div class="flex items-center space-x-2 mt-0.5">
                        <FontAwesomeIcon icon="user-vneck" class="text-gray-300 h-3 w-3" />
                        <div class="flex flex-col rounded-md py-1 px-0.5 items-center w-[40px]">
                            <div class="flex items-center space-x-2 w-full">
                                <div class="w-full bg-indigo-900/50 grow h-1 rounded-full overflow-clip">
                                    <div
                                        class="transition-all bg-gradient-to-r from-indigo-700 to-[#b24cb6] h-1 rounded-full"
                                        :style="{
                                            width:
                                                (item.data.players.length * 100) / item.data.settings.numberOfPlayers +
                                                '%',
                                        }"
                                    />
                                </div>
                            </div>
                        </div>
                        <p class="font-medium text-xs tracking-normal flex items-center">
                            {{ item.data.players.length }} / {{ item.data.settings.numberOfPlayers }}
                        </p>
                    </div>
                </template>

                <template #stage="{ item }">
                    <EventStageIndicator :e="item" />
                </template>
            </AppTable>
        </div>
    </AppContainer>
</template>

<script lang="ts" setup>
    import htoCurrency from '@/assets/currency/hto.png';
    import { useEventStore } from '~/store/events';
    import { ComputedRef, onMounted, ref, computed } from 'vue';
    import { mapState } from 'pinia';
    import { AlertType } from '~/types/Alert.utils';
    import { GamingEvent } from '~/types/Event.types';
    import { formatDateWithTime, formatNumberToDecimal } from '~~/js/formatting';
    import { ErrorMsg } from '~/locales/core';

    const eventStore = useEventStore();

    const events = mapState(useEventStore, {
        fetched: (store) => store.events.gaming.fetched,
        error: (store) => store.events.gaming.error,
        data: (store) => store.events.gaming.data,
    });

    const tabItems = [
        { label: 'Active', value: 'active' },
        { label: 'Finished', value: 'finished' },
    ];
    const activeTab = ref(tabItems[0].value);

    const columns = [
        {
            field: 'startsAt',
            label: 'Date of event',
        },

        {
            field: 'name',
            label: 'Event name',
        },

        {
            field: 'typeTag',
            label: 'Event type',
        },
        {
            field: 'entryFee',
            label: 'Entry fee',
        },
        {
            field: 'reward',
            label: 'Reward pool',
        },
        {
            field: 'players',
            label: 'Players',
        },
        {
            field: 'stage',
            label: 'Stage',
        },
    ];

    const tableEvents: ComputedRef<GamingEvent[]> = computed(() => {
        if (activeTab.value === 'finished') {
            return events.data()?.filter((e) => e.isFinished) ?? [];
        }

        return events.data()?.filter((e) => !e.isFinished) ?? [];
    });

    onMounted(() => {
        if (!eventStore.events.gaming.fetched || eventStore.events.gaming.error) {
            eventStore.fetchEvents();
        }
        //TODO bettingStore.fetchBetting();
    });
</script>

<style scoped>
    input.appearance-none::-webkit-outer-spin-button,
    input.appearance-none::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
