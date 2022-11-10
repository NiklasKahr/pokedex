let currentPokemon;

async function init() {
    let url = 'https://pokeapi.co/api/v2/pokemon/cyndaquil';
    let response = await fetch(url);
    currentPokemon = await response.json();

    console.log('Loaded Pokémon:', currentPokemon)

    renderCard();
}


function renderCard() {
    document.getElementById('name').innerHTML =
        currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1);
    document.getElementById('id').innerHTML = '#' + currentPokemon['id'];

    document.getElementById('picture').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById('info-text').innerHTML = 'Text';

    document.getElementById('type').innerHTML =
        currentPokemon['types'][0]['type']['name'].charAt(0).toUpperCase() + currentPokemon['types'][0]['type']['name'].slice(1);
    document.getElementById('weight').innerHTML = (currentPokemon['weight'] / 10).toFixed(1) + '<span class="font-14px">kg</span>';
    document.getElementById('height').innerHTML = (currentPokemon['height'] / 10).toFixed(2) + '<span class="font-14px">m</span>';
}