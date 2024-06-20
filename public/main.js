import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { fileURLToPath } from 'url';
import { menuTemplate } from '../src/Menu/menu.js';

import express from 'express';
import axios from 'axios';
import cookieParser from 'cookie-parser';

let mainWindow;
const __dirname = path.dirname(fileURLToPath(import.meta.url)); 
const startExpressServer =  () => {
  
  const app = express();
  const port = 5050;
  
  const CLIENT_ID = 'Ov23li4XNTpYkkIG0Ax1'; 
  const CLIENT_SECRET = 'a2309161a944d6b0d5f6c371fb2d676f217e7eb9'; 
  const CALLBACK_URL = `http://localhost:${port}/github/callback`;
  
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Route to start the OAuth flow
  app.get('/github/login', (req, res) => {
    const redirect_uri = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${CALLBACK_URL}&scope=repo,user`;
    res.redirect(redirect_uri);
  });
  
  // Route to handle the OAuth callback
  app.get('/github/callback', async (req, res) => {
    const requestToken = req.query.code;
    
    try {
      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: requestToken,
        },
        {
          headers: {
            accept: 'application/json',
          },
        }
      );
      
      const accessToken = response.data.access_token;
      
      // Store access token securely, here using cookies for simplicity
      res.cookie('github_token', accessToken, { httpOnly: true });
      
      // Fetch user details with the access token
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
      
      const userData = userResponse.data;
      localStorage.setItem('remote_url', userData.url)
      
      res.send(`Authentication successful! Welcome, ${userData.login}.`);
    } catch (error) {
      res.status(500).send(`Error during authentication: ${error.message}`);
    }
  });
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
  
  
}

app.whenReady().then(() => {
  startExpressServer();
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Ensure context isolation is disabled if you are using nodeIntegration
    },
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, 'build', 'index.html')}`
  );

  mainWindow.on('closed', () => (mainWindow = null));

  // Build the menu from the template
  const menu = Menu.buildFromTemplate(menuTemplate);
  // Set the menu as the application menu
  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
