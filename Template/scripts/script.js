'use strict';

window.addEventListener('load', () => {
    setupCarousel();
    renderTopMovies();
    renderTrailers();
    const searchBtnRef = document.querySelector('#searchBtn');
    searchBtnRef.addEventListener('click', (event) => {
        event.preventDefault();
        renderSearchInput();
    });
});

//Denna funktion skapar funktionalitet för karusellen
function setupCarousel() {

    const buttons = document.querySelectorAll('[data-carousel-btn]');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const offset = btn.dataset.carouselBtn === 'next' ? 1 : -1;
            const slides = btn.closest('[data-carousel]').querySelector('[data-slides]');
            const activeSlide = slides.querySelector('[data-active]');
            let newIndex = [...slides.children].indexOf(activeSlide) + offset;
            
            if (newIndex < 0) {
                newIndex = slides.children.length - 1;
            } else if (newIndex >= slides.children.length) {
                newIndex = 0;
            }

            slides.children[newIndex].dataset.active = true;
            delete activeSlide.dataset.active;
        });
    });
}




function renderTopMovies() {
    try {             
        const cardContainers = document.querySelectorAll('#popularCardContainer');

        
        cardContainers.forEach(async (container, index) => {
            try {
                const topTwentyMoviesApi = 'https://santosnr6.github.io/Data/movies.json';
                const response = await fetch(topTwentyMoviesApi);

                if (!response.ok) {
                    throw new Error('Something went wrong noob!');
                }

                const data = await response.json();
                const movieCardToShow = data.slice(index * 20, (index + 1) * 20);

                
                    movieCardToShow.forEach(movie => {
                   
                    const movieCard = document.createElement('div');
                    movieCard.classList.add('movie-card');

                
                    const movieTitleElement = document.createElement('h3');
                    movieTitleElement.textContent = `Title: ${movie.title}`;
                    movieCard.appendChild(movieTitleElement);

                    const posterElement = document.createElement('img');
                    posterElement.src = movie.poster;
                    posterElement.alt = `Poster for ${movie.title}`;
                    movieCard.appendChild(posterElement);

                    const trailerLinkElement = document.createElement('a');
                    trailerLinkElement.href = movie.trailer_link;
                    trailerLinkElement.textContent = 'Watch Trailer';
                    trailerLinkElement.setAttribute('alt', `Trailer for ${movie.title}`);
                    movieCard.appendChild(trailerLinkElement);



                    container.appendChild(movieCard);

                });
            } catch (error) {
                console.error('Hä blev dä fel du:', error.message);
            }
        });
    } catch (error) {
        console.error('fel: ', error.message);
    }
}

async function renderTrailers() {
    try {
        const topTwentyMoviesApi = 'https://santosnr6.github.io/Data/movies.json';
        const response = await fetch(topTwentyMoviesApi);

        if (!response.ok) {
            throw new Error('Something went wrong noob!');
        }

        const data = await response.json();
        const iFrames = document.querySelectorAll('iframe');
        iFrames.forEach(iframe => {
            iframe.src = data.splice(Math.floor(Math.random() * data.length),1)[0].trailer_link;
        })
    } catch (error) {
        console.error('Error fetching trailers:', error);
    }
}

async function fetchSearchInput(query) {
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=dd29a2&s=${query}`);
        const data = await response.json();
        console.log(data.Search);
        return data.Search;
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
}

async function renderSearchInput() {
    const query = document.querySelector('#searchInput').value;
    if (query) {
        try {
            const searchResults = await fetchSearchInput(query);
            if (!searchResults || searchResults.length === 0) {
            } else {
                const searchResultsContainerRef = document.querySelector('#resultsContainer');
                const popularCardContainerRef = document.querySelector('#popularCardContainer');
                const popularTitleRef = document.querySelector('.popular__title');

                searchResultsContainerRef.classList.remove('d-none');
                popularCardContainerRef.classList.add('d-none');
                popularTitleRef.classList.add('d-none');
              

                searchResultsContainerRef.innerHTML = '';

                const resultsToShow = searchResults.slice(0, 10);

                for (const result of resultsToShow) {
                    const newMovieCard = document.createElement('div');
                    newMovieCard.classList.add('newMovieContainer');

                    const title = document.createElement('h3');
                    title.textContent = result.Title;

                    const year = document.createElement('p');
                    year.textContent = `Year: ${result.Year}`;

                    const poster = document.createElement('img');

                    
                    const movieDetails = await fetchMovieDetails(result.imdbID);
                    poster.src = movieDetails.Poster;
                    poster.alt = `${result.Title} Poster`;

                    newMovieCard.appendChild(title);
                    newMovieCard.appendChild(year);
                    newMovieCard.appendChild(poster);

                    newMovieCard.addEventListener('click', async () => {
                        const imdbID = result.imdbID;
            
                        if (imdbID) {
                            
                            window.location.href = `./movie.html?imdbID=${imdbID}`;
                        }
                    });
            
                    searchResultsContainerRef.appendChild(newMovieCard);
                }
            }
        } catch (error) {
            console.error('Fel vid hantering av sökresultat:', error);
        }
    }

    

}

async function fetchMovieDetails(imdbID) {
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=dd29a2&i=${imdbID}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fel vid hämtning av filminformation:', error);
    }
}


const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get('imdbID');

if (imdbID) {

    fetchAndDisplayMovieDetails(imdbID);
} else {
    console.error('IMDb ID not found in the URL.');
}


async function fetchAndDisplayMovieDetails(imdbID) {
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=dd29a2&i=${imdbID}`);
        const data = await response.json();

        const posterElement = document.querySelector('#movie__card-posterImg')
        const titleElement = document.querySelector('#movie__card-title');
        const yearElement = document.querySelector('#movie__card-year');
        const plotElement = document.querySelector('#movie__card-plot');

        titleElement.textContent = data.Title;
        yearElement.textContent = `Year: ${data.Year}`;
        plotElement.textContent = `Plot: ${data.Plot}`;

    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}
