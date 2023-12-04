<template>
    <AppContainer>
        <div class="relative overflow-hidden">
            <img
                class="absolute w-full h-50 opacity-100 z-5 top-60 sm:top-64 md:top-72 lg:top-20 xl:top-0 rounded-2xl"
                :src="background"
                alt="Heavenmarket background"
            />
            <HomepageIntro :trendingCollections="trendingCollections" />
            <HomepageTrendingsCollections @trendingCollections="updateTrendingCollectionsReference" />
            <HomepageHto />
            <section
                class="bg-gradient-to-b h-fit md:h-40 pb-40 md:pb-0 w-screen from-[#120D30] to-[#030318]"
            ></section>
            <HomepageStaking />
            <HomepageDao />
        </div>
    </AppContainer>
</template>

<script lang="ts" setup>
    import { onMounted, ref } from 'vue';
    import background from '@/assets/homepage/background.png';

    const trendingCollections = ref(null);

    const updateTrendingCollectionsReference = (value) => {
        if (value) trendingCollections.value = value;
    };

    onMounted(async () => {
        window.scrollTo(0, 0);
    });
</script>

<style scoped></style>
