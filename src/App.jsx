import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Info, Search, Bell, ChevronRight } from 'lucide-react';
import Row from './Row';
import Faq from './Faq';
import Footer from './Footer';
import './App.css';

function App() {
  const [movie, setMovie] = useState(null);
  const [heroBg, setHeroBg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const apiKey = '217371aa';

  // Array of popular OMDB IDs to pick random hero initially
  const popularMovies = [
    'tt3896198', // Guardians of the Galaxy Vol. 2
    'tt0816692', // Interstellar
    'tt0468569', // The Dark Knight
    'tt0133093', // The Matrix
    'tt1375666', // Inception
    'tt0109830', // Forrest Gump
    'tt0110912', // Pulp Fiction
  ];

  // Randomize row search terms slightly so they differ on refresh
  const [rowQueries, setRowQueries] = useState({
    trending: ['avengers', 'batman', 'superman', 'spider'][Math.floor(Math.random() * 4)],
    like: ['star wars', 'harry potter', 'lord of the rings'][Math.floor(Math.random() * 3)],
    scifi: ['alien', 'terminator', 'dune', 'blade runner'][Math.floor(Math.random() * 4)],
    action: ['mission', 'fast', 'die hard', 'bourne'][Math.floor(Math.random() * 4)],
    comedy: ['comedy', 'hangover', 'funny', 'school'][Math.floor(Math.random() * 4)]
  });

  const fetchInitialMovie = async () => {
    try {
      setLoading(true);
      const randomMovieId = popularMovies[Math.floor(Math.random() * popularMovies.length)];
      const response = await axios.get(`https://www.omdbapi.com/?i=${randomMovieId}&plot=full&apikey=${apiKey}`);
      if (response.data.Response === 'True') {
        const rawPoster = response.data.Poster !== 'N/A' && response.data.Poster ? response.data.Poster : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80';
        response.data.Poster = rawPoster.includes('SX300') ? rawPoster.replace('SX300', 'SX1080') : rawPoster;
        setMovie(response.data);
        setHeroBg(response.data.Poster);
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    fetchInitialMovie();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When a user clicks a movie from a Row, update the Hero component smoothly
  const handleMovieSelect = async (clickedMovie) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const response = await axios.get(`https://www.omdbapi.com/?i=${clickedMovie.imdbID}&plot=full&apikey=${apiKey}`);
      if (response.data.Response === 'True') {
        // Force high resolution poster replacement before setting state!
        const rawPoster = response.data.Poster !== 'N/A' && response.data.Poster ? response.data.Poster : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80';
        response.data.Poster = rawPoster.includes('SX300') ? rawPoster.replace('SX300', 'SX1080') : rawPoster;

        // Update text instantly for snappy UX
        setMovie(response.data);

        // Preload background image before changing BG state to prevent blank transition flashes
        const img = new Image();
        img.onload = () => setHeroBg(response.data.Poster);
        img.onerror = () => setHeroBg(response.data.Poster);
        img.src = response.data.Poster;
      }
    } catch (ignore) { }
  };

  if (loading) return <div className="loader">Loading KODFLIX...</div>;
  if (error) return <div className="error"><h2>Error Loading Movie</h2><p>{error}</p></div>;

  // Use the background image state which waits for load before smoothly swapping
  const activeBg = heroBg || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80';

  const heroStyle = {
    backgroundImage: `url("${activeBg}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center 20%',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className="app-container">
      {/* Navbar Section */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand">KODFLIX</div>
        <div className="nav-right">
          <Search color="white" size={24} style={{ cursor: 'pointer' }} />
          <Bell color="white" size={24} style={{ cursor: 'pointer' }} />

          <div
            className="profile-dropdown-container"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <div className="profile-icon">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Profile" />
            </div>
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-item">Manage Profiles</div>
                <div className="profile-menu-item">Account</div>
                <div className="profile-menu-item">Help Center</div>
                <div className="profile-menu-divider"></div>
                <div className="profile-menu-item">Sign out of KODFLIX</div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero" style={heroStyle}>
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <h1 className="hero-title">{movie?.Title}</h1>
          <div className="hero-meta">
            <span className="match-score">98% Match</span>
            <span className="rating">{movie?.Rated || 'PG'}</span>
            <span className="duration">{movie?.Runtime || '120 min'}</span>
            <span className="genre">{movie?.Genre}</span>
          </div>
          <p className="hero-description">{movie?.Plot}</p>
          <div className="hero-buttons">
            <button className="btn btn-play">
              <Play fill="black" size={24} /> Play
            </button>
            <button className="btn btn-info">
              <Info size={24} /> More Info
            </button>
          </div>
        </div>
        <div className="hero-fade-bottom"></div>
      </header>

      {/* Rows Section */}
      <div className="rows-container">
        <Row title="Trending Now" searchTerm={rowQueries.trending} onMovieClick={handleMovieSelect} />
        <Row title="You Might Also Like" searchTerm={rowQueries.like} onMovieClick={handleMovieSelect} />
        <Row title="Sci-Fi Movies" searchTerm={rowQueries.scifi} onMovieClick={handleMovieSelect} />
        <Row title="Action Blockbusters" searchTerm={rowQueries.action} onMovieClick={handleMovieSelect} />
        <Row title="Comedies" searchTerm={rowQueries.comedy} onMovieClick={handleMovieSelect} />
      </div>

      <Faq />
      <Footer />
    </div>
  );
}

export default App;
