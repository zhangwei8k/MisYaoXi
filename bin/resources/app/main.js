'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const Menu = electron.Menu;
const Tray = electron.Tray;
const ipc = require('electron').ipcMain;

// Report crashes to our server.
electron.crashReporter.start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

var appIcon = null;
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      fullscreen:true
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://'+__dirname+'/main/index.html');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools({detach:true});

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    });

    appIcon = new Tray('icon.ico');
    var contextMenu = Menu.buildFromTemplate([
        { label: '显示程序', type: 'radio', click: iconMenu_show },
        { label: '隐藏程序', type: 'radio', click: iconMenu_hide },
        { label: '全屏模式', type: 'radio', click: iconMenu_full },
        { label: '窗口模式', type: 'radio', click: iconMenu_win },
        { label: '调试模式', type: 'radio', click: iconMenu_debug },
        { label: '刷新程序', type: 'radio', click: iconMenu_reload },
        { label: '关闭程序', type: 'radio', click: iconMenu_close }
    ]);
    appIcon.setToolTip('SOPO智能体验系统');
    appIcon.setContextMenu(contextMenu);

    function iconMenu_show(){
        mainWindow.show();
    }
    function iconMenu_hide(){
        mainWindow.hide();
    }
    function iconMenu_full(){
        mainWindow.setFullScreen(true);
    }
    function iconMenu_win(){
        mainWindow.setFullScreen(false);
    }
    function iconMenu_reload(){
        mainWindow.webContents.reload();
    }
    function iconMenu_debug(){
        mainWindow.setFullScreen(false);
        mainWindow.webContents.reload();
        mainWindow.webContents.openDevTools({detach:true});
    }
    function iconMenu_close(){
        mainWindow.close()
    }
	
    ipc.on('pc-reset', function(){
        mainWindow.webContents.reload();
	});
});



