let pokemons = [];
let currentPokemon;
let isAmerican;


function init() {
    /*let url = 'https://pokeapi.co/api/v2/pokemon/1/';
    let response = await fetch(url);
    currentPokemon = await response.json();

    console.log('Loaded Pokémon:', currentPokemon)*/

    //renderCard();
    fillArray();
    renderContent();
}


async function fillArray() {
    for (let i = 0; i < 50; i++) {
        url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`;
        let response = await fetch(url);
        currentPokemon = await response.json();

        pokemons.push(currentPokemon);
    }
}


// render functions

function renderContent() {
    document.getElementById('content').innerHTML = '';

    for (let i = 0; i < pokemons.length; i++) {
        let pokemon = pokemons[i];
        document.getElementById('content').innerHTML += `
        <div onclick="renderCard()" id="card${i}" class="content-card px-2 py-3 m-2">
            <div class="text-align-center">
                <h5 id="content-name${i}" class="mb-n0_2">${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h5>
                <span id="content-id${i}">#${pokemon['id']}</span>
            </div>
            <img id="content-sprite${i}" class="content-sprite" src="${pokemon['sprites']['other']['official-artwork']['front_default']}" 
            alt="${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}">
        </div>
        `;

    }
}

/*async function renderContent() {
    document.getElementById('content').innerHTML = '';

    for (let i = 0; i < 51; i++) {
        let pokemon = pokemons[i];
        document.getElementById('content').innerHTML += `
        <div onclick="renderCard()" id="card${i}" class="content-card px-2 py-3 m-2">
            <div class="text-align-center">
                <h5 id="content-name${i}" class="mb-n0_2">${currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1)}</h5>
                <span id="content-id${i}">#${currentPokemon['id']}</span>
            </div>
            <img id="content-sprite${i}" class="content-sprite" src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}" 
            alt="${currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1)}">
        </div>
        `;

        url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`;
        let response = await fetch(url);
        currentPokemon = await response.json();
    }
}*/


function renderCard() {
    renderCredentials();
    renderAttacks();
    renderProperties();
    document.getElementById('selected-card').classList.remove('d-none');
}


function renderCredentials() {
    document.getElementById('name').innerHTML = currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1);
    document.getElementById('id').innerHTML = '#' + currentPokemon['id'];
    document.getElementById('sprite').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];

}


function renderAttacks() {
    let attack0Name = currentPokemon['abilities'][0]['ability']['name'];
    let attack1Name = currentPokemon['abilities'][1]['ability']['name'];

    document.getElementById('attacks-text0').innerHTML = attack0Name.charAt(0).toUpperCase() + attack0Name.slice(1);
    document.getElementById('attacks-text1').innerHTML = attack1Name.charAt(0).toUpperCase() + attack1Name.slice(1);

    renderAttacks3And4();
}


function renderAttacks3And4() {
    if (attack2Undefined()) { // at ln ...
        document.getElementById('attacks-text2').classList.add('d-none');
    } else {
        let attack2Name = currentPokemon['abilities'][2]['ability']['name'];
        //document.getElementById('attacks-text2').classList.remove('d-none');
        document.getElementById('attacks-text2').innerHTML = attack2Name.charAt(0).toUpperCase() + attack2Name.slice(1);
    }

    if (attack3Undefined()) { // at ln ...
        document.getElementById('attacks-text3').classList.add('d-none');
    } else {
        let attack3Name = currentPokemon['abilities'][3]['ability']['name'];
        //document.getElementById('attacks-text3').classList.remove('d-none');
        document.getElementById('attacks-text3').innerHTML = attack3Name.charAt(0).toUpperCase() + attack3Name.slice(1);
    }
}


function renderProperties() {
    let type = document.getElementById('type');
    let weight = document.getElementById('weight');
    let height = document.getElementById('height');

    type.innerHTML =
        currentPokemon['types'][0]['type']['name'].charAt(0).toUpperCase() + currentPokemon['types'][0]['type']['name'].slice(1);
    weight.innerHTML =
        (currentPokemon['weight'] / 10).toFixed(1).replace('.', ',') + '<span class="font-14px ms-0_05">kg</span>';
    height.innerHTML =
        (currentPokemon['height'] / 10).toFixed(2).replace('.', ',') + '<span class="font-14px ms-0_05">m</span>';
}


// conditional functions
function attack2Undefined() {
    return currentPokemon['abilities'][2] == undefined;
}


function attack3Undefined() {
    return currentPokemon['abilities'][3] == undefined;
}


// convert functions
function convertUnits() {
    if (isAmerican) {
        convertToInternational();
    } else {
        convertToAmerican();
    }
}


function convertToInternational() {
    document.getElementById('weight').innerHTML = (currentPokemon['weight'] / 10).toFixed(1).replace('.', ',') + '<span class="font-14px ms-0_05">kg</span>';
    document.getElementById('height').innerHTML = (currentPokemon['height'] / 10).toFixed(2).replace('.', ',') + '<span class="font-14px ms-0_05">m</span>';

    document.getElementById('unit-button').innerHTML = 'lb/ft';
    isAmerican = false;
}


function convertToAmerican() {
    let weight = document.getElementById('weight');
    let height = document.getElementById('height');
    let weightInKg = weight.childNodes[0]['data'].replace(',', '.');
    let heightInM = height.childNodes[0]['data'].replace(',', '.');

    weight.innerHTML = (weightInKg * 2.205).toFixed(1) + '<span class="font-14px ms-0_05">lb</span>';
    height.innerHTML = (heightInM * 3.281).toFixed(2) + '<span class="font-14px ms-0_05">ft</span>';

    document.getElementById('unit-button').innerHTML = 'kg/m';
    isAmerican = true;
}


//search function
async function searchCards() {
    let search = document.getElementById('search').value.toLowerCase();

    console.log(search);
    document.getElementById('content').innerHTML = '';

    if (search == '') {
        url = `https://pokeapi.co/api/v2/pokemon/1/`;
        let response = await fetch(url);
        currentPokemon = await response.json();
    }

    for (let i = 1; i < 51; i++) {
        if (currentPokemon['name'].includes(search) || currentPokemon['id'].toString().includes(search)) {
            document.getElementById('content').innerHTML += `
                <div onclick="renderCard()" id="card${i}" class="content-card px-2 py-3 m-2">
            <div class="text-align-center">
                <h5 id="content-name${i}" class="mb-n0_2">${currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1)}</h5>
                <span id="content-id${i}">#${currentPokemon['id']}</span>
            </div>
                <img id="content-sprite${i}" class="content-sprite" src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}" 
                alt="${currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1)}">
            </div>
            `;
        }

        url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`;
        let response = await fetch(url);
        currentPokemon = await response.json();
    }
}