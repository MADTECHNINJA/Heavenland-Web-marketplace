<template>
    <div
        v-if="event.data?.data?.results"
        class="flex flex-col bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg pt-4 pb-5 px-6"
    >
        <h1 class="font-bold text-md tracking-tight">Timeline</h1>

        <nav aria-label="Progress" class="mt-4">
            <ol role="list" class="overflow-hidden">
                <li class="relative">
                    <div class="absolute top-4 bottom-0 left-1 -ml-px mt-0.5 w-0.5 bg-gray-300/20" aria-hidden="true" />

                    <a class="group relative flex items-start">
                        <span
                            class="relative top-1.5 z-10 flex h-2 w-2 items-center justify-center rounded-full bg-gray-300"
                        />

                        <span class="ml-4 flex min-w-0 flex-col">
                            <span class="text-sm font-medium text-gray-300">General event</span>

                            <div class="w-full min-w-[350px] mb-6">
                                <span class="text-xs text-gray-400"
                                    >Something very general happened and we're just informing the user</span
                                >
                            </div>
                        </span>
                    </a>
                </li>

                <li class="relative">
                    <div class="absolute top-4 bottom-0 left-1 -ml-px mt-0.5 w-0.5 bg-gray-300/20" aria-hidden="true" />

                    <a class="group relative flex items-start">
                        <FontAwesomeIcon
                            :icon="['fas', 'gun']"
                            class="relative top-1 z-10 flex h-3 w-3 items-center justify-center rounded-full text-red-500"
                        />

                        <span class="ml-4 flex min-w-0 flex-col">
                            <span class="text-sm font-medium text-gray-300">Kill event</span>

                            <div
                                class="w-full min-w-[350px] mt-2 mb-6 bg-black/10 border border-gray-400 border-opacity-20 rounded-md px-3 py-1.5"
                            >
                                <p class="text-xs flex items-center">
                                    Player 1
                                    <FontAwesomeIcon
                                        :icon="['fas', 'chevron-right']"
                                        class="h-2.5 w-2.5 mx-2 text-red-500"
                                    />
                                    Player 2
                                </p>
                            </div>
                        </span>
                    </a>
                </li>

                <li class="relative">
                    <div class="absolute top-4 bottom-0 left-1 -ml-px mt-0.5 w-0.5 bg-gray-300/20" aria-hidden="true" />

                    <a class="group relative flex items-start">
                        <FontAwesomeIcon
                            :icon="['fas', 'car']"
                            class="relative top-1 z-10 flex h-3 w-3 items-center justify-center rounded-full text-sky-500"
                        />

                        <span class="ml-4 flex min-w-0 flex-col">
                            <span class="text-sm font-medium text-gray-300">Race event</span>

                            <div
                                class="w-full min-w-[350px] mt-2 mb-6 bg-black/10 border border-gray-400 border-opacity-20 rounded-md px-3 py-1.5"
                            >
                                <p class="text-xs flex items-center">
                                    Player 1
                                    <FontAwesomeIcon
                                        :icon="['fas', 'chevron-right']"
                                        class="h-2.5 w-2.5 mx-2 text-sky-500"
                                    />
                                    Player 2
                                </p>
                            </div>
                        </span>
                    </a>
                </li>

                <li>
                    <div class="absolute top-4 bottom-0 left-1 -ml-px mt-0.5 w-0.5 bg-gray-300/20" aria-hidden="true" />

                    <a class="group relative flex items-start">
                        <FontAwesomeIcon
                            :icon="['fas', 'flag-checkered']"
                            class="relative top-1 z-10 flex h-3 w-3 items-center justify-center rounded-full text-green-500"
                        />

                        <span class="ml-4 flex min-w-0 flex-col">
                            <span class="text-sm font-medium text-gray-300">Game finished</span>

                            <div class="w-full min-w-[350px] mb-6">
                                <span class="text-xs text-gray-400">
                                    Something very general happened and we're just informing the user
                                </span>
                            </div>
                        </span>
                    </a>
                </li>
            </ol>
        </nav>
    </div>
</template>

<script lang="ts" setup>
    import { DataWrapper } from '~/types/DataWrapper.types';
    import { GamingEvent } from '~/types/Event.types';

    defineProps<{
        event: DataWrapper<GamingEvent | null>;
    }>();
</script>

<style scoped></style>
