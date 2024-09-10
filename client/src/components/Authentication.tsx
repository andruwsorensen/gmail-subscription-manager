import React from 'react';

function Authentication() {
  const handleAuthClick = async () => {
    console.log('handleAuthClick called');
    try {
      const response = await fetch('http://localhost:3000/auth', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.authUrl) {
        // Redirect the user to the Google authorization page
        window.location.href = data.authUrl;
      } else {
        console.log('Unexpected response:', data);
      }
    } catch (error) {
      console.error('Error during authentication', error);
    }
  };

  return (
    <div>
      <button onClick={handleAuthClick}>Authenticate with Google</button>
    </div>
  );
}

export default Authentication;