<!--
 * @Author: qcx
 * @Date: 2024-04-16 08:49:29
 * @LastEditors: qcx
 * @LastEditTime: 2024-04-16 10:45:15
 * @FilePath: \electron-app\src\renderer\src\views\Dashboard\components\detailsPop.vue
 * @Description:  
-->

<template>
  <a-drawer
    class="detailsPop"
    :title="title"
    :width="420"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="handleColse"
  >
    <div class="detailsPop-form">
      <a-form :model="form" ref="formRef" :rules="rules" layout="vertical">
        <a-row :gutter="24">
          <a-form-item
            label="父节点名称"
            name="parentName"
            v-show="currentType == 'addNode' || (currentType == 'edit' && isParentNode != null)"
          >
            <a-input v-model:value="form.parentName" placeholder="节点名称" :disabled="true" />
          </a-form-item>
        </a-row>
        <a-row :gutter="24">
          <a-form-item label="节点名称" name="name" props="name">
            <a-input v-model:value="form.name" placeholder="节点名称" allowClear />
          </a-form-item>
        </a-row>
        <a-row :gutter="24">
          <a-form-item label="节点类型" name="type">
            <a-select ref="select" v-model:value="form.type" style="width: 265.2px" allowClear>
              <a-select-option
                :value="item.value"
                v-for="item in selectOptions"
                :key="item.value"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-row>
        <a-row :gutter="24">
          <a-form-item label="在线状态" name="isOnLine">
            <a-select ref="select" v-model:value="form.isOnLine" style="width: 265.2px" allowClear>
              <a-select-option
                :value="item.value"
                v-for="item in onLineOptions"
                :key="item.value"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-row>
        <a-row :gutter="24">
          <a-form-item label="设备型号" name="unitType">
            <a-input v-model:value="form.unitType" placeholder="设备型号" style="width: 265.2px"  allowClear/>
          </a-form-item>
        </a-row>
        <a-row :gutter="24">
          <a-form-item label="固有版本" name="versions">
            <a-input v-model:value="form.versions" placeholder="固有版本" style="width: 265.2px"  allowClear/>
          </a-form-item>
        </a-row>
        <a-row :gutter="24">
          <a-form-item label="IP地址" name="ip">
            <a-input v-model:value="form.ip" placeholder="IP地址" style="width: 265.2px"  allowClear/>
          </a-form-item>
        </a-row>
        <a-row :gutter="24">
          <a-form-item label="Mac地址" name="mac">
            <a-input v-model:value="form.mac" placeholder="Mac地址" style="width: 265.2px"  allowClear/>
          </a-form-item>
        </a-row>
      </a-form>
    </div>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1
      }"
    >
      <a-button style="margin-right: 8px" @click="handleColse">取消</a-button>
      <a-button type="primary" @click="handleSave">保存</a-button>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue'
import { message } from 'ant-design-vue'
import useTree from '@utils/index'
const props = defineProps({
  currentPath: {
    type: String,
    default: ''
  }
})
const title = ref('')
const formRef = ref()
const currentType = ref('')
const visible = ref(false)
const isParentNode = ref('')
let tablelist = ref([])
let form = ref({
  id: '',
  parentName: '',
  name: '',
  type: '',
  isOnLine: '',
  unitType: '',
  versions: '',
  ip: '',
  key: '',
  mac: '',
  parentId: ''
})
const initialValues = {
  id: '',
  key: '',
  parentName: '',
  name: '',
  type: '',
  isOnLine: '',
  unitType: '',
  versions: '',
  ip: '',
  mac: '',
  parentId: ''
}
const selectOptions = [
  {
    label: 'input_dir',
    value: 'input_dir'
  },
  {
    label: 'output_dir',
    value: 'output_dir'
  }
]
const onLineOptions = [
  {
    label: '是',
    value: '是'
  },
  {
    label: '否',
    value: '否'
  }
]
const rules = {
  name: [{ required: true, message: '请填写名称内容', trigger: 'blur' }]
}
const emit = defineEmits([['getTableData']])
const { findParentName, updateArray, findAndAddChild } = useTree()
/**
 * @description: 初始化页面
 * @param {*} row
 * @param {*} type
 * @param {*} table
 * @return {*}
 */
const initPage = (row, type, table) => {
  tablelist.value = table
  currentType.value = type
  isParentNode.value = findParentName(table, row.id)
  if (type == 'edit') {
    title.value = !isParentNode.value ? '编辑子节点' : '编辑节点'
    form.value = row
    if (isParentNode.value != null) {
      form.value.parentName = isParentNode.value
    }
  } else if (type == 'addNode') {
    title.value = !isParentNode.value ? '新增子节点' : '新增节点'
    const { name: parentName, id: parentId } = row
    form.value = { parentName, parentId }
  } else {
    title.value = '新增分组'
  }
  visible.value = true
}

/**
 * @description: 关闭弹窗
 * @return {*}
 */
const handleColse = () => {
  Object.assign(form.value, initialValues)
  visible.value = false
}
/**
 * @description: 保存
 * @return {*}
 */
const handleSave = () => {
  formRef.value
    .validate()
    .then(async () => {
      let obj = {}
      let newTable = []
      if (currentType.value != 'edit') {
        form.value.id = `6afbcd582e0345c99158${Math.floor(
          Math.random() * 10
        )}083214ec4c${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
        form.value.key = form.value.id
        if (currentType.value == 'addGrounp') {
          tablelist.value.push(form.value)
        } else {
          if (form.value.parentName) {
            const { parentName, parentId, ...obj } = form.value
            findAndAddChild(tablelist.value, form.value.parentId, obj)
          }
        }
        newTable = tablelist.value
      } else {
        newTable = updateArray(tablelist.value, form.value)
      }
      try {
        const result = await window.electron.ipcRenderer.invoke(
          'saveFile',
          props.currentPath,
          JSON.stringify(newTable)
        )
        message.success(currentType.value == 'edit' ? '修改成功！' : '新增成功！')
        emit('getTableData', newTable)
      } catch (error) {
        console.error('保存文件时发生错误：', error)
      }
      visible.value = false
    })
    .catch((error) => {
      console.log('error', error)
    })
}

defineExpose({
  initPage,
  handleColse
})
</script>

<style scoped>
.detailsPop-form {
  display: flex;
  justify-content: center;
}
</style>
