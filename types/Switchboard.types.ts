import { AggregatorAccount, loadSwitchboardProgram } from '@switchboard-xyz/switchboard-v2';
import * as web3 from '@solana/web3.js';
import { logger } from '~/plugins/logger.client';
import { ComputedRef, Ref, ref } from 'vue';
import { useConnection } from '~/composables/useAccount';

export class Switchboard {
    private readonly connection: ComputedRef<web3.Connection>;
    private aggregatorAccount: AggregatorAccount;

    rate: Ref<number>;

    constructor() {
        const { connection } = useConnection();

        this.connection = connection;
    }

    async load() {
        try {
            const program = await loadSwitchboardProgram(import.meta.env.VITE_HL_NAME_CLUSTER, this.connection.value);

            this.aggregatorAccount = new AggregatorAccount({
                program,
                publicKey: new web3.PublicKey(import.meta.env.VITE_HL_SWITCHBOARD_FEED_ADDRESS),
            });

            await this.getRate();
        } catch (e) {
            logger.error('[SWITCHBOARD] Loading', e);
        }
    }

    async getRate() {
        if (this.aggregatorAccount) {
            this.rate = ref((await this.aggregatorAccount.getLatestValue()).toNumber());
        }
    }
}
