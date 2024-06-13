import { defineStore } from 'pinia';

export const useTagsStore = defineStore('files', {
    state: () => {
		return {
			currentPath: ''
		};
	},
	getters: {},
	actions: {
        setPath(data) {
            this.currentPath = data;
        },
        getPath(){
            return this.currentPath;
        }
	}
})