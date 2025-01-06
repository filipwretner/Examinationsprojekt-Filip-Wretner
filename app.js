const apiKey = "8bf3a39da5484bb2b22ffd61e2facb8e"; // API key from TMDb API 8bf3a39da5484bb2b22ffd61e2facb8e
const baseUrl = "https://api.themoviedb.org/3"; // base URL we can add endpoints

let favouriteMovies = JSON.parse(localStorage.getItem("favourites")) || []; // Array for local storage


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

        const movieCount = document.getElementById("movie-count");
        movieCount.innerText = `Antal filmer: ${movies.length}`;

        if (movies.length > 0) {
            displayMovies(movies);
            createPages(data.total_pages, page); 
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

        const isFavourite = favouriteMovies.some(favMovie => favMovie.id === movie.id);
        const buttonText = isFavourite ? "-" : "+";
        const buttonClass = isFavourite ? "remove-button" : "add-button";

        movieCard.innerHTML = `
        <div class="image-container">
            <button class="${buttonClass}" data-id="${movie.id}" data-title="${movie.title}" data-poster="${movie.poster_path}" aria-label="${buttonText === '+' ? 'Spara' : 'Ta bort'} ${movie.title} bland dina favoriter">${buttonText}</button>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="Affisch för ${movie.title}">
            <button class="details-button" data-id="${movie.id}">Visa detaljer</button>
        </div>
        <h3 class="movie-title">${movie.title}</h3>
        `;

        movieContainer.appendChild(movieCard);
    });


    const detailButtons = document.querySelectorAll(".details-button");

    detailButtons.forEach(button => {

        button.addEventListener("click", async (event) => {
            const movieId = button.getAttribute("data-id");
            await openMovieDetails(movieId);
        });
    });

    const buttons = document.querySelectorAll(".add-button, .remove-button");

    buttons.forEach(button => {

        button.addEventListener("click", (event) => {

            const button = event.target;
            const movieId = parseInt(button.getAttribute("data-id"));
            const movieTitle = button.getAttribute("data-title");
            const moviePoster = button.getAttribute("data-poster");

            if (button.classList.contains("add-button")) {

                saveAsFavourite(movieId, movieTitle, moviePoster);
                button.classList.remove("add-button");
                button.classList.add("remove-button");
                button.innerText = "-";

            } else if (button.classList.contains("remove-button")) {

                removeFromFavourites(movieId);
                button.classList.remove("remove-button");
                button.classList.add("add-button");
                button.innerText = "+";
            }

            if (showingFavourites) {
                displayFavourites();
            }
        });
    });

}

let showingFavourites = false;

favouritesButton.addEventListener("click", () => {

    if (showingFavourites) {
        fetchMovies();
        favouritesButton.innerText = "Sparade filmer";
        showingFavourites = false;

    } else {
        displayFavourites();
        favouritesButton.innerText = "Visa alla filmer";
        showingFavourites = true;

    }
});

function displayFavourites() {

    if (favouriteMovies.length === 0) {
        movieContainer.innerHTML = "<p>Du har inga sparade filmer.</p>";
        return;
    }

    movieContainer.innerHTML = "";

    favouriteMovies.forEach(movie => {

        const movieCard = document.createElement("div");
        movieCard.className = "movie-card";

        movieCard.innerHTML = `
            <div class="image-container">
                <button class="remove-button" data-id="${movie.id}" data-title="${movie.title}" aria-label="Ta bort ${movie.title} bland dina favoriter">-</button>
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="Affisch för ${movie.title}">
            </div>
            <h3 class="movie-title">${movie.title}</h3>
            <button class="details-button" data-id="${movie.id}">Visa detaljer</button>
        `;

        movieContainer.appendChild(movieCard);
    });

    const detailButtons = document.querySelectorAll(".details-button");

    detailButtons.forEach(button => {

        button.addEventListener("click", async (event) => {
            const movieId = button.getAttribute("data-id");
            await openMovieDetails(movieId);
        });
    });

    const buttons = document.querySelectorAll(".remove-button");
    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            const button = event.target;
            const movieId = parseInt(button.getAttribute("data-id"));
            removeFromFavourites(movieId);
            displayFavourites(); 
        });
    });
}

async function openMovieDetails(movieId) {
    try {
        const response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);
        const movieDetails = await response.json();

        document.getElementById("movie-title-modal").innerText = movieDetails.title;
        document.getElementById("movie-poster-modal").src = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
        document.getElementById("movie-overview").innerText = movieDetails.overview;
        document.getElementById("movie-release-date").innerText = movieDetails.release_date;
        document.getElementById("movie-rating").innerText = movieDetails.vote_average;

        document.getElementById("movie-modal").style.display = "flex";
    } catch (error) {
        console.error('Fel vid hämtning av filmdetaljer:', error);
    }
}

document.getElementById("modal-close").addEventListener("click", () => {
    document.getElementById("movie-modal").style.display = "none";
});

// Function for pagination and to create page buttons
function createPages(totalPages, currentPage = 1) {

    const paginationContainer = document.getElementById("pagination-container");

    paginationContainer.innerHTML = "";

    totalPages = 50;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    if (startPage > 1) {
        const firstPageButton = document.createElement("button");
        firstPageButton.className = "page-button";
        firstPageButton.innerText = "1";
        paginationContainer.appendChild(firstPageButton);

        if (startPage > 2) {
            const dots = document.createElement("span");
            dots.innerText = "...";
            paginationContainer.appendChild(dots);
        }
    }

    for (let i = startPage; i <= endPage; i++) {

        const pageButton = document.createElement("button");
        pageButton.className = "page-button";
        pageButton.innerText = i;

        if (i === currentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", () => {
            fetchMovies(searchInput.value, selectGenre.value, i); // Laddar filmer för vald sida
        });

        paginationContainer.appendChild(pageButton);
    }

    if (endPage < totalPages) {

        if (endPage < totalPages - 1) {
            const dots = document.createElement("span");
            dots.innerText = "...";
            paginationContainer.appendChild(dots);
        }

        const lastPageButton = document.createElement("button");
        lastPageButton.className = "page-button";
        lastPageButton.innerText = totalPages;
        paginationContainer.appendChild(lastPageButton);
    }
}

function saveAsFavourite(id, title, posterPath) {

    if (!favouriteMovies.some(movie => movie.id === id)) {

        favouriteMovies.push({id, title, poster_path: posterPath});
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
    } 
    
}

// Initial page load
fetchMovies();