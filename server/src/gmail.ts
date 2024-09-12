import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

const gmail = google.gmail('v1');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

interface EmailSenderData {
  unsubscribeLink: string;
  emailCount: number;
}

interface EmailId {
  id: string;
  threadId: string;
}

const authenticateGmail = async (): Promise<OAuth2Client> => {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

    try {
        const token = fs.readFileSync(TOKEN_PATH, 'utf8');
        oAuth2Client.setCredentials(JSON.parse(token));
        return oAuth2Client;
    } catch (err) {
        console.log('No token found.');
        return oAuth2Client;
    }
};

const listMessages = async (auth: any) => {
  let allMessages: EmailId[] = [];
  let pageToken = null;

  do {
    const response: any = await gmail.users.messages.list({
      userId: 'me',
      auth,
      maxResults: 100,  // Fetch 100 at a time
      pageToken,
    });

    allMessages = allMessages.concat(response.data.messages || []);
    pageToken = response.data.nextPageToken;
  } while (pageToken);

  return allMessages;
};

const getEmailDetails = async (auth: any, messageId: string) => {
  try{
    const response = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      auth,
      format: 'full',
    });
    return response.data;
  } catch (err) {
    console.error('Error getting email details:', err);
    return null;
  }
};

export { authenticateGmail, listMessages, getEmailDetails };

