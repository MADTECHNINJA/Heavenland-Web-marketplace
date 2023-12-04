<template>
    <div class="md:w-fit w-full pt-2 md:pt-0">
        <AppCardTitle :title="title" icon="list-check" />

        <div class="flex flex-col md:grid relative pt-3 grid-cols-9 gap-x-1.5 rounded-b-lg bg-indigo-930 pb-2.5">
            <div class="mx-2 relative z-20 md:ml-3 md:mx-0" :class="[disablePicker ? 'col-span-8' : 'col-span-4']">
                <div
                    class="border shadow overflow-hidden relative justify-center border-gray-300 border-opacity-[10%] bg-gradient-to-b from-indigo-940/10 to-indigo-930 rounded-lg flex flex-col pl-3 pr-6 py-1.5"
                >
                    <div class="leading-4.5 tracking-tight text-gray-300 text-sm text-opacity-[85%]">
                        <slot name="claim-all"></slot>
                    </div>
                    <div class="mt-5 pb-1">
                        <AppButton
                            :disabled="!ongoingItemsCount || claimButtonLoading"
                            :loading="claimAllButtonLoading"
                            @click="emits('claimItems', null)"
                            small
                        >
                            Claim all
                        </AppButton>
                    </div>
                    <div class="absolute opacity-[5%] -right-8 top-1/2 -translate-y-1/2">
                        <FontAwesomeIcon :icon="['fad', 'grip-dots']" class="h-32 w-32" />
                    </div>
                </div>
            </div>

            <div v-if="!disablePicker" class="col-span-5 mx-2 mt-2 md:mt-0 md:mx-0 md:mr-3">
                <div
                    v-if="ongoingItemsCount > 1"
                    class="px-3 py-1.5 relative overflow-hidden border justify-center border-gray-400 bg-gradient-to-b from-indigo-930/10 shadow to-indigo-930 border-opacity-[10%] rounded-lg flex flex-col"
                >
                    <div class="text-gray-300 tracking-tight text-sm leading-4.5 text-opacity-[85%]">
                        <slot name="claim"></slot>
                    </div>
                    <div class="mt-2 items-end gap-x-6 flex">
                        <div class="w-full">
                            <AppSlider
                                range
                                v-model="claimAmount"
                                class="w-full md:mt-1"
                                :min="1"
                                :max="ongoingItemsCount"
                            />
                        </div>

                        <div class="relative z-10">
                            <AppButton
                                :disabled="!ongoingItemsCount || claimAllButtonLoading"
                                :loading="claimButtonLoading"
                                @click="emits('claimItems', claimAmount)"
                                small
                                class="mb-1"
                            >
                                Claim
                            </AppButton>
                        </div>
                        <div class="absolute opacity-[5%] -right-8 top-1/2 -translate-y-1/2">
                            <FontAwesomeIcon :icon="['fad', icon]" class="h-32 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { watch, ref } from 'vue';
    const props = defineProps<{
        title: string;
        icon: string;
        ongoingItemsCount: number;
        claimButtonLoading: boolean;
        claimAllButtonLoading?: boolean;
        defaultAmount: number;
        disablePicker: boolean;
    }>();

    watch(props, () => {
        return (claimAmount.value = props.defaultAmount);
    });

    const claimAmount = ref(props.defaultAmount);

    const emits = defineEmits<{
        (event: 'claimItems', amount: number | null): void;
    }>();
</script>

<style></style>
