<template>
    <div class="col-span-1">
        <button
            @click="link && $router.push(link)"
            type="button"
            class="relative hover:brightness-125 overflow-hidden block w-full bg-indigo-930 rounded-lg text-start focus:outline-none"
        >
            <div
                class="bg-gradient-to-r from-indigo-930 to-indigo-940 py-2 px-4 rounded-t-lg flex items-center space-x-2"
            >
                <FontAwesomeIcon :icon="icon" class="h-2.5 w-2.5 text-white" />
                <p class="text-sm font-semibold tracking-tight text-gray-200">
                    {{ title }}
                </p>
            </div>

            <span class="z-10 px-4 pt-4 pb-5 relative block leading-4 text-xs font-medium text-gray-400 pr-12">
                {{ description }}
            </span>

            <img :src="image" class="absolute h-[55px] opacity-30 top-[2.8rem] right-2 bottom-0 object-cover" />
            <div v-if="amountOfOperations" class="flex flex-col pb-2 px-4 justify-start items-start">
                <p class="bg-clip-text pr-4 text-sm pt-2 font-medium text-gray-300 text-center">operations</p>
                <p
                    class="text-3xl pr-1 bg-clip-text font-semibold text-transparent bg-gradient-to-r from-pink-500 to-violet-500 text-gray-300"
                >
                    {{ amountOfOperations }}
                </p>
            </div>
        </button>
    </div>
</template>

<script lang="ts" setup>
    defineProps<{
        title: string;
        description: string;
        image: any;
        icon: string;
        link?: string;
        amountOfOperations?: number;
    }>();
</script>

<style></style>
