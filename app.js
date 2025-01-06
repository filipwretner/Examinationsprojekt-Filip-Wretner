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

// Hamburger-menu toggle
menuToggle.addEventListener("click", () => {menu.classList.toggle("active");});

// fetches movies based on inputs
searchButton.addEventListener("click", () => {

    // Resets favourite button when we search 
    if (showingFavourites) {
        favouritesButton.innerText = "Sparade filmer";
        showingFavourites = false;
    }

    const query = searchInput.value || ''; 
    const genreId = selectGenre.value || ''; 
    fetchMovies(query, genreId);
});

async function fetchMovies(title, genreId, page = 1) {

    try {

        // Trim and validate inputs
        title = (title && typeof title === 'string') ? title.trim() : '';
        genreId = (genreId && typeof genreId === 'string') ? genreId.trim() : '';

        let url;
        
        // Use different endpoints and parameters based on input
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

        // Updates movie count
        const movieCount = document.getElementById("movie-count");
        movieCount.innerText = `Antal filmer: ${movies.length}`;

        // Updates the display page
        if (movies.length > 0) {
            displayMovies(movies);
            createPages(data.total_pages, page); 
        } else {
            movieContainer.innerHTML = '<p>Hittade inga filmer som matchade din sökning.</p>';
        }

    } catch (error) {
        // Handles errors and prints them out in place of the movies
        console.error('Fel:', error.message || error);
        movieContainer.innerHTML = `
        <p>Ett fel uppstod vid hämtning av filmer. Försök igen senare.</p>
        <p>Detaljer: ${error.message || 'Okänt fel.'}</p>
        `;
    }
}


function displayMovies(movies) {

    // Makes sure pagination is shown 
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.style.display = "flex";

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

    // Button that calls for movie details
    detailButtons.forEach(button => {

        button.addEventListener("click", async (event) => {
            const movieId = button.getAttribute("data-id");
            await openMovieDetails(movieId);
        });
    });

    const buttons = document.querySelectorAll(".add-button, .remove-button");

    // Logic for add and remove buttons
    buttons.forEach(button => {

        button.addEventListener("click", (event) => {

            const button = event.target;

            // We want to save the id, title and poster path to be able to print out favourite movies and also remove the correct one
            const movieId = parseInt(button.getAttribute("data-id"));
            const movieTitle = button.getAttribute("data-title");
            const moviePoster = button.getAttribute("data-poster");

            // If button is add button and gets pressed, we save and change the button to remove button
            if (button.classList.contains("add-button")) {

                saveAsFavourite(movieId, movieTitle, moviePoster);
                button.classList.remove("add-button");
                button.classList.add("remove-button");
                button.innerText = "-";

            // Same as above but reverse    
            } else if (button.classList.contains("remove-button")) {

                removeFromFavourites(movieId);
                button.classList.remove("remove-button");
                button.classList.add("add-button");
                button.innerText = "+";
            }

            // Dummy variable to check if we have the "show favourites" button pressed
            if (showingFavourites) {
                displayFavourites();
            }
        });
    });

}

let showingFavourites = false;

favouritesButton.addEventListener("click", () => {

    // Similar logic to add/remove buttons but this time for showing all or  just favourite movies
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

    // Hides pagination when showing favourites
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.style.display = "none";

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

            const userConfirmed = confirm("Är du säker på att du vill ta bort denna film från dina favoriter?");

            if (userConfirmed) {
                removeFromFavourites(movieId);
                displayFavourites(); 
            }
        });
    });
}

async function openMovieDetails(movieId) {

    try {
        // Fetches movie details based on specific ID
        const response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);

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

        const movieDetails = await response.json();

        // Adds movie details to modal and changes display from none to flex.
        document.getElementById("movie-title-modal").innerText = movieDetails.title;
        document.getElementById("movie-poster-modal").src = `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`;
        document.getElementById("movie-overview").innerText = movieDetails.overview;
        document.getElementById("movie-release-date").innerText = movieDetails.release_date;
        document.getElementById("movie-rating").innerText = movieDetails.vote_average;

        document.getElementById("movie-modal").style.display = "flex";

    } catch (error) {
        console.error('Fel:', error.message || error);
        document.getElementById("movie-modal").innerHTML = `
        <p>Ett fel uppstod vid hämtning av filmer. Försök igen senare.</p>
        <p>Detaljer: ${error.message || 'Okänt fel.'}</p>
        `;
    }
}

// Closes modal by changing display from flex to none
document.getElementById("modal-close").addEventListener("click", () => {
    document.getElementById("movie-modal").style.display = "none";
});


function createPages(totalPages, currentPage = 1) {

    const paginationContainer = document.getElementById("pagination-container");

    paginationContainer.innerHTML = "";

    totalPages = 50;

    // Logic below makes sure we always have atleast 5 pages to navigate between
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    // Creates button that directs to the first page
    if (startPage > 1) {
        const firstPageButton = document.createElement("button");
        firstPageButton.className = "page-button";
        firstPageButton.innerText = "1";
        firstPageButton.addEventListener("click", () => fetchMovies(searchInput.value, selectGenre.value, 1));
        paginationContainer.appendChild(firstPageButton);

        // Creates dots if there's a gap between the first overall page and the first page in the pagination
        if (startPage > 2) {
            const dots = document.createElement("span");
            dots.innerText = "...";
            paginationContainer.appendChild(dots);
        }
    }

    // Creates buttons for each page, capped of by an end page so we don't print out 50 buttons at once
    for (let i = startPage; i <= endPage; i++) {

        const pageButton = document.createElement("button");
        pageButton.className = "page-button";
        pageButton.innerText = i;

        if (i === currentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", () => {
            fetchMovies(searchInput.value, selectGenre.value, i); 
        });

        paginationContainer.appendChild(pageButton);
    }

    // Same as the first page button but for the last page
    if (endPage < totalPages) {

        if (endPage < totalPages - 1) {
            const dots = document.createElement("span");
            dots.innerText = "...";
            paginationContainer.appendChild(dots);
        }

        const lastPageButton = document.createElement("button");
        lastPageButton.className = "page-button";
        lastPageButton.innerText = totalPages;
        lastPageButton.addEventListener("click", () => fetchMovies(searchInput.value, selectGenre.value, totalPages));
        paginationContainer.appendChild(lastPageButton);
    }
}

// Two function below handles local storage
function saveAsFavourite(id, title, posterPath) {

    if (!favouriteMovies.some(movie => movie.id === id)) {

        favouriteMovies.push({id, title, poster_path: posterPath});
        localStorage.setItem("favourites", JSON.stringify(favouriteMovies));

    }
}


function removeFromFavourites(id) {

    const movieIndex = favouriteMovies.findIndex(movie => movie.id === id);

    if (movieIndex !== -1) {

        favouriteMovies.splice(movieIndex, 1);
        localStorage.setItem("favourites", JSON.stringify(favouriteMovies));

        console.log(`Filmen togs bort från favoriter`);
    } 
    
}


fetchMovies();