let currentPokemon;
let isAmerican;

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

    document.getElementById('attacks-text1').innerHTML =
        currentPokemon['abilities'][0]['ability']['name'].charAt(0).toUpperCase() + currentPokemon['abilities'][0]['ability']['name'].slice(1);
    document.getElementById('attacks-text2').innerHTML =
        currentPokemon['abilities'][1]['ability']['name'].charAt(0).toUpperCase() + currentPokemon['abilities'][1]['ability']['name'].slice(1);

    if (currentPokemon['abilities'][2] == undefined) {
        document.getElementById('attacks-text3').classList.add('d-none');
    } else {
        //document.getElementById('attacks-text3').classList.remove('d-none');
        currentPokemon['abilities'][2]['ability']['name'].charAt(0).toUpperCase() + currentPokemon['abilities'][2]['ability']['name'].slice(1);
    }
    if (currentPokemon['abilities'][3] == undefined) {
        document.getElementById('attacks-text4').classList.add('d-none');
    } else {
        //document.getElementById('attacks-text4').classList.remove('d-none');
        currentPokemon['abilities'][3]['ability']['name'].charAt(0).toUpperCase() + currentPokemon['abilities'][3]['ability']['name'].slice(1);
    }


    document.getElementById('type').innerHTML =
        currentPokemon['types'][0]['type']['name'].charAt(0).toUpperCase() + currentPokemon['types'][0]['type']['name'].slice(1);
    document.getElementById('weight').innerHTML = (currentPokemon['weight'] / 10).toFixed(1) + '<span class="font-14px ms-0_05">kg</span>';
    document.getElementById('height').innerHTML = (currentPokemon['height'] / 10).toFixed(2) + '<span class="font-14px ms-0_05">m</span>';
}


function convertUnits() {
    if (isAmerican) {
        convertToInternational();
    } else {
        convertToAmerican();
    }
}


function convertToInternational() {
    document.getElementById('weight').innerHTML = (currentPokemon['weight'] / 10).toFixed(1) + '<span class="font-14px ms-0_05">kg</span>';
    document.getElementById('height').innerHTML = (currentPokemon['height'] / 10).toFixed(2) + '<span class="font-14px ms-0_05">m</span>';

    document.getElementById('unit-button').innerHTML = 'lb/ft';
    isAmerican = false;
}


function convertToAmerican() {
    let weightInKg = document.getElementById('weight').childNodes[0]['data'];
    let heightInM = document.getElementById('height').childNodes[0]['data'];
    document.getElementById('weight').innerHTML = (weightInKg * 2.205).toFixed(1) + '<span class="font-14px ms-0_05">lb</span>';
    document.getElementById('height').innerHTML = (heightInM * 3.281).toFixed(2) + '<span class="font-14px ms-0_05">ft</span>';

    document.getElementById('unit-button').innerHTML = 'kg/m';
    isAmerican = true;
}