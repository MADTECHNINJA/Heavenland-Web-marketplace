<template>
    <div class="w-full h-auto relative flex items-center overflow-hidden flex-col">
        <div
            id="header-container"
            class="max-w-7xl flex items-center justify-center h-screen px-4 sm:py-32 md:py-0 sm:px-6 lg:px-8"
        >
            <div class="text-5xl relative -mt-[10rem] text-center z-[12] w-fit text-white tracking-tight md:text-8xl">
                <span class="heavenmarket"> Heavenmarket </span>
                <div ref="header" class="flex">
                    <span
                        ref="headerWord"
                        class="mt-6 text-2xl bg-clip-text opacity-0 w-full text-transparent bg-gradient-to-r to-violet-500 from-pink-500 lg:text-[2.5rem] font-medium ml-auto text-right tracking-normal text-white"
                    >
                        Create
                    </span>
                    <span
                        class="mt-6 text-2xl lg:text-[2.5rem] font-medium w-full text-left tracking-normal ml-2 text-gray-300"
                    >
                        NFTs.
                    </span>
                </div>
            </div>
        </div>

        <div ref="scroll" class="block infobox z-20 -mt-[6.5rem]">
            <HomepageFindOutMoreButton />
            <HomepageFindOutMoreButton phone />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import gsap from 'gsap';
    import { TextPlugin } from 'gsap/TextPlugin';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';

    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(TextPlugin);

    const header = ref(null);
    const headerWord = ref(null);
    const scroll = ref(null);

    const props = defineProps<{
        trendingCollections: any;
    }>();

    onMounted(() => {
        const tl2 = gsap.timeline({ repeat: -1 });

        tl2.fromTo(
            headerWord.value,
            {
                delay: 1,
                y: -20,
                autoAlpha: 0,
                ease: 'slow(3, 3)',
            },
            { y: 0, autoAlpha: 1, delay: 0, ease: 'slow(3, 3)', duration: 1 }
        );

        tl2.to(headerWord.value, 1, { y: 20, autoAlpha: 0, ease: 'slow(3, 3, true)', delay: 0.3 });
        tl2.fromTo(
            headerWord.value,
            {
                y: -20,
                autoAlpha: 0,
                ease: 'slow(0.25, 0.9)',
            },
            { y: -20, autoAlpha: 0, ease: 'slow(3, 3)', text: 'Collect', duration: 0.1 }
        );
        tl2.to(headerWord.value, 1, { y: 0, autoAlpha: 1, ease: 'slow(3, 3, true)', duration: 1 });

        tl2.to(headerWord.value, 1, { y: 20, autoAlpha: 0, ease: 'slow(3, 3, true)', duration: 1, delay: 0.3 });
        tl2.fromTo(
            headerWord.value,
            {
                y: -20,
                autoAlpha: 0,
                ease: 'slow(0.25, 0.9)',
            },
            { y: -20, autoAlpha: 0, ease: 'slow(3, 3)', text: 'Trade', duration: 0.1 }
        );
        tl2.to(headerWord.value, 1, { y: 0, autoAlpha: 1, ease: 'slow(3, 3, true)', duration: 1 });

        tl2.to(headerWord.value, 1, { y: 20, autoAlpha: 0, ease: 'slow(3, 3, true)', duration: 1, delay: 0.3 });
        tl2.fromTo(
            headerWord.value,
            {
                y: -20,
                delay: 1,
                autoAlpha: 0,
                ease: 'slow(0.25, 0.9)',
            },
            { y: -20, autoAlpha: 0, ease: 'slow(3, 3)', text: 'Stake', duration: 0.1 }
        );
        tl2.to(headerWord.value, 1, { y: 0, autoAlpha: 1, ease: 'slow(3, 3, true)', duration: 1 });

        tl2.to(headerWord.value, 1, { y: 20, autoAlpha: 0, ease: 'slow(3, 3, true)', duration: 1, delay: 0.3 });

        setTimeout(() => {
            const tl5 = gsap.timeline({});
            tl5.fromTo(
                scroll.value,
                { x: 0, opacity: 1, autoAlpha: 1 },
                {
                    y: -100,
                    opacity: 0,
                    autoAlpha: 0,
                    scrollTrigger: {
                        trigger: props.trendingCollections.value,
                        start: 0,
                        end: 50,
                        scrub: 3,
                        id: 'scrub',
                    },
                }
            );
        }, 100);
    });
</script>

<style>
    @font-face {
        font-family: 'all-round-gothic';
        src: url('https://use.typekit.net/af/b66ee9/00000000000000007735c472/30/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3')
                format('woff2'),
            url('https://use.typekit.net/af/b66ee9/00000000000000007735c472/30/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3')
                format('woff'),
            url('https://use.typekit.net/af/b66ee9/00000000000000007735c472/30/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3')
                format('opentype');
        font-display: auto;
        font-style: normal;
        font-weight: 400;
        font-stretch: normal;
    }
    .heavenmarket {
        font-family: 'all-round-gothic', sans-serif;
    }
</style>
