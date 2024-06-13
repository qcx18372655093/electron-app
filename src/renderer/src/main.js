/*
 * @Author: qcx
 * @Date: 2024-04-11 13:01:45
 * @LastEditors: your name
 * @LastEditTime: 2024-04-15 23:07:08
 * @FilePath: \electron-app\src\renderer\src\main.js
 * @Description: 
 */
import './assets/main.css'
import eventBus from 'vue3-eventbus'
import Antd from 'ant-design-vue';
import { createPinia } from 'pinia';
import router from './router';
import { createApp } from 'vue'
import App from './App.vue'
import "ant-design-vue/dist/reset.css"
createApp(App).use(Antd).use(eventBus).use(createPinia()).use(router).mount('#app')
