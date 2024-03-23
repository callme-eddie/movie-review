import React, { useState } from 'react';
import axios from 'axios';
import ReviewForm from './ReviewForm'; // Import the ReviewForm component



function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [selectedReviewMovie, setSelectedReviewMovie] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});

  const handleSearch = async () => {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: '655e5c8e',
        type: 'movie',
        s: searchTerm,
      },
    });
    if (response.data.Search) {
      setSearchResults(response.data.Search);
      setCurrentResultIndex(0);
      setSelectedMovieDetails(null); // Reset selected movie details
    }
  };

  const handleReviewSubmit = (review) => {
    const updatedMovies = watchedMovies.map((movie) =>
      movie.imdbID === selectedReviewMovie.imdbID ? { ...movie, review } : movie
    );
    setWatchedMovies(updatedMovies);
  };

  const handleNextResult = () => {
    if (currentResultIndex < searchResults.length - 1) {
      setCurrentResultIndex(currentResultIndex + 1);
    }
  };

  const handlePreviousResult = () => {
    if (currentResultIndex > 0) {
      setCurrentResultIndex(currentResultIndex - 1);
    }
  };

  const handleShowDetails = async (imdbID) => {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: {
        apikey: '655e5c8e',
        i: imdbID,
        plot: 'full', // Get full plot
      },
    });
    if (response.data) {
      setSelectedMovieDetails(response.data);
    }
  };

  const handleHideDetails = () => {
    setSelectedMovieDetails(null);
  };

  const handleAddToWatched = () => {
    if (selectedMovieDetails) {
      setWatchedMovies([...watchedMovies, selectedMovieDetails]);
      setSelectedMovieDetails(null); // Reset selected movie details after adding to watched
      setSelectedReviewMovie(selectedMovieDetails); // Set selected movie for review
    } else if (searchResults[currentResultIndex]) {
      setWatchedMovies([...watchedMovies, searchResults[currentResultIndex]]);
      setSelectedReviewMovie(searchResults[currentResultIndex]); // Set selected movie for review
    }
  };

  const handleRemoveFromWatched = (imdbID) => {
    const updatedMovies = watchedMovies.filter((movie) => movie.imdbID !== imdbID);
    setWatchedMovies(updatedMovies);
  };

  const toggleReview = (imdbID) => {
    setExpandedReviews((prevState) => ({
      ...prevState,
      [imdbID]: !prevState[imdbID],
    }));
  };

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSearch();
        }}
      />
      <button onClick={handleSearch}>Search</button>
      {searchResults.length > 0 && (
        <>
          <div className="card">
            <img
              src={searchResults[currentResultIndex].Poster}
              className="card-img-top"
              alt={searchResults[currentResultIndex].Title}
            />
            <div className="card-body">
              <h5 className="card-title">{searchResults[currentResultIndex].Title}</h5>
              <button onClick={() => handleShowDetails(searchResults[currentResultIndex].imdbID)}>
                Show Details
              </button>
              <button onClick={handleAddToWatched}>Add to Watched</button>
            </div>
          </div>
          {selectedMovieDetails && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{selectedMovieDetails.Title}</h5>
                <p>{selectedMovieDetails.Year}</p>
                <p>{selectedMovieDetails.Plot}</p>
              </div>
              <button onClick={handleHideDetails}>Hide Details</button>
            </div>
                   )}
                   </>
                 )}
                 <div>
                   <button onClick={handlePreviousResult} disabled={currentResultIndex === 0}>
                     Previous
                   </button>
                   <button onClick={handleNextResult} disabled={currentResultIndex === searchResults.length - 1}>
                     Next
                   </button>
                 </div>
                 <div>
                   <h2>Watched Movies</h2>
                   <ul>
                     {watchedMovies.map((movie) => (
                       <li key={movie.imdbID}>
                         {movie.Title}
                         <button onClick={() => handleRemoveFromWatched(movie.imdbID)}>Remove from Watched</button>
                         {selectedReviewMovie && selectedReviewMovie.imdbID === movie.imdbID && (
                           <div>
                             <button onClick={() => toggleReview(movie.imdbID)}>Toggle Review</button>
                             {expandedReviews[movie.imdbID] && (
                               <div>
                                 <h3>Review</h3>
                                 {movie.review ? (
                                   <p>{movie.review}</p>
                                 ) : (
                                   <ReviewForm
                                     onSubmit={(review) => {
                                       handleReviewSubmit(review);
                                       toggleReview(movie.imdbID); // Collapse review form after submission
                                     }}
                                   />
                                 )}
                               </div>
                             )}
                           </div>
                         )}
                       </li>
                     ))}
                   </ul>
                 </div>
               </div>
             );
           }
           
           export default App;
           
