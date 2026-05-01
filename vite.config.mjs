/// <reference types="vitest/config" />

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    base: process.env.VITE_BASE_URL ?? '/',
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        globals: true,
        css: true,
    },
});
