/*
 * @Author: qcx
 * @Date: 2024-04-16 08:48:57
 * @LastEditors: qcx
 * @LastEditTime: 2024-04-16 10:49:09
 * @FilePath: \electron-app\electron.vite.config.mjs
 * @Description: 
 */
import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    base: './',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@components': resolve('src/renderer/src/components'),
        '@store': resolve('src/renderer/src/store'),
        '@utils': resolve('src/renderer/src/utils')
      }
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',  // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js',  // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]' // 资源文件像 字体，图片等
        }
      }
    },
    plugins: [vue()]
  }
})
