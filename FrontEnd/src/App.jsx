import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [apiUrl, setApiUrl] = useState('http://localhost:3000');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [urls, setUrls] = useState([]);

  // Auth form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    emailOrPhone: ''
  });

  // URL shortener data
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUrls();
    }
  }, [user?.id]); // Only run when user ID changes, not on every user object change

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      let body;

      if (isLogin) {
        // For login, determine if input is email or phone
        const emailOrPhone = formData.emailOrPhone || formData.email;
        const isEmail = emailOrPhone.includes('@');
        
        body = {
          password: formData.password,
          ...(isEmail ? { email: emailOrPhone } : { phone: emailOrPhone })
        };
      } else {
        // For registration, use all fields
        body = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        };
      }

      console.log('Sending request to:', `${apiUrl}${endpoint}`);
      console.log('Request body:', body);

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setFormData({ name: '', email: '', phone: '', password: '', emailOrPhone: '' });
        showMessage(isLogin ? 'Login successful!' : 'Registration successful!');
      } else {
        showMessage(data.message || data.error || 'Authentication failed');
      }
    } catch (error) {
      showMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUrls([]);
    setShortUrl('');
    setLongUrl('');
  };

  const handleShortenUrl = async (e) => {
    e.preventDefault();
    if (!longUrl.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/url/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: longUrl })
      });

      const data = await response.json();

      if (response.ok) {
        setShortUrl(data.shortUrl);
        setLongUrl('');
        showMessage('URL shortened successfully!');
        fetchUrls();
      } else {
        showMessage(data.message || 'Failed to shorten URL');
      }
    } catch (error) {
      showMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUrls = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/url/urls`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched URLs data:', data);
        console.log('Raw response structure:', JSON.stringify(data, null, 2));
        
        // Handle different possible response structures
        let urlsArray = [];
        if (Array.isArray(data)) {
          urlsArray = data;
        } else if (data.urls && Array.isArray(data.urls)) {
          urlsArray = data.urls;
        } else if (data.data && Array.isArray(data.data)) {
          urlsArray = data.data;
        }
        
        console.log('URLs array:', urlsArray);
        console.log('First URL object keys:', urlsArray.length > 0 ? Object.keys(urlsArray[0]) : 'No URLs');
        setUrls(urlsArray);
      } else {
        console.error('Failed to fetch URLs, status:', response.status);
        const errorData = await response.json();
        console.error('Error data:', errorData);
      }
    } catch (error) {
      console.error('Failed to fetch URLs:', error);
    }
  };

  const deleteUrl = async (id) => {
    console.log('Delete function called with ID:', id);
    
    if (!id || id === 'undefined' || id === undefined) {
      console.error('Invalid ID provided for deletion:', id);
      showMessage('Cannot delete: Invalid URL ID');
      return;
    }
    
    if (!confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Use the correct endpoint from your API documentation
      const endpoint = `${apiUrl}/api/url/urls/${id}`;
      
      console.log('Making delete request to:', endpoint);
      
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        setUrls(urls.filter(url => url.id !== id));
        showMessage('URL deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('Delete error response:', errorData);
        showMessage(errorData.message || 'Failed to delete URL');
      }
      
    } catch (error) {
      console.error('Delete error:', error);
      showMessage('Network error. Failed to delete URL.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showMessage('Copied to clipboard!');
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🔗 URL Shortener</h1>
        {user && (
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="btn btn-small">Logout</button>
          </div>
        )}
      </header>

      <main className="container">
        {message && (
          <div className={`message ${message.toLowerCase().includes('error') || message.toLowerCase().includes('failed') || message.toLowerCase().includes('network') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {!user ? (
          <div className="auth-section">
            <div className="auth-tabs">
              <button 
                className={isLogin ? 'active' : ''} 
                onClick={() => {
                  setIsLogin(true);
                  setFormData({ name: '', email: '', phone: '', password: '', emailOrPhone: '' });
                  setMessage('');
                }}
              >
                Login
              </button>
              <button 
                className={!isLogin ? 'active' : ''} 
                onClick={() => {
                  setIsLogin(false);
                  setFormData({ name: '', email: '', phone: '', password: '', emailOrPhone: '' });
                  setMessage('');
                }}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuth} className="auth-form">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              )}
              
              {isLogin ? (
                <input
                  type="text"
                  placeholder="Email or Phone Number"
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({...formData, emailOrPhone: e.target.value})}
                  required
                />
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </>
              )}
              
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
              </button>
            </form>

            <div className="api-config">
              <label>API URL:</label>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="http://localhost:3000"
              />
            </div>
          </div>
        ) : (
          <div className="main-section">
            <div className="url-shortener">
              <h2>Shorten URL</h2>
              <form onSubmit={handleShortenUrl} className="shorten-form">
                <input
                  type="url"
                  placeholder="Enter long URL here..."
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Shortening...' : 'Shorten'}
                </button>
              </form>

              {shortUrl && (
                <div className="result">
                  <h3>✅ URL Shortened!</h3>
                  <div className="short-url">
                    <input type="text" value={shortUrl} readOnly />
                    <button onClick={() => copyToClipboard(shortUrl)} className="btn">
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="url-list">
              <h2>Your URLs ({urls.length})</h2>
              {urls.length === 0 ? (
                <p className="empty">No URLs yet. Shorten your first URL above!</p>
              ) : (
                <div className="urls">
                  {urls.map((url, index) => (
                    <div key={url.id || index} className="url-item">
                      <div className="url-info">
                        <div className="short">
                          <strong>Short:</strong> 
                          <a href={url.shortUrl || `${window.location.origin}/${url.shortcode}`} target="_blank" rel="noopener noreferrer">
                            {url.shortUrl || `${window.location.origin}/${url.shortcode}`}
                          </a>
                          <button onClick={() => copyToClipboard(url.shortUrl || `${window.location.origin}/${url.shortcode}`)} className="btn btn-small">
                            Copy
                          </button>
                        </div>
                        <div className="original">
                          <strong>Original:</strong> 
                          <a href={url.targeturl} target="_blank" rel="noopener noreferrer">
                            {url.targeturl}
                          </a>
                        </div>
                        <div className="date">
                          Created: {new Date(url.created_at).toLocaleDateString()}
                        </div>
                        {url.id && (
                          <div className="debug-info" style={{fontSize: '0.8rem', color: '#666'}}>
                            ID: {url.id}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => deleteUrl(url.id)} 
                        className="btn btn-danger btn-small"
                        disabled={!url.id}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;