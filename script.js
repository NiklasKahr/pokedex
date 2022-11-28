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
                <h5 id="content-name${i}" class="mb-n0_15">${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h5>
                <span id="content-id${i}">#${pokemon['id']}</span>
            </div>
            <img id="content-sprite${i}" class="content-sprite" src="${pokemon['sprites']['other']['official-artwork']['front_default']}" 
            alt="${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}">
        </div>
        `;
        console.log('#' + pokemon['id'], pokemon);
    }
}

//if type0 is normal and type1 exists, return type1
function evaluateType(pokemon) {

    if (type0EqualsNormal(pokemon) && has2Types(pokemon)) {
        let type1 = pokemon['types'][1]['type']['name'];
        return type1;
    } else {
        let type0 = pokemon['types'][0]['type']['name'];
        return type0;
    }
}


function renderCard(i) {
    let pokemon = pokemons[i];
    showElement('container-black');

    renderCredentials(pokemon);
    renderMoves(pokemon);
    renderType(pokemon);
    replaceColor(document.getElementById('selected-card'), 'background', pokemon);
    if (isAmerican) { convertToAmerican(pokemon); } else { convertToInternational(pokemon); }

    document.getElementById("unit-button").onclick = function () { convertUnits(i); };
    document.body.style.overflowY = "hidden";
    document.getElementById('content').style.paddingRight = '15px';
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
    if (moveUndefined(pokemon, 1)) {
        hideElement('move1');
    } else {
        let move1Name = pokemon['moves'][1]['move']['name'];
        let move1 = document.getElementById('move1');

        move1.innerHTML = move1Name.charAt(0).toUpperCase() + move1Name.slice(1);
        replaceColor(move1, 'background-move', pokemon);

        showElement('move1');
    }

    if (moveUndefined(pokemon, 2)) {
        hideElement('move2');
    } else {
        let move2Name = pokemon['moves'][2]['move']['name'];
        let move2 = document.getElementById('move2');

        move2.innerHTML = move2Name.charAt(0).toUpperCase() + move2Name.slice(1);
        replaceColor(move2, 'background-move', pokemon);

        showElement('move2');
    }

    if (moveUndefined(pokemon, 3)) {
        hideElement('move3');
    } else {
        let move3Name = pokemon['moves'][3]['move']['name'];
        let move3 = document.getElementById('move3');

        move3.innerHTML = move3Name.charAt(0).toUpperCase() + move3Name.slice(1);
        replaceColor(move3, 'background-move', pokemon);

        showElement('move3');
    }
}


function renderType(pokemon) {
    let type = document.getElementById('type');

    if (has2Types(pokemon)) {
        type.innerHTML =
            pokemon['types'][0]['type']['name'].charAt(0).toUpperCase() +
            pokemon['types'][0]['type']['name'].slice(1) + '<br>' +
            pokemon['types'][1]['type']['name'].charAt(0).toUpperCase() +
            pokemon['types'][1]['type']['name'].slice(1);

        adjustPropertyElements('add', pokemon);
    } else {
        type.innerHTML =
            evaluateType(pokemon).charAt(0).toUpperCase() + evaluateType(pokemon).slice(1);

        adjustPropertyElements('remove', pokemon);
    }
}


function adjustPropertyElements(action, pokemon) {
    let typeElementHeight = type.getBoundingClientRect()['height'] + 'px';

    weight.style.height = typeElementHeight;
    height.style.height = typeElementHeight;

    document.getElementById('kg-lb').classList[action]('unit-alignment');
    document.getElementById('m-ft').classList[action]('unit-alignment');

    if (has2Types(pokemon)) {
        document.getElementById('weight-container').style.alignItems = 'center';
        document.getElementById('height-container').style.alignItems = 'center';
        document.getElementById('kg-lb').style.lineHeight = 'unset';
        document.getElementById('m-ft').style.lineHeight = 'unset';
    } else {
        document.getElementById('weight-container').style.alignItems = 'flex-end';
        document.getElementById('height-container').style.alignItems = 'flex-end';
        document.getElementById('kg-lb').style.lineHeight = 1.2;
        document.getElementById('m-ft').style.lineHeight = 1.2;
    }
}


function showElement(id) {
    document.getElementById(id).classList.remove('d-none');
}


function hideElement(id) {
    document.getElementById(id).classList.add('d-none');
    if (id == 'container-black') {
        document.body.style.overflowY = "unset";
        document.getElementById('content').style.paddingRight = 'unset';
    }
}


function doNotClose(event) {
    event.stopPropagation();
}


// conditional
function type0EqualsNormal(pokemon) {
    return pokemon['types'][0]['type']['name'] == 'normal';
}


function has2Types(pokemon) {
    return pokemon['types'][1];
}


function moveUndefined(pokemon, moveNumber) {
    return pokemon['moves'][moveNumber] == undefined;
}

// convert
function convertUnits(i) {
    let pokemon = pokemons[i]

    if (isAmerican) {
        convertToInternational(pokemon);
        isAmerican = false;
    } else {
        convertToAmerican(pokemon);
        isAmerican = true;
    }
}


function convertToInternational(pokemon) {
    document.getElementById('weight').innerHTML = (pokemon['weight'] / 10).toFixed(1).replace('.', ',');
    document.getElementById('kg-lb').innerHTML = 'kg';

    document.getElementById('height').innerHTML = (pokemon['height'] / 10).toFixed(2).replace('.', ',');
    document.getElementById('m-ft').innerHTML = 'm';

    document.getElementById('unit-button').innerHTML = 'lb/ft';
}


function convertToAmerican(pokemon) {
    let weight = document.getElementById('weight');
    let height = document.getElementById('height');

    weight.innerHTML = ((pokemon['weight'] / 10) * 2.205).toFixed(1);
    document.getElementById('kg-lb').innerHTML = 'lb';

    height.innerHTML = ((pokemon['height'] / 10) * 3.281).toFixed(2);
    document.getElementById('m-ft').innerHTML = 'ft';

    document.getElementById('unit-button').innerHTML = 'kg/m';
}


//search function
/*
    let input = document.getElementById('search').value;
    search = input.toLowerCase();
    let content = document.getElementById('allPokemon');
    content.innerHTML = '';

    for (let i = 0; i < allPokemon.length; i++) {
        const pokemonName = allPokemon[i]['name'];
        if (pokemonName.startsWith(search)) {
            currentPokemon = allPokemon[i];
            renderSmallPokemonCard(i);
        }
    }
}
*/

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
                <h5 id="content-name${i}" class="mb-n0_15">${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h5>
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

/*mobile devices
$('body').bind('touchmove', function(e){e.preventDefault()})
$('body').unbind('touchmove')*/