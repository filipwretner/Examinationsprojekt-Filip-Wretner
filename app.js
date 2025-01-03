const apiKey = "8bf3a39da5484bb2b22ffd61e2facb8e"; // API key from TMDb API 8bf3a39da5484bb2b22ffd61e2facb8e
const baseUrl = "https://api.themoviedb.org/3"; // base URL we can add endpoints

let favouriteMovies = []; // Empty array for localStorage

// 
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const selectGenre = document.getElementById("select-genre");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const favouritesButton = document.getElementById("favourites-button");
const movieContainer = document.getElementById("movie-container");


menuToggle.addEventListener("click", () => {menu.classList.toggle("active");});


searchButton.addEventListener("click", () => {
    const query = searchInput.value || '';  // Säkerställ att query inte är undefined eller null
    const genreId = selectGenre.value || '';  // Säkerställ att genreId inte är undefined eller null
    console.log("Title:", query);  // Logga för att kontrollera title
    console.log("Genre ID:", genreId);  // Logga för att kontrollera genreId
    fetchMovies(query, genreId);
});

async function fetchMovies(title, genreId) {
    try {
        title = (title && typeof title === 'string') ? title.trim() : '';
        genreId = (genreId && typeof genreId === 'string') ? genreId.trim() : '';

        let url;
        
        // Determine which URL to use based on inputs
        if (title && genreId) {
            // Both title and genre
            url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
        } else if (genreId) {
            // Only genre
            url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;
        } else if (title) {
            // Only title
            url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
        } else {
            // Fallback - no inputs
            url = `${baseUrl}/movie/popular?api_key=${apiKey}`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        let movies = data.results;

        // Additional genre filtering if both title and genre are present
        if (title && genreId) {
            movies = movies.filter(movie => movie.genre_ids.includes(parseInt(genreId)));
        }

        if (movies.length > 0) {
            displayMovies(movies);
        } else {
            movieContainer.innerHTML = '<p>No movies found matching your criteria.</p>';
        }

    } catch (error) {
        console.error('Error:', error);
        movieContainer.innerHTML = '<p>An error occurred while fetching movies.</p>';
    }
}


function displayMovies(movies) {

    movieContainer.innerHTML = "";

    movies.forEach(movie => {

        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";

        movieCard.innerHTML = `
        <button class="add-button" aria-label="Spara ${movie.title} bland dina favoriter">+</button>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="Affisch för ${movie.title}">
        <h3 class="movie-title">${movie.title}</h3>
        `;

        movieContainer.appendChild(movieCard);
    });

}

// Function for pagination and to create page buttons
function createPages() {

}


function saveAsFavourite(id, title) {

    if (!favouriteMovies.some(movie => movie.id === id)) {
        favouriteMovies.push({id, title});
        localStorage.setItem("favourites", JSON.stringify(favouriteMovies));
    }
}

// Function to remove movies from favourites
function removeFromFavourites() {

}

// Initial page load
fetchMovies();