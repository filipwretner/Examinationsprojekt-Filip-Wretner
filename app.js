const apiKey = ""; // API key from TMDb API 8bf3a39da5484bb2b22ffd61e2facb8e
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
    const query = searchInput.value;
    const genreId = selectGenre.value;
    fetchMovies(query, genreId)
});


async function fetchMovies(title, genreId) {

    try {

        const searchUrl = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
        const genreUrl = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;

        // fetching based on search parameters and genre at the same time
        const [searchResponse, genreResponse] = await Promise.all([
            fetch(searchUrl),
            genreId ? fetch(genreUrl) : Promise.resolve({ json: () => ({ results: [] }) })
        ]);

    
        if (!searchResponse.ok || !genreResponse.ok) {

            // Checking if which fetch or if both had errors
            const searchErrorData = !searchResponse.ok ? await searchResponse.json() : null;
            const genreErrorData = !genreResponse.ok ? await genreResponse.json() : null;

            let errorMessage = "Fel vid hämtning av data från API:\n";

            if (searchErrorData) {
                errorMessage += `Fel vi sökning (${searchResponse.status}): ${searchErrorData.status_message}\n`;
            }

            if (genreErrorData) {
                errorMessage += `Fel vid hämtning av genrer (${genreResponse.status}): ${genreErrorData.status_message}`;
            }

            throw new Error(errorMessage);
        }

        const searchData = await searchResponse.json();
        const genreData = await genreResponse.json();

        // Makes sure we don't add the same movie twice
        const allMovies = [...searchData, ...genreData];
        const uniqueMovies = Array.from(
            new Map(allMovies.map(movie => [movie.id, movie])).values()
        );

        displayMovies(uniqueMovies);

    } catch (error) {
        console.error(error.message);
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