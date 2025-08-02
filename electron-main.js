const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: false // Allow loading local ES6 modules
        },
        icon: path.join(__dirname, 'assets/icon.png'), // Optional: app icon
        titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default'
    });

    // Load the index.html of the app.
    mainWindow.loadFile('Public/index.html');

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    // Set up the application menu
    createMenu();
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Save Image',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('saveBtn').click();
                        `);
                    }
                },
                { type: 'separator' },
                {
                    label: process.platform === 'darwin' ? 'Quit' : 'Quit',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload', label: 'Reload' },
                { role: 'forceReload', label: 'Force Reload' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Reset Zoom' },
                { role: 'zoomIn', label: 'Zoom In' },
                { role: 'zoomOut', label: 'Zoom Out' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Toggle Fullscreen' }
            ]
        },
        {
            label: 'Fractals',
            submenu: [
                {
                    label: 'Sierpinski',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('fractalSelect').value = 'sierpinski';
                            document.getElementById('fractalSelect').dispatchEvent(new Event('change'));
                        `);
                    }
                },
                {
                    label: 'Koch',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('fractalSelect').value = 'koch';
                            document.getElementById('fractalSelect').dispatchEvent(new Event('change'));
                        `);
                    }
                },
                {
                    label: 'Fractal Tree',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('fractalSelect').value = 'fractalTree';
                            document.getElementById('fractalSelect').dispatchEvent(new Event('change'));
                        `);
                    }
                },
                {
                    label: 'Mandelbrot',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('fractalSelect').value = 'mandelbrot';
                            document.getElementById('fractalSelect').dispatchEvent(new Event('change'));
                        `);
                    }
                },
                {
                    label: 'Julia',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('fractalSelect').value = 'julia';
                            document.getElementById('fractalSelect').dispatchEvent(new Event('change'));
                        `);
                    }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Info',
                    click: () => {
                        mainWindow.webContents.executeJavaScript(`
                            document.getElementById('infoBtn').click();
                        `);
                    }
                },
                {
                    label: 'About',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About Fractal Viewer',
                            message: 'Fractal Viewer v1.0.0',
                            detail: 'Interactive fractal viewer built with Electron and PIXI.js'
                        });
                    }
                }
            ]
        }
    ];

    // On macOS, adjust the menu to follow platform conventions
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about', label: 'About ' + app.getName() },
                { type: 'separator' },
                { role: 'services', label: 'Services', submenu: [] },
                { type: 'separator' },
                { role: 'hide', label: 'Hide ' + app.getName() },
                { role: 'hideothers', label: 'Hide Others' },
                { role: 'unhide', label: 'Show All' },
                { type: 'separator' },
                { role: 'quit', label: 'Quit ' + app.getName() }
            ]
        });

        // Window menu
        template.push({
            label: 'Window',
            submenu: [
                { role: 'close', label: 'Close' },
                { role: 'minimize', label: 'Minimize' },
                { role: 'zoom', label: 'Zoom' },
                { type: 'separator' },
                { role: 'front', label: 'Bring All to Front' }
            ]
        });
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow();
});

// You can include the rest of your app's main process code in this file.
// You can also put them in separate files and require them here.
