import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        //设置别名
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    plugins: [
        vue(),
        quasar({
            sassVariables: './src/quasar-variables.sass'
        })
    ],
    server: {
        open: false,//是否自动弹出浏览器页面
        host: '127.0.0.1',
        port: 8080,
        https: false,
        // 设置代理
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:9999',
                changeOrigin: true,
                secure: false,
                rewrite: (path: string) => path.replace(/^\/api/, '')
            }
        }
    }
});
