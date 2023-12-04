<template>
    <div class="overflow-hidden relative h-full md:pb-20 3xl:mb-20 mt-20 flex flex-col w-full items-center mx-auto">
        <h2
            ref="trendingCollectionsHeader"
            id="collections"
            class="mt-10 mb-6 text-3xl text-center left-0 font-semibold text-white sm:text-3xl"
        >
            Explore our collections
        </h2>
        <p class="md:mt-3 px-4 text-gray-300 text-sm flex text-center lg:text-left items-center flex-col">
            Discover and collect extraordinary NFTs to let them bring you joy and utilities throughout your journey in
            Heavenland.
        </p>
        <div class="opacity-0" ref="trendingCollections">
            <HomepageTrendingsCollectionsContainer :collections="collections" />
            <p class="px-4 flex items-center text-gray-300 text-sm flex-col">
                <AppSecondaryButton @click="$router.push('/collections')">Explore all</AppSecondaryButton>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import gsap from 'gsap';
    import { ref, Ref, onMounted } from 'vue';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import parcelHomepageImg from '@/assets/collections/heavenland-parcels.jpg';
    import loyaltyHomepageImg from '@/assets/collections/heavenland-loyalties.jpg';
    import alphasHomepageImg from '@/assets/collections/heavenland-alphas.jpg';

    gsap.registerPlugin(ScrollTrigger);

    const emit = defineEmits<{
        (event: 'trendingCollections', payload: any): void;
    }>();

    const trendingCollections = ref(null);
    const trendingCollectionsHeader = ref(null);

    const collections = [
        {
            data: {
                img: parcelHomepageImg,
                name: 'Parcels',
                route: 'parcels',
                id: 'heavenland-parcels',
                description: 'Find and develop your place.',
            },
        },
        {
            data: {
                img: alphasHomepageImg,
                name: 'Alphas',
                route: 'alphas',
                id: 'heavenland-alphas',
                description: 'Shine in front of others with unique PFPs.',
            },
        },
        {
            data: {
                img: loyaltyHomepageImg,
                name: 'Loyalties',
                route: 'loyalties',
                id: 'heavenland-loyalties',
                description: 'Get advantages from HTO payments.',
            },
        },
    ];

    onMounted(() => {
        emit('trendingCollections', trendingCollections);
        setTimeout(() => {
            const tl = gsap.timeline({});
            tl.fromTo(
                trendingCollections.value,
                {
                    y: 2000,
                    opacity: 0,
                    autoAlpha: 0,
                },
                {
                    y: 0,
                    opacity: 1,
                    autoAlpha: 1,

                    scrollTrigger: {
                        trigger: trendingCollectionsHeader.value,
                        onLeaveBack: (self) => self.disable(),
                        start: -1500,
                        end: 'top top',
                        scrub: 2,
                        id: 'scrub',
                    },
                }
            );
        }, 100);

        ScrollTrigger.refresh();
    });
</script>

<style></style>
