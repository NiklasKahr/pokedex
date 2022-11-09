let currentPokemon;

async function init() {
    let url = 'https://pokeapi.co/api/v2/pokemon/cyndaquil';
    let response = await fetch(url);
    currentPokemon = await response.json();

    console.log('Loaded Pokémon:', currentPokemon)

    renderInfo();
}


function renderInfo() {
    document.getElementById('name').innerHTML = currentPokemon['name'];
    document.getElementById('picture').src = currentPokemon['sprites']['front_default'];
}