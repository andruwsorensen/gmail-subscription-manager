import React from 'react';
import './App.css';
import SubscriptionManager from './components/SubscriptionManager';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Gmail Subscription Manager</h1>
      </header>
      <main>
        <SubscriptionManager />
      </main>
    </div>
  );
}

export default App;