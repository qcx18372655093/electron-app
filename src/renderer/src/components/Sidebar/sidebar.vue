<!--
 * @Author: qcx
 * @Date: 2024-04-16 08:49:29
 * @LastEditors: qcx
 * @LastEditTime: 2024-04-16 14:32:27
 * @FilePath: \electron-app\src\renderer\src\components\Sidebar\sidebar.vue
 * @Description: 
-->

<template>
  <div :class="['side-bar-container', sidebar.getCollapse() ? '' : 'is-collapse']">
    <div class="logo-container-vertical">
      <CodepenOutlined class="logoIcon" />
      <span class="title">分布式助手</span>
    </div>
    <div class="">
      <a-menu id="menu" :class="['initSidebarMent', sidebar.getCollapse() ? '' : 'sidebarMent']"
        v-model:selectedKeys="selectedKeys" mode="inline" @click="handleClick">
        <a-menu-item key="0">
          <template #icon>
            <PieChartOutlined />
          </template>
          <span>功能配置</span>
        </a-menu-item>
        <a-menu-item key="1">
          <template #icon>
            <FundOutlined />
          </template>
          <span>流程图</span>
        </a-menu-item>
      </a-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useTagsStore } from '@store/tags'
import { useSidebarStore } from '@store/sidebar'
import { useRouter } from 'vue-router'
import { PieChartOutlined, CodepenOutlined,FundOutlined } from '@ant-design/icons-vue';
import bus from 'vue3-eventbus'
const selectedKeys = ref(['0'])
const router = useRouter()
const sidebar = useSidebarStore()
const items = [
  {
    index: '/dashboard',
    title: '功能配置',
    permiss: '0'
  },
  {
    index: '/logicflow',
    title: '流程图',
    permiss: '1'
  }
]
/**
 * @description: 点击nav按钮
 * @param {*} e
 * @return {*}
 */
const handleClick = (e) => {
  const { keyPath, key } = e;
  selectedKeys.value = keyPath
  router.push({ path: items[key].index })
}

onMounted(() => {
  handleClick({ key: "0", keyPath: ['0'] })
  bus.on('currentPath',obj=>{
    console.log(obj,'obj对象')
    const index = items.findIndex(item => item.index === obj.path);
    const key = items[index].permiss;
    const keyPath = [String(index)];
    const result = { key, keyPath };
    handleClick(result)
  })
})
</script>

<style scoped>
@import url('./index.scss');
</style>
