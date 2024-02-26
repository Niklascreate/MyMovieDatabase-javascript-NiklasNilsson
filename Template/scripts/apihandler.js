//ANVÄNDS INTE


// Funktion för att hämta alla filmer från API:et
async function fetchAllMovies() {
    try {
        const response = await fetch('https://santosnr6.github.io/Data/movies.json');

        if (!response.ok) {
            throw new Error('');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
}


async function fetchSearchInput(query) {
    try {
        const response = await fetch(`http://www.omdbapi.com/?apikey=dd29a2&s=${query}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Fel vid hämtning av sökresultat:', error);
    }
}

//OMDBAPI http://www.omdbapi.com/?apikey=dd29a2&

//api för bred sökning http://www.omdbapi.com/?apikey=dd29a2&s=[söksträng]

//api för specifik sökning http://www.omdbapi.com/?apikey=[yourkey]&plot=full&i=[imdb-ID]