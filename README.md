# Gmail Subscription Manager

Gmail Subscription Manager is a web application that helps users manage their email subscriptions. It connects to your Gmail account, analyzes your emails, and provides a user-friendly interface to view and manage your subscriptions.

## Features

- Authenticates with Google OAuth 2.0 to access your Gmail account
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

4. Create a `.env` file in the root directory with the following variables:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```
   Replace `your_client_id` and `your_client_secret` with the values from your Google OAuth 2.0 credentials.

5. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click on the "Authenticate with Google" button to connect your Gmail account
3. Once authenticated, the application will fetch your subscription emails
4. View your subscriptions, sorted by email count or sender address
5. Use the provided unsubscribe links to manage your subscriptions

## Token Setup

1. The `token.json` file will be automatically generated when you first authenticate with Google.
2. Make sure `token.json` is listed in your `.gitignore` file to prevent accidental commits of sensitive information.

## Development

- The backend server runs on port 3001 by default
- The frontend React app runs on port 3000 by default
- The project uses concurrently to run both the server and client simultaneously

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [ISC License](LICENSE).