import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(__dirname, 'token.json');

interface EmailSenderData {
  unsubscribeLink: string;
  emailCount: number;
}


const authenticateGmail = async (): Promise<OAuth2Client> => {
    let credentials;
    try {
        credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json'), 'utf8'));
    } catch (error) {
        console.error('Error reading credentials file:', error);
        throw new Error('Failed to load credentials');
    }

    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

    if (fs.existsSync(TOKEN_PATH)) {
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
        oAuth2Client.setCredentials(token);
        return oAuth2Client;
    } else {
        return getNewToken(oAuth2Client);
    }
};

const getNewToken = async (oAuth2Client: OAuth2Client): Promise<OAuth2Client> => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this URL:', authUrl);
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const code = await new Promise<string>((resolve) => {
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            resolve(code);
        });
    });

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('Token stored to', TOKEN_PATH);
    
    return oAuth2Client;
};

const listSubscriptionEmails = async (auth: any) => {
    const gmail = google.gmail({ version: 'v1', auth });
    // This code is using the Gmail API to search for messages containing the word "unsubscribe"
    // It's fetching a list of messages that match this search query
    const res = await gmail.users.messages.list({
      userId: 'me',  // 'me' refers to the authenticated user's Gmail account
      q: 'unsubscribe',  // Search query to find messages with "unsubscribe" in them
    });
  
    const messages = res.data.messages || [];
    // const subscriptions = new Set<string>();
    const emailSenders: { [sender: string]: EmailSenderData } = {};

  
    // This loop iterates through each message in the 'messages' array
    for (const message of messages) {
      // For each message, we're fetching its full details using the Gmail API
      // The 'users.messages.get' method retrieves the full message data
      const msg = await gmail.users.messages.get({
        userId: 'me',  // 'me' refers to the authenticated user
        id: message.id!,  // The '!' asserts that message.id is non-null
      });
  
      const headers = msg.data.payload?.headers;
      const fromHeader = headers?.find(header => header.name === 'From');
      const unsubscribeHeader = headers?.find(header => header.name === 'List-Unsubscribe');
  
      if (fromHeader) {
        const sender = fromHeader.value || '';
        // subscriptions.add(sender);
        console.log(`Subscription found: ${sender}`);
  
        if (unsubscribeHeader && unsubscribeHeader.value) {
          console.log(`Unsubscribe link: ${unsubscribeHeader.value}`);
          addEmail(emailSenders, sender, unsubscribeHeader.value);
        }
      }
    }
  
    return emailSenders;
  };

  function addEmail(emailSenders: { [sender: string]: EmailSenderData }, sender: string, unsubscribeLink: string) {
    if (emailSenders[sender]) {
      // If the sender already exists, update the email count
      emailSenders[sender].emailCount += 1;
    } else {
      // If the sender doesn't exist, create a new entry
      emailSenders[sender] = {
        unsubscribeLink: unsubscribeLink,
        emailCount: 1
      };
    }
  }
  
  
export { authenticateGmail, listSubscriptionEmails };

// Comment out or remove the main() function call at the bottom of the file
// main();
