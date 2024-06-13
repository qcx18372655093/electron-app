<!--
 * @Author: qcx
 * @Date: 2024-04-11 15:42:50
 * @LastEditors: qcx
 * @LastEditTime: 2024-04-17 09:25:10
 * @FilePath: \electron-app\src\renderer\src\views\Dashboard\dashBoard.vue
 * @Description: 
-->
<template>
  <div class="dashboard">
    <div class="dashboard-content">
      <div class="dashboard-header">
        <a-button type="primary" @click="readConfig">读取配置</a-button>
        <a-button type="primary" @click="onShowAddGroupDrawer">添加分组</a-button>
        <a-button type="primary" danger @click="handleDeleteRow">删除选择</a-button>
      </div>
      <div class="dashboard-list">
        <a-table :columns="columns" :data-source="treeData" :row-selection="rowSelection">
          <template v-slot:operation="record">
            <a-button type="text" danger @click="handleNode(record.record, 'addNode')">新增节点</a-button>
            <a-button type="text" danger @click="handleNode(record.record, 'edit')">编辑节点</a-button>
            <a-button type="text" danger @click="handleDeleteNode(record.record)"
              :disabled="record.record.isParent ? true : false">删除节点</a-button>
          </template>
        </a-table>
      </div>
    </div>
    <DetailsPop ref="detailsPopRef" @getTableData="getTableData" :currentPath="currentPath"></DetailsPop>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, createVNode } from 'vue'
import bus from 'vue3-eventbus'
import DetailsPop from './components/detailsPop.vue'
import { message, Modal } from 'ant-design-vue'
import { useTableStore } from '@store/tableList.js'
import useTree from '@utils/index';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
const columns = [
  {
    title: '节点名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '节点类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center'
  },
  {
    title: '在线状态',
    dataIndex: 'isOnLine',
    key: 'isOnLine',
    align: 'center'
  },
  {
    title: '设备型号',
    dataIndex: 'unitType',
    key: 'unitType',
    align: 'center'
  },
  {
    title: '固有版本',
    dataIndex: 'versions',
    key: 'versions',
    align: 'center'
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
    align: 'center'
  },
  {
    title: 'Mac地址',
    dataIndex: 'mac',
    key: 'mac',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: '25%',
    slots: { customRender: 'operation' },
    align: 'center'
  }
]
const detailsPopRef = ref(null) //弹窗实例
const currentRow = ref({})//当前行数据
const treeData = ref([])//树形数据
const currentPath = ref('')//当前路径
const selectedRowKeysList = ref([])//勾选的行数据
const tableData = useTableStore()
const { filterArr, filterById, addKeyToChildren } = useTree();
/**
 * @description: 添加配置
 * @return {*}
 */
const readConfig = () => {
  window.electron.ipcRenderer.send('get-node-config', '读取节点配置')
}
/**
 * @description: 添加分组
 * @return {*}
 */
const onShowAddGroupDrawer = () => {
  let tablelist = JSON.parse(JSON.stringify(treeData.value))
  if (detailsPopRef.value) {
    nextTick(() => {
      detailsPopRef.value.initPage({}, 'addGrounp', tablelist)
    })
  }
}

/**
 * @description: 删除选择
 * @return {*}
 */
const handleDeleteRow = async () => {
  if (selectedRowKeysList.value.length === 0) {
    message.error('请选择数据进行删除！')
    return
  }
  treeData.value = filterArr(treeData.value, selectedRowKeysList.value);
  const result = await window.electron.ipcRenderer.invoke(
    'saveFile',
    currentPath.value,
    JSON.stringify(treeData.value)
  )
 localStorage.setItem('treeData',JSON.stringify(treeData.value))
  result ? message.success('删除成功！') : message.error('删除失败')
}
/**
 * @description: 勾选操作
 * @return {*}
 */
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys, selectedRows) => {
    selectedRowKeysList.value = selectedRows.map((v) => v.id)
  }
})
/**
 * @description: 新增/编辑节点
 * @param {*} row
 * @param {*} type
 * @return {*}
 */
const handleNode = (row, type) => {
  currentRow.value = row
  let tempObj = JSON.parse(JSON.stringify(row)) // 进行深拷贝
  let tablelist = JSON.parse(JSON.stringify(treeData.value))
  if (detailsPopRef.value) {
    nextTick(() => {
      detailsPopRef.value.initPage(tempObj, type, tablelist)
    })
  }
}
/**
 * @description: 删除节点
 * @param {*} row
 * @return {*}
 */
const handleDeleteNode = (row) => {
  Modal.confirm({
    title: '删除数据',
    icon: createVNode(ExclamationCircleOutlined),
    content: '是否要删除当前数据？',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      treeData.value = filterById(treeData.value, row.id)
      const result = await window.electron.ipcRenderer.invoke(
        'saveFile',
        currentPath.value,
        JSON.stringify(treeData.value)
      )
     localStorage.setItem('treeData',JSON.stringify(treeData.value))
      result ? message.success('删除成功！') : message.error('删除失败')
    },
    onCancel() {
      message.error('取消删除')
    }
  })
}
/**
 * @description: 获取子组件传递的数据
 * @param {*} data
 * @return {*}
 */
const getTableData = async (data) => {
  treeData.value = addKeyToChildren(data)
 localStorage.setItem('treeData',JSON.stringify(treeData.value))
}
const getList =()=>{
 return  new Promise(async (resove,reject)=>{
    window.electron.ipcRenderer.on('node-config', (event, arg, path) => {
      const newArray = JSON.parse(arg);
      treeData.value = addKeyToChildren(newArray)
      // tableData.setData(treeData.value)
     localStorage.setItem('treeData',JSON.stringify(treeData.value))
      console.log('treeData', treeData.value)
      currentPath.value = path
      resove()
    })

  })
}
onMounted(async () => {
  await getList()
  bus.on('currentPath',async(data)=>{
    if(data.name =="dashboard"){
    nextTick(()=>{
      tableData.value = JSON.parse(localStorage.getItem('treeData'))
      console.log(tableData.value,'tableData.value数据')
    })
    }
  })
})
</script>

<style scoped lang="scss">
.dashboard {
  padding: 20px;
}

.dashboard-header .ant-btn {
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>
