import express from 'express';
import path from 'path';
import { authenticateGmail, listSubscriptionEmails } from './gmail';

const app = express();
const port = 5001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/subscriptions', async (req, res) => {
  // In this Express.js route handler:
  // 'res' stands for 'response'. It's an object representing the HTTP response
  // that Express sends when it receives an HTTP request.
  try {
    const auth = await authenticateGmail();
    const subscriptions = await listSubscriptionEmails(auth);
    // Here, res.json() is used to send a JSON response back to the client
    console.log('Subscriptions:', subscriptions);
    res.json(subscriptions);
  } catch (error) {
    console.error('Error:', error);
    // In case of an error, res is used to send a 500 status code and an error message
    res.status(500).json({ error: 'An error occurred while fetching subscriptions' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});