import { app, shell, BrowserWindow, ipcMain, dialog, ipcRenderer, webContents } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
let currentPath = '';
/**
 * 主线程写文件
 * @param options: { title:  String, defaultPath: String, buttonLabel: String, filters: area}
 * @param content: String
 * @returns Promise
 */
ipcMain.handle('saveFile', async (event, filePath,newContent) => {
  try {
    if (filePath) {
      // 修改文件内容
      fs.writeFileSync(filePath, newContent, 'utf-8');
      return '文件修改成功';
    } else {
      return '未选择文件';
    }
  } catch (error) {
    return '文件修改失败：' + error.message;
  }
});

const readFile = (filePath) => {
  fs.readFile(filePath, { encoding: 'utf-8' }, (err, result) => {
    if (err) {
      console.log(err, 'error read file')
    } else {
      return new Promise((resolve) => {
        resolve(result)
      })
      // fileContent.value = result
    }
  })
}
// 监听渲染进程发来的消息
ipcMain.on('get-node-config', async (event, arg) => {
  if (arg === '读取节点配置') {
    try {
      await dialog.showOpenDialog().then(async (res) => {
        if (res.filePaths.length > 0) {
          fs.readFile(res.filePaths[0], { encoding: 'utf-8' }, (err, result) => {
            if (err) {
              console.log('read file error:', err)
            } else {
              event.sender.send('node-config', result,res.filePaths[0])
            }
          })
        }
      })
    } catch (e) {
      return Promise.reject({ error: e, success: false })
    }
  }
})

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })



  // try {
  //   console.log(filePath)
  //   fs.writeFileSync(filePath, 'hello world', 'utf-8')
  // } catch (e) {
  //   console.error('Failed to save the file!')
  // }

  // 跨域处理 https://zhuanlan.zhihu.com/p/443998585
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({ requestHeaders: { Origin: '*', ...details.requestHeaders } })
  })
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        'Access-Control-Allow-Origin': ['*'],
        ...details.responseHeaders
      }
    })
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})