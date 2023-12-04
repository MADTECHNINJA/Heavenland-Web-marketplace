<template>
    <section class="rounded-lg w-full flex flex-col">
        <AppCardTitle title="Staking" icon="coin-vertical" />

        <div class="rounded-b-lg px-5 py-3 relative min-h-[100px relative overflow-hidden bg-indigo-940">
            <div class="flex space-x-6 items-center">
                <div>
                    <p class="text-sm text-gray-400 font-normal">Earn your HTO reward by staking this parcel.</p>
                    <div class="flex w-full mt-6 justify-center md:justify-start">
                        <AppSecondaryButton @click="redirect()" class="z-20">Stake</AppSecondaryButton>
                    </div>
                    <img
                        :src="htoCoin"
                        class="object-contain h-full lg:h-auto absolute -bottom-2 right-0 opacity-[0.15]"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import htoCoin from '@/assets/hto-coin.png';
    import { useRouter } from 'vue-router';
    import { useUserInfo } from '~/store/staking/userPool';
    import { computed } from 'vue';

    const props = defineProps<{
        parcelId: string | number;
    }>();

    const router = useRouter();
    const userPool = useUserInfo();

    const hasInitializedPool = computed(() => {
        return userPool.hasInitializedPool;
    });

    const redirect = () => {
        router.push(!hasInitializedPool.value ? '/staking' : '/staking/' + props.parcelId);
    };
</script>

<style></style>
