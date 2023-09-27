// Importing necessary modules and styles
import { useState } from 'react';
import './App.css';

function App() {
  // State initialization
  const [url, setUrl] = useState(''); // State to hold the URL to be scraped
  const [elements, setElements] = useState(''); // State to hold the elements to be scraped
  const [data, setData] = useState(null); // State to hold the scraped data
  const [error, setError] = useState(''); // State to hold any error messages
  const [loading, setLoading] = useState(false); // State to hold the loading status

  // Function to handle the scraping
  const handleScrape = async () => {
    try {
      setData(null); // Reset data state
      setLoading(true); // Set loading to true as scraping begins
      setError(''); // Reset error state
      
      // Fetch request to the server to initiate scraping
      const response = await fetch('http://localhost:3001/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          elements: elements.split(',').map(e => e.trim()) // Convert elements string to array and remove any extra spaces
        }),
      });

      // Handle the response from the server
      if (response.ok) {
        const data = await response.json(); // Parse JSON data from response if successful
        setData(data); // Set data to state
      } else {
        const errorData = await response.json(); // Parse JSON data from response if there is an error
        setError(errorData.error || 'An error occurred'); // Set received error to state
      }
    } catch (error) {
      setError(error.message || 'An error occurred'); // Set error to state if any error occurs during fetching
    } finally {
      setLoading(false); // Set loading to false after scraping is complete or if an error occurs
    }
  };

  return (
    <div className="App">
      {/* Input for URL */}
      <input 
        type="text" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
        placeholder="Enter URL" 
      />

      {/* Input for Elements */}
      <input 
        type="text" 
        value={elements} 
        onChange={(e) => setElements(e.target.value)} 
        placeholder="Enter Elements, e.g., h3,p" 
      />

      {/* Scrape Button */}
      <button onClick={handleScrape} disabled={loading}>Scrape</button>

      {/* Display loading, data, or error messages */}
      {loading && <p>Loading...</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default App;
