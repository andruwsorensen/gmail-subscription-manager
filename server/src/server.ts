import express from 'express';
import * as path from 'path';
import { authenticateGmail, listSubscriptionEmails } from './gmail';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import cors from 'cors';
import * as fs from 'fs';

const app = express();
app.use(cors());

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

let oAuth2Client: OAuth2Client;

app.get('/api/subscriptions', async (req, res) => {
  try {
    const auth = await authenticateGmail();
    const subscriptions = await listSubscriptionEmails(auth);
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
  const code = req.query.code as string; // Extract the code from the query parameters

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
