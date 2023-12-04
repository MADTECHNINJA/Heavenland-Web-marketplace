<template>
    <nav class="flex flex-col mt-4 md:mt-0 mx-2 md:mx-0 space-y-2" aria-label="Sidebar">
        <template v-if="currentRoute.path.includes('/account') && mobile">
            <h1 class="ml-5 mb-2 text-sm">My account</h1>
            <NuxtLink
                v-for="tab in userNavigation"
                :key="tab.path"
                :to="tab.path"
                @click="$emit('update:open', false)"
                v-slot="{ route }"
            >
                <div
                    class="app-sidebar__item hover:text-gray-400 hover:border-gray-"
                    :class="{ active: computeRoute(route), 'justify-center': isCollapsed && !mobile }"
                >
                    <div class="min-w-[25px] flex justify-center">
                        <FontAwesomeIcon :icon="['fad', tab.icon]" />
                    </div>
                    <span v-if="!isCollapsed || mobile" class="mx-2 text-sm font-normal tracking-tight">
                        {{ tab.name }}
                    </span>
                    <span v-if="!isCollapsed" class="flex-grow text-right"> </span>
                </div>
            </NuxtLink>
        </template>
        <template v-if="currentRoute.path.includes('/account') && mobile">
            <h1 class="ml-5 mb-2 mt-3 text-sm">Market menu</h1>
            <NuxtLink
                v-for="tab in appNavigation"
                :key="tab.path"
                :to="tab.path"
                @click="$emit('update:open', false)"
                v-slot="{ route }"
            >
                <div
                    class="app-sidebar__item hover:text-gray-400 hover:border-gray-"
                    :class="{ active: computeRoute(route), 'justify-center': isCollapsed && !mobile }"
                >
                    <div class="min-w-[25px] flex justify-center">
                        <FontAwesomeIcon :icon="['fad', tab.icon]" />
                    </div>
                    <span v-if="!isCollapsed || mobile" class="mx-2 text-sm font-normal tracking-tight">
                        {{ tab.name }}
                    </span>
                    <span v-if="!isCollapsed" class="flex-grow text-right"> </span>
                </div>
            </NuxtLink>
        </template>
        <template v-else>
            <NuxtLink
                v-for="tab in navigationItems"
                :key="tab.path"
                :to="tab.path"
                @click="$emit('update:open', false)"
                v-slot="{ route }"
            >
                <div
                    class="app-sidebar__item"
                    :class="{ active: computeRoute(route), 'justify-center': isCollapsed && !mobile }"
                >
                    <div class="min-w-[25px] flex justify-center">
                        <FontAwesomeIcon :icon="['fad', tab.icon]" />
                    </div>
                    <span v-if="!isCollapsed || mobile" class="mx-2 text-sm font-normal tracking-tight">
                        {{ tab.name }}
                    </span>
                    <span v-if="!isCollapsed" class="flex-grow text-right"> </span>
                </div>
            </NuxtLink>
        </template>
    </nav>
</template>

<script lang="ts" setup>
    import { useRoute } from '#app';
    import { computed } from 'vue';
    import { userNavigation, appNavigation } from '@/js/navigation';
    import { useSidebarLayout } from '~/composables/useLayout';

    const currentRoute = useRoute();
    const { isCollapsed } = useSidebarLayout();

    defineProps<{
        mobile?: boolean;
    }>();

    const computeRoute = (route) => {
        if (currentRoute.path.includes('/collections') && route.path == '/collections') {
            return true;
        } else if (currentRoute.path === '/' && route.path == '/') {
            return true;
        } else if (currentRoute.path === '/swap' && route.path == '/swap') {
            return true;
        } else if (route.path === '/account' && currentRoute.path === '/account') {
            return true;
        } else if (route.path === '/account/activity' && currentRoute.path === '/account/activity') {
            return true;
        } else if (route.path === '/account' && currentRoute.path.includes('/account/collections')) {
            return true;
        } else if (route.path === '/staking' && currentRoute.path.includes('/staking')) {
            return true;
        } else if (route.path === '/parcel-merging' && currentRoute.path.includes('/parcel-merging')) {
            return true;
        } else if (route.path === '/dao' && currentRoute.path.includes('/dao')) {
            return true;
        } else if (route.path === '/paragons' && currentRoute.fullPath.startsWith('/paragons')) {
            return true;
        } else if (route.path === '/events' && currentRoute.fullPath.startsWith('/events')) {
            return true;
        } else if (route.path === '/betting' && currentRoute.fullPath.startsWith('/betting')) {
            return true;
        }
    };

    const navigationItems = computed(() => {
        return currentRoute.path.includes('/account') ? userNavigation : appNavigation;
    });
</script>

<style scoped lang="postcss">
    .app-sidebar__item {
        @apply bg-indigo-950 flex items-center px-4 py-3.5 rounded-md text-gray-300 hover:bg-indigo-940;
    }

    .app-sidebar__item:first-child {
        @apply mt-0;
    }

    .app-sidebar__item:last-child {
        @apply mb-0;
    }

    .app-sidebar__item.active {
        @apply text-white border-indigo-600 bg-gradient-to-r from-indigo-600 to-indigo-900 bg-opacity-50;
    }

    .app-sidebar__item.active span {
        @apply font-semibold;
    }
</style>
