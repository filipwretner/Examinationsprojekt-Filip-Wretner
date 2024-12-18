const apiKey = ""; // API key from TMDb API 8bf3a39da5484bb2b22ffd61e2facb8e
const baseUrl = "https://api.themoviedb.org/3"

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


// Function to fetch list of movies from API
async function fetchMovies(title, genreKey) {

    try {

        const genreMap = {
            action: 28,
            animated: 16,
            drama: 18,
            fantasy: 14,
            comedy: 35,
            crime: 80,
            romance: 10749,
            scifi: 878,
            horror: 27,
            thriller: 53,
            adventure: 12,
        };

        const genreId = genreMap[genreKey] || '';

        
        const searchUrl = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
        const genreUrl = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;

        const [searchResponse, genreResponse] = await Promise.all([
            fetch(searchUrl),
            genreId ? fetch(genreUrl) : Promise.resolve({ json: () => ({ results: [] }) })
        ]);

        if (!searchResponse.ok || !genreResponse.ok) {
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

        const allMovies = [...searchData, ...genreData];
        const uniqueMovies = Array.from(
            new Map(allMovies.map(movie => [movie.id, movie])).values()
        );

        displayMovies(uniqueMovies);

    } catch (error) {
        console.error(error.message);
    }
}

searchButton.addEventListener("click", () => {
    const query = searchInput.value;
    const genreId = selectGenre.value;
    fetchMovies(query, genreId)
});

// Function to create HTML elements to display the movies
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

// Function to save movies to favourites
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