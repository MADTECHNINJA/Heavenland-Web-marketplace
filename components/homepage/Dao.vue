<template>
    <section class="relative md:pt-32">
        <div class="relative max-w-7xl mx-auto px-4 pt-6 md:pt-6">
            <div
                class="flex flex-col max-w-2xl mx-auto md:items-end text-left md:text-right md:mx-auto lg:max-w-none lg:pb-10 2xl:pb-0 lg:ml-0 md:full 2xl:pr-5"
            >
                <h2 class="text-3xl font-semibold text-white text-center md:text-left md:mb-3 sm:text-3xl">DAO</h2>

                <div class="flex flex-col relative mt-6 md:justify-between mr-0">
                    <div class="flex items-end justify-between">
                        <div class="relative md:mt-20 md:w-1/3">
                            <div class="relative flex flex-col md:flex-row w-full">
                                <div class="block md:hidden">
                                    <div class="text-lg w-full ml-auto text-gray-300">
                                        <p class="text-sm text-center md:text-right">
                                            In Heavenland, active stakers reap their harvest only if the virtual world
                                            flourishes, so who else should govern Heavenland better than the DAO of
                                            active stakers?
                                        </p>
                                    </div>
                                </div>
                                <img
                                    :src="daoCell"
                                    alt="cell"
                                    class="bottom-11 z-[9] md:absolute h-60 md:h-40 w-72 xl:h-52 md:w-auto"
                                />

                                <dl
                                    class="rounded-lg relative z-10 w-full bg-gradient-to-r from-indigo-600 to-indigo-940 shadow-lg flex"
                                >
                                    <div
                                        :style="`width: ${56}%`"
                                        class="flex bg-gradient-to-r from-indigo-800 to-indigo-900 rounded-l-lg items-center p-1.5 relative text-center"
                                    >
                                        <FontAwesomeIcon
                                            :icon="['far', 'circle-check']"
                                            class="text-green-500 ml-2 mr-2.5"
                                        />
                                        <dd class="order-1 font-medium text-center">56%</dd>
                                    </div>
                                    <div
                                        :style="`width: ${34}%`"
                                        class="flex bg-gradient-to-r from-[#23215e] to-indigo-920 flex-col p-1.5 text-right"
                                    >
                                        <dd class="order-1 font-medium text-center">27%</dd>
                                    </div>
                                    <div
                                        :style="`width: ${25}%`"
                                        class="fle bg-gradient-to-r from-indigo-930 to-indigo-930 rounded-r-lg flex-col p-1.5 text-center"
                                    >
                                        <dd class="order-1 font-medium">17%</dd>
                                    </div>
                                </dl>
                                <p
                                    :class="!activesVotes?.data() && 'pb-4 md:pb-0'"
                                    class="mt-4 md:hidden bg-clip-text text-lg text-transparent bg-gradient-to-r from-pink-500 to-violet-500 font-medium text-center md:text-right"
                                >
                                    Remember, the more you have staked, the bigger is your vote!
                                </p>
                            </div>
                        </div>

                        <div class="md:w-1/2 hidden md:block">
                            <div class="text-lg w-full ml-auto text-gray-300">
                                <p class="text-sm text-center md:text-right">
                                    In Heavenland, active stakers reap their harvest only if the virtual world
                                    flourishes, so who else should govern Heavenland better than the DAO of active
                                    stakers?
                                </p>

                                <p
                                    class="bg-clip-text pb-2 text-lg text-transparent bg-gradient-to-r from-pink-500 fotn-medium to-violet-500 mt-6 text-center md:text-right"
                                >
                                    Remember, the more you have staked, the bigger is your vote!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="activeVotes.data() && activeVotes.data().length"
                class="text-center relative max-w-7xl mx-auto pt-4 lg:text-left"
            >
                <DaoContainer v-if="filteredLatestVotes" class="mt-5 mb-5" on-going :data="filteredLatestVotes" />
            </div>
        </div>
    </section>
</template>

<script setup>
    import daoCell from '@/assets/homepage/dao.png';
    import { onMounted, computed } from 'vue';
    import { useDaoStore } from '@/store/dao';
    import { mapState } from 'pinia';
    import { QueryProvider } from '~/types/QueryProvider.types';

    const daoStore = useDaoStore();
    const onGoingQueryProvider = new QueryProvider([['filter[status]', 'ongoing']]);

    onMounted(() => {
        daoStore.fetchVotes(onGoingQueryProvider);
    });

    const activeVotes = mapState(useDaoStore, {
        fetched: (store) => store.activeVotes.fetched,
        error: (store) => store.activeVotes.error,
        data: (store) => store.activeVotes.data?.items,
    });

    const filteredLatestVotes = computed(() => {
        const sorted = activeVotes.data().sort((a, b) => b.startsAt - a.startsAt);
        if (sorted.length > 3) {
            return [sorted[0], sorted[1], sorted[2]];
        }
        return sorted;
    });
</script>

<style></style>
