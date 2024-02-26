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
                    movieCard.appendChild(posterElement);

                    const trailerLinkElement = document.createElement('a');
                    trailerLinkElement.href = movie.trailer_link;
                    trailerLinkElement.textContent = 'Watch Trailer';
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

async function renderSearchInput() {
    const query = document.querySelector('#searchInput').value;
    console.log(query);
    if (query) {
        try {
            const searchResults = await fetchSearchInput(query);
            console.log('resultat av sökning', searchResults);
            if (!searchResults || searchResults.length === 0) {
                console.log('Inga resultat hittades.');
            } else {
                const searchResultsContainerRef = document.querySelector('#resultsContainer');
                console.log(searchResultsContainerRef);
                const popularCardContainerRef = document.querySelector('#popularCardContainer');
                const popularTitleRef = document.querySelector('.popular__title');
                
                searchResultsContainerRef.classList.remove('d-none');             
                popularCardContainerRef.classList.add('d-none');
                popularTitleRef.classList.add('d-none');

                searchResultsContainerRef.innerHTML = '';


                const resultsToShow = searchResults.slice(0, 10);

                resultsToShow.forEach(result => {
                    const newMovieCard = document.createElement('div');
                    newMovieCard.classList.add('newMovieContainer');

                    const title = document.createElement('h3');
                    title.textContent = result.Title;

                    const year = document.createElement('p');
                    year.textContent = `Year: ${result.Year}`;

                    const type = document.createElement('p');
                    type.textContent = `Type: ${result.Type}`;

                    newMovieCard.appendChild(title);
                    newMovieCard.appendChild(year);
                    newMovieCard.appendChild(type);

                    searchResultsContainerRef.appendChild(newMovieCard);
                });
            }
        } catch (error) {
            console.error('Fel vid hantering av sökresultat:', error);
        }
    }
}


