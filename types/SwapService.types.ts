import { useWallet } from 'solana-wallets-vue';
import * as web3 from '@solana/web3.js';
import { Jupiter } from '@jup-ag/core';
import { RouteInfo } from '@jup-ag/core/dist/lib/routes';
import { logger } from '@/plugins/logger.client';
import { Ref, ref } from 'vue';
import { SwapCurrency, SwapToken } from '~/types/SwapService.data';

export class SwapService {
    private inputMint: SwapCurrency;
    private outputMint: SwapCurrency;

    amount: Ref<number | null>;
    slippage: Ref<number | null>;

    private connection: web3.Connection;
    private jupiter: Jupiter;

    private readonly swapRoute: Ref<RouteInfo | null>;

    constructor(inputMint: SwapCurrency, outputMint: SwapCurrency) {
        logger.info('[SWAP_SERVICE] Constructing new SwapService with amount HTO of ', inputMint, outputMint);
        this.amount = ref(null);
        this.slippage = ref(1);
        this.inputMint = inputMint;
        this.outputMint = outputMint;
        this.swapRoute = ref(null);
    }

    isInputSol() {
        return this.inputMint === SwapCurrency.SOL;
    }

    changeMints({ inputMint, outputMint }: { inputMint?: SwapCurrency; outputMint?: SwapCurrency }) {
        this.inputMint = inputMint ?? this.inputMint;
        this.outputMint = outputMint ?? this.outputMint;
        this.swapRoute.value = null;
    }

    clear() {
        this.amount.value = null;
        this.swapRoute.value = null;
    }

    get isCorrect() {
        return (
            !Number.isNaN(this.amount.value) &&
            this.amount.value &&
            !Number.isNaN(this.slippage.value) &&
            this.slippage.value
        );
    }

    get formattedInputAmount() {
        if (Number.isNaN(this.amount.value)) {
            return null;
        }

        return (
            (this.swapRoute?.value?.inAmount / Math.pow(10, SwapToken.get(this.inputMint).decimals)).toFixed(2) ?? ''
        );
    }

    get formattedOutputAmount() {
        if (Number.isNaN(this.amount.value)) {
            return null;
        }

        return (
            (this.swapRoute?.value?.outAmount / Math.pow(10, SwapToken.get(this.outputMint).decimals)).toFixed(2) ?? ''
        );
    }

    get priceImpact() {
        if (!this.swapRoute?.value?.priceImpactPct || Number.isNaN(this.amount.value)) {
            return null;
        }

        const priceImpactPct = this.swapRoute.value.priceImpactPct ?? 0;
        return (priceImpactPct * 100).toFixed(5);
    }

    get rateForInput() {
        if (
            !this.swapRoute.value ||
            Number.isNaN(this.amount.value) ||
            !this.swapRoute.value?.outAmount ||
            !this.swapRoute.value?.inAmount
        ) {
            return null;
        }

        const inAmount = this.swapRoute.value.inAmount / Math.pow(10, SwapToken.get(this.inputMint).decimals);
        const outAmount = this.swapRoute.value.outAmount / Math.pow(10, SwapToken.get(this.outputMint).decimals);

        return (inAmount / outAmount).toFixed(6) + ' ' + this.inputMint;
    }

    get rateForOutput() {
        if (
            !this.swapRoute.value ||
            !this.swapRoute.value?.outAmount ||
            Number.isNaN(this.amount.value) ||
            !this.swapRoute.value?.inAmount
        ) {
            return null;
        }

        const inAmount = this.swapRoute.value.inAmount / Math.pow(10, SwapToken.get(this.inputMint).decimals);
        const outAmount = this.swapRoute.value.outAmount / Math.pow(10, SwapToken.get(this.outputMint).decimals);

        return (outAmount / inAmount).toFixed(6) + ' ' + this.outputMint;
    }

    get formattedOutputWithSlippage() {
        if (
            !this.swapRoute?.value?.outAmountWithSlippage ||
            Number.isNaN(this.amount.value) ||
            Number.isNaN(this.swapRoute?.value?.outAmountWithSlippage)
        ) {
            return null;
        }

        return (
            (
                this.swapRoute.value.outAmountWithSlippage / Math.pow(10, SwapToken.get(this.outputMint).decimals)
            ).toFixed(2) +
            ' ' +
            this.outputMint
        );
    }

    async load() {
        logger.info('[SWAP_SERVICE] Loading Jupiter and computing routes');
        const clusterUrl =
            'https://lingering-floral-snowflake.solana-mainnet.quiknode.pro/fab95e9d3a370f638c595de55dd087033bfbb5b4/';
        const cluster = 'mainnet-beta';

        if (!clusterUrl) {
            throw new Error('not defined: cluster');
        }

        const { publicKey } = useWallet();

        this.connection = new web3.Connection(clusterUrl);

        this.jupiter = await Jupiter.load({
            connection: this.connection,
            cluster,
            user: publicKey.value,
            routeCacheDuration: 10_000,
            wrapUnwrapSOL: true,
        });
    }

    async computeCurrencyRoute() {
        if (this.isCorrect) {
            const routeParams = {
                inputMint: new web3.PublicKey(SwapToken.get(this.inputMint).address),
                outputMint: new web3.PublicKey(SwapToken.get(this.outputMint).address),
                inputAmount: this.amount.value * Math.pow(10, SwapToken.get(this.inputMint).decimals),
                slippage: this.slippage.value,
            };

            const routes = await this.jupiter.computeRoutes(routeParams);

            logger.info('[SWAP] Top 3 routes for swap: 1st route', routes.routesInfos?.[0] ?? 'No route');
            logger.info('[SWAP] Top 3 routes for swap: 2nd route', routes.routesInfos?.[1] ?? 'No route');
            logger.info('[SWAP] Top 3 routes for swap: 3rd route', routes.routesInfos?.[2] ?? 'No route');

            this.swapRoute.value = routes.routesInfos[0] ?? null;
        }
    }

    async execute() {
        await this.computeCurrencyRoute();

        if (!this.swapRoute) {
            throw new Error('not defined: swapRoute');
        }

        const { transactions } = await this.jupiter.exchange({
            routeInfo: this.swapRoute.value,
        });

        const { setupTransaction, swapTransaction, cleanupTransaction } = transactions;

        return { setupTransaction, swapTransaction, cleanupTransaction };
    }
}
