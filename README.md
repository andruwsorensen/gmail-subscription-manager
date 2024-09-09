# Gmail Subscription Manager

Gmail Subscription Manager is a web application that helps users manage their email subscriptions. It connects to your Gmail account, analyzes your emails, and provides a user-friendly interface to view and manage your subscriptions.

## Features

- Fetches emails containing "unsubscribe" from your Gmail account
- Displays a list of subscriptions with email counts
- Provides unsubscribe links for easy management
- Allows sorting subscriptions by email count or sender address

## Technologies Used

- Frontend: React, TypeScript
- Backend: Node.js, Express
- Authentication: Google OAuth 2.0
- API: Gmail API

## Setup and Installation

[Add setup and installation instructions here]

## Usage

[Add usage instructions here]

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd client && npm install
   ```
3. Set up Google OAuth 2.0 credentials:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Gmail API for your project
   - Create OAuth 2.0 credentials (OAuth client ID)
   - Download the credentials and save them as `server/src/credentials.json`

4. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

Replace `your_client_id` and `your_client_secret` with the values from your Google OAuth 2.0 credentials.

## Token Setup

1. The `token.json` file will be automatically generated when you first authenticate with Google.
2. Make sure `token.json` is listed in your `.gitignore` file to prevent accidental commits of sensitive information.


