import React from 'react';
import './App.css';
import SubscriptionManager from './components/SubscriptionManager';
import Authentication from './components/Authentication';
import EmailManager from './components/EmailManager';
import 'antd/dist/reset.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Gmail Subscription Manager</h1>
      </header>
      <main>
        <Authentication />  
        <EmailManager />
      </main>
    </div>
  );
}

export default App;