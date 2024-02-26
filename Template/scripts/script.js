'use strict';

window.addEventListener('load', () => {
    setupCarousel();
    renderTopMovies();
    renderTrailers();
    const searchBtnRef = document.querySelector('#searchBtn');
    searchBtn.addEventListener('click', (event) => {
        event.preventDefault();
        fetchSearchInput();
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
                    movieCard.appendChild(posterElement);

                    const trailerLinkElement = document.createElement('a');
                    trailerLinkElement.href = movie.trailer_link;
                    trailerLinkElement.textContent = 'Watch Trailer';
                    movieCard.appendChild(trailerLinkElement);

                    const imdbIdElement = document.createElement('p');
                    imdbIdElement.textContent = `IMDb ID: ${movie.imdbid}`;
                    movieCard.appendChild(imdbIdElement);

                    
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
        
    }
}

async function fetchSearchInput(query) {
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=dd29a2&s=${query}`);
        const data = await response.json();
        console.log(data.Search);
        return data.Search;
    } catch (error) {
        console.error('Fel vid hämtning av sökresultat:', error);
    }
}

async function showSearchInput() {
    const query = document.querySelector('#searchInput');
    console.log(query.value);
    if (query) {
        try {
            const searchResults = await fetchSearchInput(query.value);
            console.log('resultat', searchResults);
            if (!searchResults || searchResults.length === 0) {
                console.log('Inga resultat hittades.');
            } else {
                console.log('hej');
                const searchResultsContainer = document.querySelector('.results');
                console.log(searchResultsContainer);
                
                const popularCardContainer = document.querySelector('#popularCardContainer')
                console.log(popularCardContainer);
                popularCardContainer.classList.add('d-none');

                searchResultsContainer.innerHTML = '';

                const resultsToShow = searchResults.slice(0, 10);

                resultsToShow.forEach(result => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    const title = document.createElement('h3');
                    title.textContent = result.Title;

                    const year = document.createElement('p');
                    year.textContent = `Year: ${result.Year}`;

                    const type = document.createElement('p');
                    type.textContent = `Type: ${result.Type}`;

                    card.appendChild(title);
                    card.appendChild(year);
                    card.appendChild(type);

                    searchResultsContainer.appendChild(card);
                });

                searchResultsContainer.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Fel vid hantering av sökresultat:', error);
        }
    }
}
