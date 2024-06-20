import { app, dialog } from 'electron';
import { initializeGitRepo, gitPull, gitPush, gitFetch, gitRemove } from '../../services/gitService.js';

export const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Repository…',
        id: 'new-repository',
        click() {
          dialog.showOpenDialog({
            title: 'Select Folder to Initialize Repository',
            properties: ['openDirectory']
          }).then(result => {
            if (!result.canceled && result.filePaths.length > 0) {
              initializeGitRepo(result.filePaths[0]);
            }
          }).catch(err => {
            console.error('Failed to open dialog:', err);
          });
        },
        accelerator: 'CmdOrCtrl+N',
      },
      { type: 'separator' },
      {
        label: 'Exit',
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Repository',
    submenu: [
      {
        id: 'push',
        label: "Push",
        accelerator: 'CmdOrCtrl+P',
        click() {
          gitPush();
        }
      },
      {
        id: 'pull',
        label: 'Pull',
        accelerator: 'CmdOrCtrl+Shift+P',
        click() {
          gitPull();
        }
      },
      {
        id: 'fetch',
        label: 'Fetch',
        accelerator: 'CmdOrCtrl+Shift+T',
        click() {
          gitFetch();
        }
      },
      {
        label: "Remove",
        id: 'remove-repository',
        accelerator: 'CmdOrCtrl+Backspace',
        click() {
          dialog.showOpenDialog({
            title: 'Select File to Remove',
            properties: ['openFile']
          }).then(result => {
            if (!result.canceled && result.filePaths.length > 0) {
              gitRemove(result.filePaths[0]);
            }
          }).catch(err => {
            console.error('Failed to open dialog:', err);
          });
        }
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      { label: 'Reload', role: 'reload' },
      { label: 'Toggle DevTools', role: 'toggleDevTools' },
      { type: 'separator' },
      { label: 'Reset Zoom', role: 'resetZoom' },
      { label: 'Zoom In', role: 'zoomIn' },
      { label: 'Zoom Out', role: 'zoomOut' },
      { type: 'separator' },
      { label: 'Full Screen', role: 'togglefullscreen' }
    ]
  },
];
