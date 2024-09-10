import React from 'react';
import './App.css';
import SubscriptionManager from './components/SubscriptionManager';
import Authentication from './components/Authentication';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Gmail Subscription Manager</h1>
      </header>
      <main>
        <Authentication />
        <SubscriptionManager />
      </main>
    </div>
  );
}

export default App;