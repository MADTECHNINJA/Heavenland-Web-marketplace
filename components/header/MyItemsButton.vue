<template>
    <NuxtLink to="/account" @click="$emit('update:open', false)">
        <div
            class="md:bg-gradient-to-r transition hover:brightness-125 from-indigo-700 to-indigo-900 bg-indigo-930 text-sm flex rounded-md text-gray-300-600 text-sm font-semibold"
        >
            <div class="px-4 flex flex-row items-center space-x-2 py-3 md:py-2">
                <FontAwesomeIcon icon="user-circle" />
                <p>My account</p>
            </div>
        </div>
    </NuxtLink>
</template>

<script lang="ts" setup></script>

<style scoped></style>
