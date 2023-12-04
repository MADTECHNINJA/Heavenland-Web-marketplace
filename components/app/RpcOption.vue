<template>
    <div
        @click="isRpcOptionOpened = !isRpcOptionOpened"
        :class="[
            !isRpcOptionOpened && 'md:mb-6',
            isCollapsed
                ? ' lg:block  xl:px-0 ml-6 md:ml-0 flex md:block items-center md:mx-1 lg:mx-0 '
                : 'mx-6 flex lg:mx-6 md:mx-1',
        ]"
        class="cursor-pointer bg-indigo-950 items-center py-3 rounded-lg text-gray-300 relative"
    >
        <div
            :class="[!isCollapsed && 'xl:mb-0 xl:mr-2', transparent && isCollapsed && 'md:mr-2']"
            class="min-w-[25px] flex ml-2 md:ml-0 md:mr-0 md:mb-1.5 justify-start md:justify-center"
        >
            <FontAwesomeIcon :icon="['fad', 'share-nodes']" />
        </div>
        <div class="flex flex-col ml-0.5 xl:ml-0">
            <span :class="!isCollapsed && 'xl:block'" class="text-sm font-normal hidden tracking-tight"> RPC </span>
            <span
                :class="transparent ? 'text-left md:-ml-1 lg:ml-0' : 'md:text-center'"
                class="text-gray-300 md:text-gray-400 md:text-xs text-sm font-normal tracking-tight"
            >
                {{ rpcType }}
            </span>
        </div>

        <div
            :class="[transparent ? '-right-3 ' : 'right-3 md:right-0', isCollapsed ? 'xl:hidden' : 'xl:block']"
            class="min-w-[25px] justify-center md:hidden absolute -mt-1"
        >
            <FontAwesomeIcon :icon="['fas', isRpcOptionOpened ? 'chevron-down' : 'chevron-right']" class="h-3 w-3" />
        </div>
    </div>
    <AppModal
        :class="isCollapsed ? 'lg:block' : 'lg:hidden'"
        @click="showModal = false"
        v-if="showModal"
        class="hidden md:block"
    >
        <AppCardTitle icon="share-nodes" :title="selectedRpcOption" />

        <div class="mx-3 mt-1.5 mb-1">
            <p class="text-sm mb-2 text-gray-300">
                Set RPC endpoint to
                {{ selectedRpcOption === RpcNode.CUSTOM ? selectedRpcOption.toLowerCase() : selectedRpcOption }}
            </p>
            <input
                v-if="selectedRpcOption === RpcNode.CUSTOM"
                v-model="customRpcUrl"
                type="text"
                name="endpoint"
                id="endpoint"
                class="block w-full rounded-md border-gray-400 border-opacity-20 bg-indigo-950 shadow-sm text-xs"
                placeholder="Enter custom RPC"
            />
        </div>

        <div class="mt-3 mx-3">
            <AppButton
                small
                class="w-full lg:w-auto"
                :disabled="selectedRpcOption === RpcNode.CUSTOM && !customRpcUrl.length"
                @click="save"
                >Save
            </AppButton>
        </div>
    </AppModal>

    <div
        v-if="isRpcOptionOpened"
        :class="transparent && isCollapsed && 'md:mr-4 lg:mr-3'"
        class="flex-col mb-4 transition-all"
    >
        <div
            :class="!isCollapsed ? 'xl:grid-cols-3' : 'xl:grid-cols-1'"
            class="grid grid-cols-3 md:grid-cols-1 mx-3 md:mx-0 lx:mx-3 xl:space-x-1 mt-1"
        >
            <div
                class="flex-col hover:brightness-125 space-y-2 items-center cursor-pointer text-gray-400 rounded-md py-2.5 grow flex justify-center"
                :class="[
                    selectedRpcOption === name && !transparent && 'bg-indigo-940',
                    !transparent && 'bg-indigo-940',
                    !isCollapsed && 'bg-indigo-940',
                ]"
                v-for="(name, index) in RpcNode"
                :key="index"
                @click="selectRpcOption(name)"
            >
                <FontAwesomeIcon
                    :icon="['far', selectedRpcOption === name ? 'circle-check' : 'circle-dashed']"
                    :class="selectedRpcOption === name && 'text-green-600'"
                />
                <span class="text-xs font-normal tracking-tight">{{ name }}</span>
            </div>
        </div>

        <div
            v-if="selectedRpcOption === RpcNode.CUSTOM"
            :class="isCollapsed ? 'block md:hidden' : 'block md:hidden xl:block'"
            class="mx-3 mt-3 mb-1"
        >
            <input
                v-model="customRpcUrl"
                type="text"
                name="endpoint"
                id="endpoint"
                class="block w-full rounded-md border-gray-400 border-opacity-20 bg-indigo-950 shadow-sm text-xs"
                placeholder="Enter custom RPC"
            />
        </div>

        <div :class="isCollapsed ? 'block md:hidden' : 'block md:hidden xl:block'" class="mt-3 mx-3">
            <AppButton
                small
                class="w-full"
                :disabled="selectedRpcOption === RpcNode.CUSTOM && !customRpcUrl.length"
                @click="save"
                >Save
            </AppButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { useConnection } from '#imports';
    import { RpcNode } from '~/composables/useAccount';
    import { onMounted, ref } from 'vue';
    import { NotificationManager } from '~/types/NotificationManager.types';
    import { Variant } from '~/types/Notification.types';
    import { NotificationTitles } from '~/types/Notification.data';
    import * as _ from 'lodash';

    defineProps<{
        isCollapsed: boolean;
        transparent?: boolean;
    }>();

    const showModal = ref(false);

    const { setRpc, rpcType, rpc } = useConnection();

    const isRpcOptionOpened = ref(false);
    const customRpcUrl = ref('');
    const selectedRpcOption = ref('');

    const selectRpcOption = (name) => {
        selectedRpcOption.value = name;

        showModal.value = true;
    };

    onMounted(() => {
        if (rpcType.value === RpcNode.CUSTOM) {
            customRpcUrl.value = rpc.value;
        }

        selectedRpcOption.value = _.cloneDeep(rpcType.value);
    });

    const save = () => {
        showModal.value = false;
        setRpc(selectedRpcOption.value === RpcNode.CUSTOM ? customRpcUrl.value : selectedRpcOption.value);
        isRpcOptionOpened.value = false;

        NotificationManager.getInstance().create({
            title: NotificationTitles.RPC_CHANGED,
            message: 'Your RPC has been successfully switched and will be used for all future traffic',
            variant: Variant.SUCCESS,
        });
    };
</script>

<style scoped></style>
