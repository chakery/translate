'use strict'

import { app, BrowserWindow, Menu, globalShortcut, ipcMain, Tray } from 'electron'
import path from 'path'

let mainWindow = null
let tray = null
var force_quit = false

const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:${require('../../../config').port}` : `file://${__dirname}/index.html`

app.on('ready', () => {
  createWindow()
  createMenu()
  createTray()
  setupShortcut()
})

app.on('before-quit', (e) => {
  if(!force_quit){
    e.preventDefault()
    mainWindow.hide()
    sendCleanContentNotification()
  }
})

app.on('activate-with-no-open-windows', () => {
  mainWindow.show()
})

app.on('window-all-closed', (e) => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  mainWindow.show()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
  mainWindow = null
})

app.on('before-quit', () => {
  force_quit = true
})

// -------------------------------------------------------
//                      井水不犯河水
// -------------------------------------------------------

// 创建window
function createWindow () {

  mainWindow = new BrowserWindow({
    height: 720,
    width: 600,
    minHeight: 720,
    minWidth: 600
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('close', (e) => {
    if(!force_quit){
      e.preventDefault()
      mainWindow.hide()
      sendCleanContentNotification()
    } else {
      mainWindow = null
    }
  })
}

// 创建 Tray
function createTray() {
  // let trayPath = __dirname + '/tray.png'
  // tray = new Tray(trayPath)
  // tray.on('click', () => {
  //   showWindow()
  // })
}

// 创建应用菜单
function createMenu() {
  const template = [
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  }
]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {label: 'quit', accelerator:'CommandOrControl+Q', click: () => {
          force_quit = true
          app.quit()
        }}
      ]
    })

    // Edit menu
    template[1].submenu.push(
      {type: 'separator'},
      {
        label: 'Speech',
        submenu: [
          {role: 'startspeaking'},
          {role: 'stopspeaking'}
        ]
      }
    )

    // Window menu
    template[3].submenu = [
      {role: 'close'},
      {role: 'minimize'},
      {role: 'zoom'},
      {type: 'separator'},
      {role: 'front'}
    ]
}

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// 快速翻译通知
function sendQuickTranslateNotification() {
  mainWindow.webContents.send('quick_translating_notification')
}

// 清理内容通知
function sendCleanContentNotification() {
  mainWindow.webContents.send('clean_content_notification')
}

// 设置快捷键
function setupShortcut() {
  globalShortcut.register('CommandOrControl+T', () => {
    mainWindow.show()
    sendQuickTranslateNotification()
  })
  globalShortcut.register('ctrl+t', () => {
    mainWindow.show()
    sendQuickTranslateNotification()
  })
}
