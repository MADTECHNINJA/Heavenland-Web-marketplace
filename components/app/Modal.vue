<template>
    <TransitionRoot as="template" :show="open">
        <Dialog as="div" class="relative z-[100]" @close="submit">
            <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in duration-200"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-[rgba(4,4,35,.8)] bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild
                        as="template"
                        enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <DialogPanel
                            class="relative transform overflow-hidden bg-gradient-to-r from-indigo-930 to-indigo-940 rounded-lg px-4 p-2 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                        >
                            <div class="absolute -top-0.5 right-8">
                                <button
                                    type="button"
                                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                                    @click="submit"
                                >
                                    <span class="sr-only">Close</span>
                                    <FontAwesomeIcon
                                        :icon="['far', 'xmark']"
                                        class="flex items-center absolute justify-center h-5 w-5 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950"
                                    />
                                </button>
                            </div>

                            <slot></slot>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from '#app';
    import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';

    const emits = defineEmits<{
        (e: 'click'): void;
    }>();

    const open = ref(true);
    const router = useRouter();

    const submit = () => {
        emits('click');
        open.value = false;
    };
</script>
