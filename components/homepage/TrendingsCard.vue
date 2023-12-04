<template>
    <div
        class="mb-5 md:mb-0 md:hover:scale-[1.05] duration-1000 max-w-sm rounded-2xl relative w-full shadow-md cursor-pointer hover:brightness-125 transition-all"
    >
        <div
            class="w-[16rem] h-[22rem] md:w-[14rem] md:h-[22rem] 2xl:w-[14rem] 2xl:h-[22rem] relative rounded-2xl overflow-hidden shadow-lg"
        >
            <img
                class="mx-auto w-[16rem] h-[22rem] object-cover md:w-[14rem] md:h-[22rem] 2xl:w-[14rem] 2xl:h-[22rem] rounded-2xl"
                :src="img"
                alt="Collection image"
            />
            <div class="px-4 py-2 card-description z-10 w-full bottom-0 rounded-b-2xl absolute">
                <h2 class="text-sm my-1 leading-6 tracking-tight font-semibold text-white text-center">{{ name }}</h2>
                <p class="text-gray-300 md:h-10 text-center text-sm">{{ description }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    defineProps<{
        description: string;
        name: string;
        img: any;
    }>();
</script>

<style scoped>
    .card-description {
        background: rgba(2, 2, 20, 0.75);
        box-shadow: 0 4px 0px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(5px);
    }
</style>
