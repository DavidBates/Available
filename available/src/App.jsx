import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './App.css';

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [inMeeting, setInMeeting] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [gifUrl, setGifUrl] = useState('');
  console.log('App component rendered');

  const initClient = () => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/calendar.readonly',
      callback: (response) => {
        if (response.error) {
          console.error('Token client callback error:', response);
          return;
        }
        console.log('Access token obtained:', response);
        setIsSignedIn(true);
        setAccessToken(response.access_token);
        Cookies.set('accessToken', response.access_token, { expires: 30 }); 
        checkMeetingStatus(response.access_token);
      },
    });
    setTokenClient(client);
  };

  useEffect(() => {
    if (window.google) {
      initClient();
    }
    const savedToken = Cookies.get('accessToken');
    if (savedToken) {
      setIsSignedIn(true);
      setAccessToken(savedToken);
      checkMeetingStatus(savedToken);
    }
  }, []);

  const handleAuthClick = () => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    }
    else{
      initClient();
    }
  };

  const handleSignoutClick = () => {
    google.accounts.oauth2.revoke(import.meta.env.VITE_GOOGLE_CLIENT_ID, () => {
      setIsSignedIn(false);
      setInMeeting(false);
      Cookies.remove('accessToken');
    });
  };

  const checkMeetingStatus = async (accessToken) => {
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000); // Adding 5 minutes in milliseconds
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${now.toISOString()}&timeMax=${fiveMinutesFromNow.toISOString()}&showDeleted=false&singleEvents=true&maxResults=1&orderBy=startTime&eventTypes=default`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    const events = data.items;
    
    if (events.length > 0) {
      const event = events[0];
      const now = new Date();
      const start = new Date(event.start.dateTime);
      const end = new Date(event.end.dateTime);

      if (now >= start && now <= end) {
        setInMeeting(true);
        fetchGif('busy');
      } else {
        setInMeeting(false);
        fetchGif('available');
      }
    } else {
      setInMeeting(false);
      fetchGif('available');
    }
  };

  const fetchGif = async (status) => {
    try {
      const query = status === 'busy' ? 'nope' : 'Yes';
      const response = await fetch(
         `https://api.giphy.com/v1/gifs/random?api_key=${import.meta.env.VITE_GIPHY_API_KEY}&tag=${encodeURIComponent(query)}&rating=g`
      );
      const data = await response.json();
      const gifUrl = data.data.images.original.url;
      setGifUrl(gifUrl);
    } catch (error) {
      console.error('Error fetching GIF from Giphy:', error);
    }
  };


  useEffect(() => {
    if (accessToken) {
      const intervalId = setInterval(() => {
        checkMeetingStatus(accessToken);
      }, 1200000); // Check every two minutes

      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }
  }, [accessToken]);

  return (
    <div className="status" style={{ backgroundImage: `url(${gifUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {!isSignedIn && (
      <button onClick={handleAuthClick}>
        Sign In
      </button>)
      }
    </div>
  );
};

export default App;