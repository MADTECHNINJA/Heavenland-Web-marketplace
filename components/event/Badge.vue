<template>
    <div
        class="flex cursor-pointer space-x-1.5 px-2 items-center justify-center text-xs relative font-medium bg-gradient-to-r rounded-md h-[24px]"
        :class="[bgColor, disabled ? 'opacity-60' : 'opacity-100']"
    >
        <FontAwesomeIcon :icon="[tag.iconPrefix, tag.icon]" :class="['h-' + iconSize, 'w-' + iconSize]" />
        <span>{{ tag.name }}</span>
    </div>
</template>

<script lang="ts" setup>
    import { EventTag, EventTagName } from '~/types/Event.types';
    import { computed } from 'vue';

    const props = defineProps<{
        tag: EventTag;
        disabled?: boolean;
    }>();

    const bgColor = computed(() => {
        switch (props.tag.id) {
            case EventTagName.GAMING:
                return 'from-violet-900/50 via-violet-900/60 to-violet-900/70';

            case EventTagName.CULTURE:
                return 'from-pink-900/50 via-pink-900/60 to-pink-900/70';

            case EventTagName.BETTING:
                return 'from-sky-900/50 via-sky-900/60 to-sky-900/70';
        }

        return null;
    });

    const iconSize = computed(() => {
        switch (props.tag.id) {
            case EventTagName.GAMING:
            case EventTagName.CULTURE:
                return '2.5';

            case EventTagName.BETTING:
                return '3.5';
        }

        return null;
    });
</script>

<style scoped></style>
