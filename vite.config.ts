import { defineConfig } from 'vite'
import path from "path";
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            'assets': path.resolve(__dirname, './src/assets'),
            'components': path.resolve(__dirname, './src/components'),
            'hooks': path.resolve(__dirname, './src/hooks'),
            'pages': path.resolve(__dirname, './src/pages'),
            'utils': path.resolve(__dirname, './src/utils'),
            'interfaces': path.resolve(__dirname, './src/interfaces'),
            'lib': path.resolve(__dirname, './src/lib'),
            'redux': path.resolve(__dirname, './src/redux'),
        },
    },
    define: {
        global: {}
    }
})