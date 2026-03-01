import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const apiKey = '217371aa';

function Row({ title, searchTerm, onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`https://www.omdbapi.com/?s=${searchTerm}&apikey=${apiKey}`);
        if (response.data.Search) {
          // Filter out movies with no poster and remove duplicates
          const validMovies = response.data.Search.filter(movie => movie.Poster !== 'N/A');

          const uniqueMovies = [];
          const seenIds = new Set();

          for (const movie of validMovies) {
            if (!seenIds.has(movie.imdbID)) {
              seenIds.add(movie.imdbID);
              uniqueMovies.push(movie);
            }
          }

          setMovies(uniqueMovies);
        }
      } catch (error) {
        console.error("Error fetching movies", error);
      }
    };
    if (searchTerm) fetchMovies();
  }, [searchTerm]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row-posters-container">
        <button className="slider-btn left" onClick={() => handleScroll('left')}>
          <ChevronLeft />
        </button>
        <div className="row-posters" ref={rowRef}>
          {movies.map((movie, index) => {
            // Upgrade to higher res poster if available
            const hqPoster = movie.Poster.includes('SX300') ? movie.Poster.replace('SX300', 'SX500') : movie.Poster;
            return (
              <img
                key={`${movie.imdbID}-${index}`}
                src={hqPoster}
                alt={movie.Title}
                className="row-poster"
                onClick={() => onMovieClick(movie)}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            );
          })}
        </div>
        <button className="slider-btn right" onClick={() => handleScroll('right')}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export default Row;
