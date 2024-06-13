<!--
 * @Author: your name
 * @Date: 2024-04-12 18:00:43
 * @LastEditors: qcx
 * @LastEditTime: 2024-04-16 10:17:39
 * @Description: 
 * @FilePath: \electron-app\src\renderer\src\components\Tags\tags.vue
-->
<template>
  <div class="tabs-bar-container" v-if="tags.show">
    <div class="collapse-left">
      <div class="collapse-btn" @click="collapseChage">
        <MenuFoldOutlined v-if="sidebar.collapse" />
        <MenuUnfoldOutlined v-else />
      </div>
      <ul class="tabs-bar-list">
        <li class="tags-li" v-for="(item, index) in filteredTags" :class="{ active: isActive(item.path) }" :key="index"
          >
          <router-link :to="item.path" class="tags-li-title" @click="handleChangeTab(item)">{{ item.title }}</router-link>
          <CloseOutlined v-if="filteredTags.length > 1" @click="closeTags(index)"></CloseOutlined>
        </li>
      </ul>
    </div>
    <div class="collapse-right">
      <div class="tags-close-box">
        <a-dropdown>
          <template #overlay>
            <a-menu @click="handleTags">
              <a-menu-item key="1"> 关闭其他 </a-menu-item>
              <a-menu-item key="2">
                <UserOutlined />
                关闭所有
              </a-menu-item>
            </a-menu>
          </template>
          <a-button>
            标签选项
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import bus from 'vue3-eventbus'
import { useTagsStore } from '@store/tags.js'
import { onMounted, watch, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import { CloseOutlined, UserOutlined, DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import { useSidebarStore } from '@store/sidebar.js'
const sidebar = useSidebarStore()
const route = useRoute()
const router = useRouter()
const filteredTags = ref([]);
const tags = useTagsStore()
const isActive = (path) => {
  return path === route.fullPath
}
/**
 * @description: 侧边栏折叠
 * @return {*}
 */
const collapseChage = () => {
  sidebar.handleCollapse()
}
watch(
  () => tags.list,
  (newList) => {
    filteredTags.value = newList.filter((tag, idx) => tag.name !== 'index' && (idx !== 0 || newList.length > 0));
  },
  { immediate: true, deep: true }
);
/**
 * @description: 关闭单个标签
 * @param {*} index
 * @return {*}
 */
const closeTags = (index) => {
  const delItem = tags.list[index]
  tags.delTagsItem(index)
  const item = tags.list[index] ? tags.list[index] : tags.list[index - 1]
  if (item) {
    delItem.path === route.fullPath && router.push(item.path)
    // bus.emit('currentPath', item)
  } else {
    router.push('/dashboard')
  }
}
const handleChangeTab = (item)=>{
  bus.emit('currentPath', item)
}
/**
 * @description: 设置标签
 * @return {*}
 */
const setTags = (route) => {
  const isExist = tags.list.some((item) => {
    return item.path === route.fullPath
  })
  if (!isExist) {
    if (tags.list.length >= 8) tags.delTagsItem(0)
    tags.setTagsItem({
      name: route.name,
      title: route.meta.title,
      path: route.fullPath
    })
  }
}
setTags(route)
onBeforeRouteUpdate((to) => {
  setTags(to)
})

// 关闭全部标签
const closeAll = () => {
  tags.clearTags()
  router.push('/dashboard')
  tags.setTagsItem({
    name: "dashboard",
    title: "功能配置",
    path: "/dashboard"
  })
}
// 关闭其他标签
const closeOther = () => {
  const curItem = tags.list.filter((item) => {
    return item.path === route.fullPath
  })
  tags.closeTagsOther(curItem)
}
const handleTags = (command) => {
  command === 'other' ? closeOther() : closeAll()
}
onMounted(() => {
  if (document.body.clientWidth < 1500) {
    collapseChage()
  }
})
</script>

<style>
@import url('./index.scss');
</style>
