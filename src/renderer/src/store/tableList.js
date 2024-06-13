/*
 * @Author: your name
 * @Date: 2024-04-12 18:00:43
 * @LastEditors: your name
 * @LastEditTime: 2024-04-15 21:25:42
 * @Description: 
 * @FilePath: \electron-app\src\renderer\src\store\tableList.js
 */
import { defineStore } from 'pinia';
export const useTableStore = defineStore('tableData', {
    state: () => {
        return {
            list: []
        };
    },
    getters: {
    },
    actions: {
        setData(data) {
            this.list = data;
        },
        getData() {
            return this.list
        },
    }
});