<template>
    <div class="relative overflow-hidden px-9 my-6 py-6 bg-indigo-930 shadow rounded-lg bg-indigo-930">
        <div class="flex flex-col relative z-10">
            <p class="text-sm text-gray-200 max-w-3xl">
                Merging in Heavenland is a mechanism allowing everyone to create a block of parcels to support more
                significant buildings, as merging not only binds the adjacent parcels together but also provides bonuses
                to their height and depth and extends their staking possibilities.
            </p>

            <p class="text-sm mt-3 text-gray-200 max-w-3xl">
                Merged parcels are described by a new class of NFT - <b>Parcel Bucket</b>. If you merge 2 adjacent
                Parcels, you create 2-Bucket, which you can merge with its adjacent Parcel to create 3-Bucket, and so
                on. Merging comes with a fee which depends on the attributes of NFTs that are being merged.
            </p>

            <p class="text-sm mt-3 text-gray-200 max-w-3xl">
                Details are described on the
                <a class="hyperlink" target="_blank" href="https://heavenland.io/parcel-buckets">Parcel Buckets</a>
                page.
            </p>

            <div class="mt-6">
                <AppButton @click="goToMergeApp">Visit Merge app</AppButton>
            </div>
        </div>
        <img
            :src="mergingSplash"
            class="absolute bottom-0 h-4/5 scale-[100%] md:scale-100 w-[600px] md:w-auto md:block lg:top-0 md:bottom-0 object-cover right-0 md:h-[300px] lg:h-full opacity-5 lg:opacity-[15%] xl:opacity-[35%]"
        />
    </div>
</template>

<script lang="ts" setup>
    import mergingSplash from '@/assets/parcel-merging.png';

    const goToMergeApp = () => {
        window.open('https://heavenland.io/marketplace/merging');
    };
</script>

<style scoped></style>
