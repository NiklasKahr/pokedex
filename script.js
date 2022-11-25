let pokemons = [];
let currentPokemon;
let isAmerican;


async function init() {
    await fillArray();
    renderContent();
}


async function fillArray() {
    for (let i = 0; i < 30; i++) { // max of 905
        url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`; //152
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
        <div onclick="renderCard(${i})" id="card${i}" class="background-${evaluateType(pokemon)} content-card background-lightgray px-2 py-3 m-2 shadow-sm">
            <div class="text-align-center">
                <h5 id="content-name${i}" class="mb-n0_2">${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h5>
                <span id="content-id${i}">#${pokemon['id']}</span>
            </div>
            <img id="content-sprite${i}" class="content-sprite" src="${pokemon['sprites']['other']['official-artwork']['front_default']}" 
            alt="${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}">
        </div>
        `;
        console.log('#' + pokemon['id'], pokemon);
    }
}


//if type0 is normal and type1 exists, color of type1 gets added
function evaluateType(pokemon) {

    if (type0EqualsNormal(pokemon) && hasType1(pokemon)) {
        let type1 = pokemon['types'][1]['type']['name'];
        return type1;
    } else {
        let type0 = pokemon['types'][0]['type']['name'];
        return type0;
    }
}


function renderCard(i) {
    let pokemon = pokemons[i];
    let selectedCard = document.getElementById('selected-card');

    renderCredentials(pokemon);
    renderMoves(pokemon);
    renderProperties(pokemon);
    replaceColor(selectedCard, 'background', pokemon);

    document.getElementById("unit-button").onclick = function () { convertUnits(i); };
    convertToInternational(pokemon); //maybe do something about this

    document.getElementById('selected-card').classList.remove('d-none');
}


function replaceColor(element, colorProperty, pokemon) {
    let currentColor = Array.from(element.classList)[0];
    element.classList.replace(currentColor, `${colorProperty}-` + evaluateType(pokemon));
}


function renderCredentials(pokemon) {
    document.getElementById('name').innerHTML = pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1);
    document.getElementById('id').innerHTML = '#' + pokemon['id'];
    document.getElementById('sprite').src = pokemon['sprites']['other']['official-artwork']['front_default'];
}


function renderMoves(pokemon) {
    let move0Name = pokemon['moves'][0]['move']['name'];
    let move0 = document.getElementById('move0');

    move0.innerHTML = move0Name.charAt(0).toUpperCase() + move0Name.slice(1);
    replaceColor(move0, 'background-move', pokemon);

    renderMoves1To3(pokemon);
}


function renderMoves1To3(pokemon) {
    if (moveUndefined(pokemon, 1)) { // at ln ...
        document.getElementById('move1').classList.add('d-none');
    } else {
        let move1Name = pokemon['moves'][1]['move']['name'];
        let move1 = document.getElementById('move1');

        move1.innerHTML = move1Name.charAt(0).toUpperCase() + move1Name.slice(1);
        replaceColor(move1, 'background-move', pokemon);

        document.getElementById('move1').classList.remove('d-none');
    }

    if (moveUndefined(pokemon, 2)) { // at ln ...
        document.getElementById('move2').classList.add('d-none');
    } else {
        let move2Name = pokemon['moves'][2]['move']['name'];
        let move2 = document.getElementById('move2');

        move2.innerHTML = move2Name.charAt(0).toUpperCase() + move2Name.slice(1);
        replaceColor(move2, 'background-move', pokemon);

        document.getElementById('move2').classList.remove('d-none');
    }

    if (moveUndefined(pokemon, 3)) { // at ln ...
        document.getElementById('move3').classList.add('d-none');
    } else {
        let move3Name = pokemon['moves'][3]['move']['name'];
        let move3 = document.getElementById('move3');

        move3.innerHTML = move3Name.charAt(0).toUpperCase() + move3Name.slice(1);
        replaceColor(move3, 'background-move', pokemon);

        document.getElementById('move3').classList.remove('d-none');
    }
}


function renderProperties(pokemon) {
    let type = document.getElementById('type');
    let weight = document.getElementById('weight');
    let height = document.getElementById('height');

    type.innerHTML =
        pokemon['types'][0]['type']['name'].charAt(0).toUpperCase() + pokemon['types'][0]['type']['name'].slice(1);
    weight.innerHTML =
        (pokemon['weight'] / 10).toFixed(1).replace('.', ',') + '<span class="font-14px ms-0_05">kg</span>';
    height.innerHTML =
        (pokemon['height'] / 10).toFixed(2).replace('.', ',') + '<span class="font-14px ms-0_05">m</span>';
}


// conditional functions
function type0EqualsNormal(pokemon) {
    return pokemon['types'][0]['type']['name'] == 'normal';
}


function hasType1(pokemon) {
    return pokemon['types'][1];
}


function moveUndefined(pokemon, moveNumber) {
    return pokemon['moves'][moveNumber] == undefined;
}


// convert functions
function convertUnits(i) {
    let pokemon = pokemons[i]
    if (isAmerican) {
        convertToInternational(pokemon);
    } else {
        convertToAmerican();
    }
}


function convertToInternational(pokemon) {
    document.getElementById('weight').innerHTML = (pokemon['weight'] / 10).toFixed(1).replace('.', ',') + '<span class="font-14px ms-0_05">kg</span>';
    document.getElementById('height').innerHTML = (pokemon['height'] / 10).toFixed(2).replace('.', ',') + '<span class="font-14px ms-0_05">m</span>';

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
/*async function searchCards() {
    let search = document.getElementById('search').value.toLowerCase();

    console.log(search);
    document.getElementById('content').innerHTML = '';

    if (search == '') {
        renderContent();
    }

    for (let i = 1; i < 51; i++) {
        let pokemon = pokemons[i];
        if (pokemon['name'].includes(search) || pokemon['id'].toString().includes(search)) {
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

        evaluateType(pokemon, `card${i}`);
        console.log(pokemon['id'], pokemon['types']);
    }
}*/


//parameters explained: pokemon sets color, cardId determines card 
/*function addBackgroundColor(pokemon, cardId) {
    let type = evaluateType(pokemon);
    let card = document.getElementById(cardId);

    switch (type) {
        case 'grass':
            card.classList.add('background-grass');
            break;
        case 'poison':
            card.classList.add('background-poison');
            break;
        case 'fire':
            card.classList.add('background-fire');
            break;
        case 'flying':
            card.classList.add('background-flying');
            break;
        case 'water':
            card.classList.add('background-water');
            break;
        case 'bug':
            card.classList.add('background-bug');
            break;
        case 'normal':
            card.classList.add('background-normal');
            break;
        case 'electric':
            card.classList.add('background-electric');
            break;
        case 'ground':
            card.classList.add('background-ground');
            break;
        case 'fairy':
            card.classList.add('background-fairy');
            break;
        case 'fighting':
            card.classList.add('background-fighting');
            break;
        case 'psychic':
            card.classList.add('background-psychic');
            break;
        case 'rock':
            card.classList.add('background-rock');
            break;
        case 'steel':
            card.classList.add('background-steel');
            break;
        case 'ice':
            card.classList.add('background-ice');
            break;
        case 'ghost':
            card.classList.add('background-ghost');
            break;
        case 'dragon':
            card.classList.add('background-dragon');
            break;
        case 'dark':
            card.classList.add('background-dark');
            break;
        default:
            console.log('Unknown type: ', type)
            break;
    }
}*/