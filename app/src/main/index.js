'use strict'

import { app, BrowserWindow, Menu, globalShortcut, ipcMain, Tray } from 'electron'


let mainWindow = null
let tray = null

const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:${require('../../../config').port}` : `file://${__dirname}/index.html`

app.on('ready', () => {
  createWindow()
  createMenu()
  createTray()
  setupShortcut()
})

app.on('window-all-closed', (e) => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})


// create window
function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 720,
    width: 600,
    minHeight: 720,
    minWidth: 600
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', (e) => {
    mainWindow = null
  })

  // eslint-disable-next-line no-console
  console.log('mainWindow opened')
}

// create Tray
function createTray() {
  tray = new Tray('/Users/chakery/Desktop/translate/app/icons/tray.png')
  tray.on('click', () => {
    showWindow()
  })
}

// Create the Application's main menu
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
        {role: 'quit'}
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

// setup shortcut
function setupShortcut() {
  globalShortcut.register('CommandOrControl+T', () => {
    showWindow()
    mainWindow.webContents.send('quick_translating_notification')
  })
}

function showWindow() {
  if (mainWindow === null) {
    createWindow()
  } else {
    mainWindow.show()
  }
}
