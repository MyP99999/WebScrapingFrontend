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
    <div className="flex flex-col items-center bg-slate-300 min-h-screen p-4 space-y-4">
      {/* Container for Input and Buttons */}
      <div className="flex flex-col items-center justify-center space-y-2 w-full max-w-md">
        {/* Input for URL */}
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="px-4 py-2 w-full border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Input for Elements */}
        <input
          type="text"
          value={elements}
          onChange={(e) => setElements(e.target.value)}
          placeholder="Enter Elements, e.g., h3,p"
          className="px-4 py-2 w-full border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Scrape Button */}
        <button
          onClick={handleScrape}
          disabled={loading}
          className={`px-6 py-2 bg-blue-600 w-1/2 text-white  rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          Scrape
        </button>
      </div>

      {/* Display loading, data, or error messages */}
      {loading && <p className="text-gray-500">Loading...</p>}
      {data && (
        <div className="w-full max-w-screen-md">
          <pre className="text-sm bg-blue-600 text-white p-4 border-2 border-black rounded-lg overflow-auto whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
      {error && <p className="text-red-500 font-semibold text-xl">{error}</p>}
    </div>
  );

}

export default App;
