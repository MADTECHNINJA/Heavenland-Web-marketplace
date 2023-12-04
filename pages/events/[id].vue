<template>
    <AppContainer>
        <AppBackButton class="pt-4 lg:pt-0" title="Gaming" path="/events" />

        <AppTitle class="mb-3">Event</AppTitle>

        <AppAlert v-if="event.error" :type="AlertType.ERROR" :text="ErrorMsg.FETCHING_ERROR" />

        <div v-else class="flex flex-col md:grid grid-cols-5 gap-6 mt-3">
            <div class="col-span-3 space-y-3">
                <EventStatusOverview :e="event" />
                <EventGameOverview :event="event" />
                <!-- TODO <EventTimeline :event="e" /> -->
            </div>

            <div class="col-span-2 space-y-3">
                <EventBettingOverview :event="event" />
                <EventPlayerRoster :event="event" :player-paragons="playerParagons" />
                <EventResultsOverview :event="event" :player-paragons="playerParagons" />
            </div>
        </div>
    </AppContainer>
</template>

<script lang="ts" setup>
    import { onMounted, computed, watch, ref } from 'vue';
    import { useRoute } from '#app';
    import { GamingEvent } from '~/types/Event.types';
    import { Metaplex } from '~/js/metaplex';
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { Paragons } from '~/types/collections/Paragons.types';
    import { API } from '~/api';
    import { AlertType } from '~/types/Alert.utils';
    import { ErrorMsg } from '~/locales/core';

    const route = useRoute();

    const eventId = computed(() => {
        return Array.isArray(route.params['id']) ? route.params['id'][0] : route.params['id'];
    });

    const event = ref(new DataWrapper<GamingEvent | null>());
    const playerParagons = ref(new DataWrapper<Paragons[]>());

    const eventData = computed(() => {
        return event?.value?.data?.data;
    });

    watch(
        () => event.value?.data?.data.id,
        async () => {
            if (eventData.value?.players) {
                const paragons = eventData.value?.players.map((p) => p.paragonAddress);

                if (paragons) {
                    const res = await Metaplex.getInstance().retrieveRequestItems(paragons);

                    if (res) {
                        playerParagons.value.setData(res?.map((s) => new Paragons(s.onChain, s.offChain)));
                    }
                }
            }
        }
    );

    onMounted(async () => {
        try {
            const ev = await API.EventService.getGamingEvent(eventId.value);
            event.value.setData(ev);
        } catch (e: any) {
            event.value.setError(e);
        }
    });
</script>

<style scoped>
    input.appearance-none::-webkit-outer-spin-button,
    input.appearance-none::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
