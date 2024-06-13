/*
 * @Author: your name
 * @Date: 2024-04-13 18:12:21
 * @LastEditors: your name
 * @LastEditTime: 2024-04-14 01:14:45
 * @Description: 
 * @FilePath: \electron-app\src\renderer\src\utils\index.js
 */
export default function useTree() {
  /**
   * @description: 寻找父节点名称
   * @param {*} data
   * @param {*} targetId
   * @param {*} parentName
   * @return {*}
   */
  const findParentName = (data, targetId, parentName = null) => {
    for (let item of data) {
      if (item.id === targetId) {
        return parentName // 如果找到目标节点，则返回父节点的名称
      }
      if (item.children && item.children.length > 0) {
        let result = findParentName(item.children, targetId, item.name)
        if (result) {
          return result // 如果在子节点中找到目标节点，则返回父节点的名称
        }
      }
    }
    return null // 如果未找到目标节点，则返回 null
  }
  /**
   * @description: 将传入的对象进行替换
   * @param {*} arr
   * @param {*} newObj
   * @return {*}
   */
  function updateArray(arr, newObj) {
    const updateItem = (arr, newObj) => {
      return arr.map(item => {
        if (item.id === newObj.id) {
          return newObj; // 找到对应id的节点并替换值
        } else if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: updateArray(item.children, newObj) // 递归更新子节点
          };
        } else {
          return item; // 其他情况保持不变
        }
      });
    };

    return updateItem(arr, newObj);
  }

  /**
   * @description: 找到当前parentId在的地方
   * @param {*} arr
   * @param {*} parentId
   * @param {*} obj
   * @return {*}
   */
  const findAndAddChild = (arr, parentId, obj) => {
    for (let item of arr) {
      if (item.id === parentId) {
        if (!item.children) {
          item.children = [];
        }
        item.children.push(obj);
        return;
      }
      if (item.children) {
        findAndAddChild(item.children, parentId, obj);
      }
    }
  };
  /**
   * @description: 根据传入的ids进行筛选
   * @param {*} arr
   * @param {*} filterIds
   * @return {*}
   */
  const filterArr = (arr, filterIds) => {
    return arr.filter(obj => {
      if (filterIds.includes(obj.id)) {
        return false;
      } else if (obj.children) {
        obj.children = filterArr(obj.children, filterIds);
        return true;
      }
      return true;
    });
  };
  /**
   * @description: 过滤子节点
   * @param {*} data
   * @param {*} id
   * @return {*}
   */
   const filterById = (data, id) => {
    let isDeleted = false;
    const traverseAndFilter = (items) => {
      return items.filter((item) => {
        if (item.id === id && (!item.children || item.children.length === 0)) {
          isDeleted = true; // 当前节点是可以删除的
          return false; // 过滤掉当前节点
        } else if (item.children) {
          item.children = traverseAndFilter(item.children); // 递归调用过滤子节点
        }
        return true; // 保留当前节点
      });
    };
  
    const filteredData = traverseAndFilter(data);
  
    if (isDeleted) {
      // 如果节点可以删除，则返回过滤后的数据
      return filteredData;
    } else {
      return data;
    }
  };
  /**
   * @description: 对树形控件数据进行数据处理
   * @param {*} arr
   * @return {*}
   */
  function addKeyToChildren(arr) {
    return arr.map(item => {
      const newItem = { ...item, key: item.id };
      if (newItem.children && newItem.children.length > 0) {
        newItem.children = addKeyToChildren(newItem.children);
        newItem.isParent = true; // 设置父节点的isParent为true
      } else {
        newItem.isParent = false;
      }
      return newItem;
    });
  }
  return {
    findParentName,
    updateArray,
    findAndAddChild,
    filterArr,
    filterById,
    addKeyToChildren
  };
}