<template>
    <div>
        <AppCardTitle id="preview" title="Preview" icon="images" />

        <div class="p-6">
            <div
                class="flex w-full p-7 flex-col justify-center border border-gray-400 aspect-square border-opacity-20 rounded-lg"
            >
                <div class="flex items-center relative justify-center">
                    <img
                        id="stamping"
                        v-if="selectedParagon"
                        :src="getParagonTierImage(selectedParagon.tier)"
                        class="rounded-md absolute z-[2]"
                        alt="Preview"
                    />

                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <canvas
                            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            id="canvas"
                        ></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { getParagonTierImage, cropImage } from '~/types/Paragon.utils';
    import { INftBase } from '@/types/Nft.types';
    import { IStampable } from '@/types/Paragon.types';
    import { watch, onMounted } from 'vue';
    import { IParagonBase } from '~/types/collections/Paragons.types';

    const props = defineProps<{
        selectedParagon: IParagonBase;
        selectedPfp?: IStampable & INftBase;
        client: any;
    }>();

    onMounted(() => {
        initCanvas();
    });

    watch(props, () => {
        initCanvas();
    });

    const resize = (canvas, stamping, preview) => {
        canvas.width = preview.clientWidth >= 676 ? stamping.clientWidth - 10 : stamping.clientWidth;
        canvas.height = preview.clientWidth >= 676 ? stamping.clientHeight - 10 : stamping.clientHeight;
        cropImage(canvas, props.selectedPfp);
    };

    const initCanvas = () => {
        if (props.selectedPfp) {
            const stamping = document.getElementById('stamping');
            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            const preview = document.getElementById('preview');

            canvas.width = preview.clientWidth >= 676 ? stamping.clientWidth - 10 : stamping.clientWidth;
            canvas.height = preview.clientWidth >= 676 ? stamping.clientHeight - 10 : stamping.clientHeight;
            cropImage(canvas, props.selectedPfp);

            window.addEventListener(
                'resize',
                function () {
                    resize(canvas, stamping, preview);
                },
                false
            );
        }
    };
</script>

<style></style>
