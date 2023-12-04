import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@formkit/nuxt'],

    css: ['@/styles/swv.css', '@/styles/form.css', '@/styles/style.css', '@/styles/oruga.css'],
    app: {
        head: {
            title: 'Heavenmarket',
            charset: 'UTF-8',
            meta: [],
            script: [
                {
                    src: 'https://terminal.jup.ag/main-v1.js',
                },
            ],
            link: [
                { rel: 'icon', href: '/favicon.ico' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Courier+Prime&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap',
                },
            ],
        },
    },

    alias: {
        '@jup-ag/cykura-sdk': 'node_modules/@jup-ag/cykura-sdk/dist/index.js',
        '@jup-ag/cykura-sdk-core': 'node_modules/@jup-ag/cykura-sdk-core/dist/index.js',
        '@cykura/sdk-core': 'node_modules/@cykura/sdk-core/dist/index.js',
    },

    vite: {
        build: {
            target: 'es2020',
        },
        optimizeDeps: {
            esbuildOptions: {
                target: 'es2020',
                define: {
                    global: 'globalThis',
                },
                plugins: [
                    NodeGlobalsPolyfillPlugin({
                        process: true,
                        buffer: true,
                    }),
                ],
            },
        },
    },

    sourcemap: false,

    ssr: false,
});
