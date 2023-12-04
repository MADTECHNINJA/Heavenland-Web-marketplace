<template>
    <AppContainer>
        <AppTitle>Swap</AppTitle>

        <div class="mt-6">
            <p class="text-sm tracking-tight text-justify">
                Heavenmarket and Heavenland's native currency is HTO. If you want to enjoy perks Heavenland offers, you
                need HTO.
                <br /><br />
                To make buying HTO super simple, we've integrated Jupiter terminal allowing buying HTO for SOL or
                USDC.<br />
                Jupiter is the best liquidity aggregator on the Solana blockchain, which finds the best route for you.
                <br /><br />If you want to buy HTO for other assets, you can use it also. <br /><br /><b
                    >Please refresh the page after successful transaction to see your updated balance.</b
                >
            </p>
        </div>

        <div
            id="integrated-terminal"
            class="rounded-lg w-full md:w-1/2 xl:w-2/5 2xl:w-1/3 bg-gradient-to-r bg-gradient-to-r from-indigo-930/60 to-indigo-930/25 px-6 py-4 mt-6"
        />
    </AppContainer>
</template>

<script lang="ts" setup>
    import { onMounted } from 'vue';

    const loadJupiter = () => {
        window.Jupiter.init({
            mode: 'default',
            displayMode: 'integrated',
            integratedTargetId: 'integrated-terminal',
            endpoint: import.meta.env.VITE_HL_CONNECTION_CLUSTER_QUICKNODE,
            formProps: {
                initialInputMint: 'So11111111111111111111111111111111111111112',
                initialOutputMint: 'htoHLBJV1err8xP5oxyQdV2PLQhtVjxLXpKB7FsgJQD',
            },
        });
    };

    onMounted(loadJupiter);
</script>

<style scoped>
    input.appearance-none::-webkit-outer-spin-button,
    input.appearance-none::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
