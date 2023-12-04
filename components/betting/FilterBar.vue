<template>
    <div class="flex items-center space-x-9 bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 rounded-lg py-2 px-4">
        <p v-if="eventId" class="text-sm tracking-tight text-gray-300 flex items-center">
            <span class="text-gray-300/90">Event</span>
            <span class="font-bold ml-2">{{ eventId }}</span>
        </p>

        <div class="flex items-center space-x-6">
            <p class="text-sm tracking-tight text-gray-300/90 flex items-center">Event type</p>

            <div class="flex space-x-2 items-center">
                <EventBadge
                    v-for="tag in EventTags"
                    :key="tag.id"
                    :tag="tag"
                    @click="toggleTag(tag.id)"
                    :disabled="!selectedTags.includes(tag.id)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { reactive } from 'vue';
    import { EventTags } from '~/types/Event.types';

    defineProps<{
        eventId: string;
    }>();

    const selectedTags = reactive<string[]>([]);

    const toggleTag = (id: string) => {
        const index = selectedTags.findIndex((t) => t === id);

        if (index !== -1) {
            selectedTags.splice(index, 1);
        } else {
            selectedTags.push(id);
        }
    };
</script>

<style scoped></style>
