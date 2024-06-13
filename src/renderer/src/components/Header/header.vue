<template>
  <div >
    <div :class="sidebar.getCollapse() ?'nav-bar-container':'is-collapse-nav'">
      <div class="collapse-btn" @click="collapseChage">
      <MenuFoldOutlined v-if="sidebar.collapse"/>
      <MenuUnfoldOutlined v-else />
    </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import { onMounted } from 'vue'
import { useSidebarStore } from '@store/sidebar.js'
import { MenuFoldOutlined,MenuUnfoldOutlined } from '@ant-design/icons-vue';
const sidebar = useSidebarStore()
/**
 * @description: 侧边栏折叠
 * @return {*}
 */
const collapseChage = () => {
  sidebar.handleCollapse()
}

onMounted(() => {
  if (document.body.clientWidth < 1500) {
    collapseChage()
  }
})
</script>
<style scoped>
@import url('./index.scss');
</style>
