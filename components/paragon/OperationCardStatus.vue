<template>
    <div>
        <div v-if="operation.type === OperationType.STAMPING" class="flex items-center mb-4">
            <AppSpinner :size="3" class="pt-1" color="text-indigo-300" />
            <AppTooltip
                center
                text="Stamping is processing. It may takes a few minutes.
        "
            >
                <span class="mt-1 w-full px-1 text-indigo-300 block text-xs font-medium">Processing</span>
            </AppTooltip>
        </div>

        <div
            v-else
            :class="[
                operation.status?.toString() === OperationState[OperationState.ERROR] && 'text-red-500',
                operation.status?.toString() === OperationState[OperationState.FINISHED] &&
                    !isLoadingRunning &&
                    'text-green-500',
                (operation.status?.toString() === OperationState[OperationState.PROCESSING] || isLoadingRunning) &&
                    'text-indigo-300',
            ]"
            class="mb-3 px-1 flex items-center"
        >
            <FontAwesomeIcon
                v-if="isLoadingRunning"
                :icon="['far', 'circle-check']"
                class="flex text-indigo-300 items-center justify-center h-3 w-3 pt-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950"
            />
            <AppSpinner
                :size="3"
                color="text-indigo-300"
                class="pt-1"
                v-else-if="operation?.status.toString() === OperationState[OperationState.PROCESSING]"
            />

            <FontAwesomeIcon
                v-else-if="operation?.status.toString() === OperationState[OperationState.FINISHED]"
                :icon="['far', 'circle-check']"
                class="flex text-green-500 items-center justify-center h-3 w-3 pt-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950"
            />
            <FontAwesomeIcon
                v-else-if="operation?.status.toString() === OperationState[OperationState.ERROR]"
                :icon="['far', 'xmark-circle']"
                class="flex text-red-500 items-center justify-center h-3 w-3 pt-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-950"
            />
            <AppTooltip
                center
                :text="
                    isLoadingRunning
                        ? 'Operation is still in progress'
                        : operation?.status.toString() === OperationState[OperationState.PROCESSING]
                        ? 'Operation is being processed.<br />This might take a while depending on the number of requests present in a queue.'
                        : operation?.status.toString() === OperationState[OperationState.ERROR]
                        ? 'Operation has failed.<br />Please claim your paragons and try it again.'
                        : 'Operation is finished.<br />Your paragons are ready to claim.'
                "
            >
                <span class="mt-1 px-1 capitalize block text-xs font-medium">
                    {{
                        isLoadingRunning
                            ? 'Processed'
                            : operation?.status.toString() === OperationState[OperationState.ERROR]
                            ? 'Failed'
                            : operation?.status.toString().toLowerCase()
                    }}
                </span>
            </AppTooltip>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { Fusion, Breeding, Stamping, OperationState, OperationType } from '~/types/Paragon.types';
    defineProps<{
        operation: Fusion | Breeding | Stamping;
        isLoadingRunning?: boolean;
    }>();
</script>

<style></style>
