import { defineConfig } from 'vite'
import path from 'path';

export default defineConfig({
    server: {
        port: 3000,
    },
    publicDir: 'static',
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
})