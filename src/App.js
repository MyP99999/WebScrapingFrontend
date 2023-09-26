import { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [elements, setElements] = useState(''); // New state for elements
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading

  const handleScrape = async () => {
    try {
      setData(null)
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:3001/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, elements: elements.split(',').map(e => e.trim()) }), // Send elements as array
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'An error occurred'); // Note: set the error from errorData.error
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter URL" />
      <input type="text" value={elements} onChange={(e) => setElements(e.target.value)} placeholder="Enter Elements, e.g., h3,p" />
      <button onClick={handleScrape} disabled={loading}>Scrape</button>
      {loading && <p>Loading...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default App;
