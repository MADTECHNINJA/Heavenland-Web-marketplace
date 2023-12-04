<template>
    <section class="relative text-white mt-10 md:mb-0">
        <div
            class="h-56 bg-transparent overflow-hidden lg:rounded-none :h-96 absolute -left-10 bottom-32 lg:bottom-16 xl:bottom-16 2xl:bottom-[6rem] hto-avatar 3xl:left-40 lg:h-full lg:lg:ml-10 2xl:pt-5 mr-auto lg:w-1/2 2xl:w-1/3"
        >
            <img
                class="w-full h-full lg:h-1/2 xl:h-[45%] object-contain lg:absolute lg:rounded-none"
                :src="htoAvatar"
                alt="Support team"
            />
        </div>
        <img class="absolute w-screen bottom-0 gradient" :src="wave" />
        <div class="relative max-w-7xl mx-auto px-4 pt-6 md:pt-6">
            <div class="max-w-2xl mx-auto lg:max-w-none lg:ml-0 md:w-full lg:pr-0"></div>
            <div
                class="flex 3xl:mb-0 max-w-2xl mx-auto flex-col md:items-end text-left md:text-right md:mx-auto lg:max-w-none pb-20 2xl:pb-0 lg:ml-0 md:full 2xl:pr-5"
            >
                <h2 class="text-3xl font-semibold text-white text-center md:text-left md:mb-3 sm:text-3xl">
                    What is HTO?
                </h2>

                <div class="mt-6 mb-44 md:mb-0 2xl:mb-0 text-lg md:w-1/2 text-gray-300">
                    <p class="text-sm text-center md:text-right">
                        HTO token is the main currency of Heavenland. It can be used to buy, create or update assets,
                        earn passive income through staking, vote in DAO, and most importantly, become part of the
                        shared, open economy. More info in
                        <a class="hyperlink" href="https://heavenland.io/tokenomics.pdf" target="_blank">Tokenomics</a>.
                    </p>
                    <br />

                    <p
                        v-if="htoRate?.rate"
                        ref="htoSmReference"
                        class="order-1 sm:bottom-auto md:hidden text-lg w-full text-center sm:relative font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
                    >
                        1 HTO
                        <FontAwesomeIcon :icon="['fad', 'arrows-repeat']" class="mx-2 text-[#CE4FB6]" />
                        {{ htoRate?.rate.toFixed(4) }} USD
                    </p>
                    <span v-else class="text-sm flex text-gray-300 md:hidden items-center">
                        <AppSpinner class="mr-2" /> loading rate..</span
                    >
                </div>

                <!--  <AppLineChart
                    class="mt-10"
                    :height="200"
                    :width="1000"
                    :labels="state.dateLabels"
                    :data="[20, 30, 50]"
                /> -->

                <div class="mt-6 lg:mt-0 xl:mt-0 md:block hidden overflow-hidden">
                    <dl class="-mx-8 -mt-2 flex flex-wrap">
                        <div class="flex flex-col px-8 pt-2">
                            <dd
                                v-if="htoRate?.rate"
                                ref="htoMdReference"
                                class="order-1 text-xl md:mb-10 lg:pb-2 xl:mb-0 font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
                            >
                                1 HTO
                                <FontAwesomeIcon :icon="['fad', 'arrows-repeat']" class="mx-2 text-[#CE4FB6]" />
                                {{ htoRate?.rate.toFixed(4) }} USD
                            </dd>

                            <span v-else class="text-sm hidden text-gray-300 md:flex items-center">
                                <AppSpinner class="mr-2" /> loading rate..</span
                            >
                        </div>
                    </dl>
                </div>
            </div>
            <div class="z-20 2xl:pb-20 3xl:pb-48 relative">
                <div
                    class="w-full lg:w-2/3 2xl:w-full relative flex justify-center md:flex lg:justify-end ml-auto xl:mr-2 2xl:mr-0 2xl:mx-auto pb-8 2xl:mb-20 px-4 2xl:-mt-[2.15rem] sm:pb-5 sm:px-6 lg:px-0 2xl:px-5"
                >
                    <div
                        class="absolute grid grid-cols-2 gap-4 md:w-full md:flex top-14 md:top-12 md:left-0 lg:left-auto lg:translate-x-0 justify-between lg:w-auto 2xl:relative lg:flex 2xl:pb-20"
                    >
                        <a
                            class="flex items-center justify-end w-fit mr-4"
                            target="_blank"
                            href="https://jup.ag/swap/SOL-HTO"
                        >
                            <h2
                                class="max-w-md items-center flex lg:text-lg font-medium text-white text-center lg:max-w-xl lg:text-left"
                            >
                                <img class="h-6 w-6 mr-2" :src="jupiter" />
                                Jupiter
                            </h2>
                        </a>
                        <a
                            class="flex items-center justify-end w-fit mr-4"
                            target="_blank"
                            href="https://raydium.io/swap/?inputCurrency=sol&outputCurrency=htoHLBJV1err8xP5oxyQdV2PLQhtVjxLXpKB7FsgJQD&outputAmount=0&fixed=in"
                        >
                            <h2
                                class="max-w-md items-center flex lg:text-lg font-medium text-white text-center lg:max-w-xl lg:text-left"
                            >
                                <img class="mr-1 md:mr-2 w-7" :src="raydium" />
                                Raydium
                            </h2>
                        </a>
                        <a
                            class="flex items-center justify-end w-fit mr-4"
                            target="_blank"
                            href="https://cropper.finance/swap/?from=11111111111111111111111111111111&to=htoHLBJV1err8xP5oxyQdV2PLQhtVjxLXpKB7FsgJQD"
                        >
                            <h2
                                class="flex items-center max-w-md lg:text-lg font-medium text-white text-center lg:max-w-xl lg:text-left"
                            >
                                <img class="h-6 w-6 mr-2" :src="cropper" />
                                Cropper
                            </h2>
                        </a>
                        <a target="_blank" class="flex items-center justify-end w-fit mr-4" href="https://phantom.app/">
                            <h2
                                class="flex items-center max-w-md lg:text-lg font-medium text-white text-center lg:max-w-xl lg:text-left"
                            >
                                <img class="h-6 w-6 mr-2" :src="phantom" />
                                Phantom
                            </h2>
                        </a>
                        <a
                            target="_blank"
                            class="flex items-center justify-end w-fit mr-4"
                            href="https://solflare.com/"
                        >
                            <h2
                                class="flex items-center max-w-md lg:text-lg font-medium text-white text-center lg:max-w-xl lg:text-left"
                            >
                                <img class="h-6 w-6 mr-2" :src="solflare" />
                                Solflare
                            </h2>
                        </a>
                        <a
                            target="_blank"
                            class="flex items-center justify-end w-fit"
                            href="https://www.bitmart.com/trade/en?symbol=HTO_USDC&layout=basic"
                        >
                            <h2
                                class="flex items-center pr-5 xl:pr-0 lg:text-lg font-medium text-white text-center lg:max-w-xl lg:text-left"
                            >
                                <img class="h-6 w-6 mr-2" :src="bitmart" />
                                BitMart
                            </h2>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref, reactive, onMounted, computed } from 'vue';
    import wave from '@/assets/homepage/waveOrig.svg';
    import gsap from 'gsap';
    import htoAvatar from '@/assets/homepage/htoSection.png';
    import jupiter from '@/assets/homepage/jupiter.svg';
    import htoLogo from '@/assets/currency/hto.png';
    import raydium from '@/assets/homepage/raydium.svg';
    import cropper from '@/assets/homepage/cropper.svg';
    import bitmart from '@/assets/homepage/bitmart.svg';
    import phantom from '@/assets/homepage/phantom.svg';
    import solflare from '@/assets/homepage/solflare.svg';
    import { newDate } from '@/js/formatting';
    import { useStatsStore } from '@/store/stats';

    const statsStore = useStatsStore();

    const htoRate = computed(() => {
        return statsStore.htoUsdRate;
    });

    /*  const state = reactive({
        dateLabels: [],
    }); */

    onMounted(() => {
        /*   const labels = [1597034936, 1628570936, 1660106936];
        labels.forEach((label) => {
            state.dateLabels.push(newDate(label, true));
        }); */
    });
</script>

<style>
    .hto-avatar {
        bottom: 1.1rem;
    }

    @media only screen and (min-width: 514px) {
        .hto-avatar {
            bottom: 2rem;
        }
    }

    @media only screen and (min-width: 768px) {
        .hto-avatar {
            bottom: 3rem;
        }
    }

    @media only screen and (min-width: 1024px) {
        .hto-avatar {
            bottom: -8rem;
        }
    }

    @media only screen and (min-width: 1152px) {
        .hto-avatar {
            bottom: -7rem;
        }
    }

    @media only screen and (min-width: 1280px) {
        .hto-avatar {
            bottom: -7rem;
        }
    }
    @media only screen and (min-width: 1360px) {
        .hto-avatar {
            bottom: -6.5rem;
        }
    }

    @media only screen and (min-width: 1536px) {
        .hto-avatar {
            bottom: -8rem;
        }
    }

    @media only screen and (min-width: 1650px) {
        .hto-avatar {
            bottom: -7.5rem;
        }
    }

    @media only screen and (min-width: 1920px) {
        .hto-avatar {
            bottom: -6rem;
        }
    }

    @media only screen and (min-width: 2100px) {
        .hto-avatar {
            bottom: -4.5rem;
        }
    }

    @media only screen and (min-width: 2200px) {
        .hto-avatar {
            bottom: -3.5rem;
        }
    }

    @media only screen and (min-width: 2500px) {
        .hto-avatar {
            bottom: -6rem;
        }
    }

    @media only screen and (min-width: 3024px) {
        .hto-avatar {
            bottom: -2.5rem;
        }
    }

    @media only screen and (min-width: 3200px) {
        .hto-avatar {
            bottom: -1rem;
        }
    }

    @media only screen and (min-width: 3500px) {
        .hto-avatar {
            bottom: 1rem;
        }
    }

    @media only screen and (min-width: 3700px) {
        .hto-avatar {
            bottom: 2rem;
        }
    }

    @media only screen and (min-width: 3800px) {
        .hto-avatar {
            bottom: 2.5rem;
        }
    }
    .gradient {
        filter: hue-rotate(8deg);
    }
</style>
