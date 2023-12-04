<template>
    <section class="relative text-white pt-10 bg-gradient-to-b from-[#030318] to-[#03031800]">
        <div class="relative max-w-7xl mx-auto px-4 pt-2 md:pt-6">
            <div class="max-w-2xl mx-auto lg:max-w-none lg:ml-0 md:w-full 2xl:pr-5">
                <h2 class="text-3xl font-semibold text-white text-center md:text-left md:mb-3 sm:text-3xl">
                    Staking NFTs
                </h2>
                <div class="lg:flex">
                    <div class="lg:w-1/2">
                        <p class="text-gray-300 text-center md:mr-4 lg:mr-0 md:text-left text-sm pt-6 mb-5">
                            Heavenland has created a unique staking solution that beautifully interconnects NFTs and
                            HTO, which opens a novel approach to the governance of virtual worlds. Just go to our
                            <NuxtLink class="hyperlink" to="/staking">staking page</NuxtLink>, stake and enjoy the
                            passive income.
                        </p>
                        <div class="mt-5">
                            <div class="mr-2 flex flex-col items-center lg:items-start">
                                <div>
                                    Max. APR
                                    <AppTooltip
                                        text="Max APR is for stakes over 180 days, shorter stakes have lower APR"
                                    >
                                        <FontAwesomeIcon class="h-5 w-5 ml-2" :icon="['fad', 'info-circle']" />
                                    </AppTooltip>
                                </div>
                            </div>
                            <div
                                class="font-semibold text-transparent bg-clip-text text-center lg:text-left mt-2 text-3xl bg-gradient-to-r from-pink-500 to-violet-500"
                            >
                                <span
                                    class="font-semibold text-transparent bg-clip-text text-center lg:text-left mt-2 text-3xl bg-gradient-to-r from-pink-500 to-violet-500"
                                >
                                    {{ getApr(2).toFixed(2) }} %
                                </span>
                            </div>
                        </div>

                        <div class="flex flex-col lg:flex-row">
                            <div class="lg:mr-0 mb-5 lg:mb-0 mx-auto lg:mx-0">
                                <h3 class="text-center lg:text-left mt-5 mb-2 lg:mb-3 md:mt-7">
                                    Which NFTs can you stake?
                                </h3>
                                <div class="flex justify-center md:justify-start mt-2 md:mt-0 lg:mt-2">
                                    <div class="transition-all relative w-fit mt-4 md:mt-0 lg:mt-1">
                                        <img
                                            class="h-24 object-cover ml-2 rounded-lg aspect-square w-36"
                                            :src="parcels"
                                        />
                                        <div
                                            class="px-4 py-1 card-description z-10 w-full bottom-0 rounded-b-lg absolute"
                                        >
                                            <h2
                                                class="text-sm my-1 tracking-tight font-semibold text-white text-center"
                                            >
                                                Parcels
                                            </h2>
                                        </div>
                                    </div>

                                    <div class="transition-all relative w-fit mt-4 md:mt-0 lg:mt-1">
                                        <img
                                            class="h-24 object-cover ml-2 rounded-lg aspect-square w-36"
                                            :src="solamids"
                                        />
                                        <div
                                            class="px-4 py-1 card-description z-10 w-full bottom-0 rounded-b-lg absolute"
                                        >
                                            <h2
                                                class="text-sm my-1 tracking-tight font-semibold text-white text-center"
                                            >
                                                Solamids
                                            </h2>
                                        </div>
                                    </div>
                                    <div class="transition-all relative w-fit mt-4 md:mt-0 lg:mt-1">
                                        <img
                                            class="h-24 object-cover ml-2 rounded-lg aspect-square w-36"
                                            :src="solanauts"
                                        />
                                        <div
                                            class="px-4 py-1 card-description z-10 w-full bottom-0 rounded-b-lg absolute"
                                        >
                                            <h2
                                                class="text-sm my-1 tracking-tight font-semibold text-white text-center"
                                            >
                                                Solonauts
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="rounded-xl mb-10 md:mb-0 relative lg:w-1/2 md:mx-auto lg:ml-4 xl:ml-10 2xl:ml-32 overflow-hidden h-fit bg-gradient-to-r px-7 lg:flex py-5 z-10 shadow-lg from-indigo-930 to-[#040423]"
                    >
                        <img
                            :src="htoCoin"
                            class="lg:object-contain bottom-0 object-cover lg:block absolute h-full lg:h-auto rounded-lg lg:-bottom-2 right-0 opacity-[0.15]"
                        />
                        <div>
                            <h3 class="font-semibold text-center lg:text-left text-lg mb-5">
                                How much can you earn by staking?
                            </h3>
                            <FormKit name="staking" type="group">
                                <template #default="{ state: { valid } }">
                                    <AppLabel class="text-center md:text-left" title="Amount" />
                                    <div class="relative rounded-md shadow-sm mt-2 md:w-[320px]">
                                        <FormKit
                                            :type="number"
                                            digits="2"
                                            validation="max: 1000000000"
                                            :validation-messages="{
                                                max: 'Maximum value is 1,000,000,000.',
                                            }"
                                            validation-visibility="dirty"
                                            max="1000000"
                                            name="Amount"
                                            v-model="stakeAmount"
                                        />
                                        <div
                                            class="absolute top-[0.55rem] md:top-[0.4rem] right-0 pr-3 inline-block items-center pointer-events-none"
                                        >
                                            <img
                                                alt="htoCurrency"
                                                :src="htoCurrency"
                                                class="h-5 -mt-[0.15rem] md:-mt-[0.1rem] mr-1 inline-block"
                                            />
                                            <span class="text-white sm:text-sm"> HTO</span>
                                        </div>
                                    </div>

                                    <AppLabel class="mt-6 text-center md:text-left" title="Duration (days)" />
                                    <AppHorizontalSelect v-model="stakeDuration" :items="[30, 60, 90, 120, 150, 180]" />

                                    <div class="flex justify-between">
                                        <div
                                            v-if="globalInfo.globalFetched() && !isNaN(wHto)"
                                            class="mb-5 flex flex-col justify-center mr-5 sm:relative"
                                        >
                                            <AppLabel class="mt-6 text-left" title="APR" />
                                            <span
                                                class="text-base text-transparent font-semibold bg-clip-text lg:text-right bg-gradient-to-r from-pink-500 to-violet-500 font-semibold text-left"
                                            >
                                                {{ getApr(wHto).toFixed(2) }} %
                                            </span>
                                        </div>
                                        <div
                                            v-else
                                            class="text-sm flex mt-2 text-gray-300 justify-center md:justify-start items-center mb-5"
                                        >
                                            <AppSpinner class="mr-2" /> loading ..
                                        </div>
                                        <div v-if="output > 0 && valid" class="mb-5 ml-10">
                                            <div class="flex mt-6 items-center mr-1.5">
                                                <AppLabel
                                                    class="whitespace-nowrap text-center md:text-right"
                                                    title="HTO Income"
                                                />
                                                <AppTooltip
                                                    class="z-[10]"
                                                    text="Income at the end of the selected stake period. Note that the real income can change as it is influenced by other stakers."
                                                >
                                                    <FontAwesomeIcon
                                                        class="h-4 w-4 mb-1.5 ml-2"
                                                        :icon="['fad', 'info-circle']"
                                                    />
                                                </AppTooltip>
                                            </div>
                                            <div class="flex items-center w-full justify-end font-semibold">
                                                <span
                                                    class="text-transparent text-base font-semibold bg-clip-text lg:text-right bg-gradient-to-r from-pink-500 to-violet-500 md:text-left text-sm"
                                                >
                                                    {{ stakeAmount }} + {{ output ? formatNumber(output) : output }}
                                                    <img
                                                        alt="htoCurrency"
                                                        :src="htoCurrency"
                                                        class="h-5 -mt-[0.15rem] md:-mt-[0.1rem] mr-1 inline-block"
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </FormKit>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import htoCurrency from '@/assets/currency/hto.png';
    import parcels from '@/assets/collections/heavenland-parcels.png';
    import solamids from '@/assets/collections/solamids.png';
    import solanauts from '@/assets/collections/solanauts.png';
    import NumberCleaveWrapper from '~/components/app/NumberCleaveWrapper.vue';
    import { createInput } from '@formkit/vue';
    import { formatNumber } from '~/js/formatting';
    import { ref, computed } from 'vue';
    import { mapState } from 'pinia';
    import htoCoin from '@/assets/hto-coin.png';
    import { useGlobalInfo } from '~/store/staking/global';

    const globalInfo = computed(() => {
        return mapState(useGlobalInfo, {
            globalFetched: (store) => store.global.fetched,
            globalData: (store) => store.global.data,
        });
    });

    const wHto = computed(() => {
        switch (stakeDuration.value) {
            case 30:
                return 1;
            case 60:
                return 1.2;
            case 90:
                return 1.4;
            case 120:
                return 1.6;
            case 150:
                return 1.8;
            case 180:
                return 2;
            default:
                return 1;
        }
    });

    const output = computed((): number => {
        return Number((((getApr(wHto.value) * stakeAmount.value) / 365 / 100) * stakeDuration.value).toFixed(2));
    });

    const getApr = (wHto) => {
        return (
            globalInfo.value
                .globalData()
                ?.htoReleaseRate.muln(wHto)
                .muln(1000000)
                .div(globalInfo.value.globalData()?.totalRewardSum)
                .muln(100)
                .muln(365)
                .muln(24)
                .toNumber() / 1000000 ?? 0
        );
    };

    const number = createInput(NumberCleaveWrapper, {
        props: ['digits', 'max'],
    });

    const stakeAmount = ref(100);
    const stakeDuration = ref(180);
</script>

<style>
    .card-description {
        background: rgba(2, 2, 20, 0.75);
        box-shadow: 0 4px 0px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(5px);
    }
</style>
