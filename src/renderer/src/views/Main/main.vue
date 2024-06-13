<!--
 * @Author: qcx
 * @Date: 2024-04-11 13:40:19
 * @LastEditors: your name
 * @LastEditTime: 2024-04-15 23:05:59
 * @FilePath: \electron-app\src\renderer\src\views\Main\main.vue
 * @Description: 
-->
<script setup lang="ts">
import { ref } from 'vue'

import HeaderNav from '@components/Header/header.vue'
import Sidebar from '@components/Sidebar/sidebar.vue'
import Tags from '@components/Tags/tags.vue'
import { useSidebarStore } from '@store/sidebar.js'
import { useTagsStore } from '@store/tags.js'
const sidebar = useSidebarStore()
const tags = useTagsStore()
</script>

<template>
  <div class="main">
    <Sidebar />
    <div :class="['main-content', !sidebar.getCollapse() ? 'is-main' : '']">
      <div :class="['fixed-header',sidebar.getCollapse() ?  '': 'is-collapse-header']">
        <!-- <HeaderNav /> -->
        <Tags />
      </div>
      <div :class="['content-box',!sidebar.getCollapse() ? 'is-collapse-main' :'']">
        <div class="content">
          <router-view v-slot="{ Component }">
            <transition name="move" mode="out-in">
              <keep-alive :include="tags.nameList">
                <component :is="Component" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import url('./index.scss');
</style>