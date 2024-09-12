import express from 'express';
import * as path from 'path';
import { authenticateGmail, listMessages, getEmailDetails } from './gmail';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import cors from 'cors';
import * as fs from 'fs';

const app = express();
app.use(cors());

// Update the SCOPES array
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.settings.basic',
  'https://www.googleapis.com/auth/gmail.settings.sharing',
  'https://www.googleapis.com/auth/gmail.modify'
];

const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
const EMAILS_PATH = path.join(__dirname, 'emails.json');

let oauth2Client: OAuth2Client;

function initializeOAuth2Client() {
  try {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.web;
    oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
      oauth2Client.setCredentials(token);
    }

    console.log('OAuth2Client initialized successfully');
  } catch (error) {
    console.error('Error initializing OAuth2Client:', error);
  }
}

// Call this function when the server starts
initializeOAuth2Client();

app.get('/emails', async (req, res) => {
  try {
    // if (fs.existsSync(EMAILS_PATH)) {
    //   const emails = JSON.parse(fs.readFileSync(EMAILS_PATH, 'utf8'));
    //   return res.status(200).json(emails);
    // }

    const messages = await listMessages(oauth2Client);

    const emails = await Promise.all(messages.map(async (message) => {
      const emailDetails = await getEmailDetails(oauth2Client, message.id);
      return emailDetails;
    }));
    console.log('Got to this point');

    fs.writeFileSync(EMAILS_PATH, JSON.stringify(emails, null, 2));
    return res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching emails' });
  }
});

app.get('/api/subscriptions', async (req, res) => {
  try {
    if (!oauth2Client) {
      return res.status(403).json({ error: 'OAuth2Client not initialized. Please set up the application.' });
    }
    if (!oauth2Client.credentials || Object.keys(oauth2Client.credentials).length === 0) {
      return res.status(403).json({ error: 'Authentication required. Redirecting to Google OAuth.' });
    }
    const subscriptions = await listMessages(oauth2Client);
    res.json(subscriptions);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching subscriptions' });
  }
});

app.get('/auth', (req, res) => {
   const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
   const { client_secret, client_id, redirect_uris } = credentials.web;
   const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
   const authUrl = oAuth2Client.generateAuthUrl({
     access_type: 'offline',
     scope: SCOPES,
   });
   res.json({ authUrl }); 
});

app.get('/oauth2callback*', async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const { client_secret, client_id, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    // Exchange authorization code for tokens
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Store the token
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

    // Redirect to a success page or return success message
    res.redirect('http://localhost:3000');
  } catch (error) {
    console.error('Error while exchanging the code for tokens:', error);
    res.status(500).send('Error during token exchange');
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
