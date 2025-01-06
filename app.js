const apiKey = ""; // API key from TMDb API 8bf3a39da5484bb2b22ffd61e2facb8e
const baseUrl = "https://api.themoviedb.org/3"; // base URL we can add endpoints

let favouriteMovies = []; // Empty array for localStorage


const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const selectGenre = document.getElementById("select-genre");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const favouritesButton = document.getElementById("favourites-button");
const movieContainer = document.getElementById("movie-container");


menuToggle.addEventListener("click", () => {menu.classList.toggle("active");});


searchButton.addEventListener("click", () => {
    const query = searchInput.value || ''; 
    const genreId = selectGenre.value || ''; 
    console.log("Title:", query);  // TA BORT INNAN INLÄMNING
    console.log("Genre ID:", genreId); // TA BORT INNAN INLÄMNING
    fetchMovies(query, genreId);
});

async function fetchMovies(title, genreId, page = 1) {
    try {
        // Validera och trimma inputs
        title = (title && typeof title === 'string') ? title.trim() : '';
        genreId = (genreId && typeof genreId === 'string') ? genreId.trim() : '';

        let url;
        
        if (title && genreId) {
            url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}&page=${page}`;
        } else if (genreId) {
            url = `${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}`;
        } else if (title) {
            url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}&page=${page}`;
        } else {
            url = `${baseUrl}/movie/popular?api_key=${apiKey}&page=${page}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            let errorMessage;

            switch (response.status) {
                case 401:
                    errorMessage = 'Obehörig åtkomst. Kontrollera API-nyckeln.';
                    break;
                case 404:
                    errorMessage = 'Resursen kunde inte hittas.';
                    break;
                case 500:
                    errorMessage = 'Serverfel. Försök igen senare.';
                    break;
                default:
                    errorMessage = `HTTP-fel! Status: ${response.status}`;
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data || !data.results) {
            throw new Error('Svar från API är ogiltigt.');
        }

        const movies = data.results;

        if (movies.length > 0) {
            displayMovies(movies);
            createPages(data.total_pages, page); // Lägg till paginering
        } else {
            movieContainer.innerHTML = '<p>Hittade inga filmer som matchade din sökning.</p>';
        }

    } catch (error) {
        console.error('Fel:', error.message || error);
        movieContainer.innerHTML = `
        <p>Ett fel uppstod vid hämtning av filmer. Försök igen senare.</p>
        <p>Detaljer: ${error.message || 'Okänt fel.'}</p>
        `;
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
function createPages(totalPages, currentPage = 1) {
    const paginationContainer = document.getElementById("pagination-container");

    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {

        const pageButton = document.createElement("button");
        pageButton.className = "page-button";
        pageButton.innerText = i;

        // Markera den aktuella sidan
        if (i === currentPage) {
            pageButton.classList.add("active");
        }

        // Lägg till click-event för sidladdning
        pageButton.addEventListener("click", () => {
            fetchMovies(searchInput.value, selectGenre.value, i); // Laddar filmer för vald sida
        });

        paginationContainer.appendChild(pageButton);
    }
}

function saveAsFavourite(id, title) {

    if (!favouriteMovies.some(movie => movie.id === id)) {
        favouriteMovies.push({id, title});
        localStorage.setItem("favourites", JSON.stringify(favouriteMovies));
    }
}

// Function to remove movies from favourites
function removeFromFavourites(id) {

    const movieIndex = favouriteMovies.findIndex(movie => movie.id === id);

    if (movieIndex !== -1) {

        favouriteMovies.splice(movieIndex, 1);
        localStorage.setItem("favourites", JSON.stringify(favouriteMovies));

        console.log(`Filmen togs bort från favoriter`);
    } else {
        console.log(`FIlmen hittades inte i favoriter`);
    }
    
}

// Initial page load
fetchMovies();