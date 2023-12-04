import { defineStore } from 'pinia';
import { DataWrapper } from '@/types/DataWrapper.types';
import { logger } from '@/plugins/logger.client';
import { Paragon } from '~/js/paragon';
import { Breeding, Fusion, IOperation, Operations, Stamping } from '~/types/Paragon.types';

export const useParagonStore = defineStore({
    id: 'paragon',

    state: () => ({
        operations: new DataWrapper<Operations>(),
    }),

    getters: {
        hasOperations: (state) =>
            !state.operations.data?.breeding.length &&
            !state.operations.data?.fusion.length &&
            !state.operations.data?.stamping.length,

        breedingOperations: (state) => state.operations.data?.breeding,
        fusionOperations: (state) => state.operations.data?.fusion,
        stampingOperations: (state) => state.operations.data?.stamping,

        allOperations: (state) => {
            return [
                ...(state.operations.data?.breeding ?? []),
                ...(state.operations.data?.fusion ?? []),
                ...(state.operations.data?.stamping ?? []),
            ] as IOperation[];
        },
    },

    actions: {
        async fetchOperations() {
            try {
                const response = await Paragon.getInstance().getAllOperation();

                const operations: Operations = {
                    fusion: [],
                    breeding: [],
                    stamping: [],
                };

                operations.breeding = response.breeding.map((b) => new Breeding(b));
                operations.fusion = response.fusion.map((b) => new Fusion(b));
                operations.stamping = response.stamping.map((b) => new Stamping(b));

                if (operations) {
                    this.operations.setData(operations);
                } else {
                    this.operations.setError();
                }
            } catch (error: any) {
                this.operations.setError();

                logger.error(error);
                throw new Error(error);
            }
        },
    },
});
