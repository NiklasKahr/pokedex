let pokemons = [];
let currentPokemon;
let isAmerican;


async function init() {
    await fillArray();
    renderContent();
}


async function fillArray() {
    for (let i = 0; i < 30; i++) { // max of 905
        const url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`; //152
        let response = await fetch(url);
        currentPokemon = await response.json();

        pokemons.push(currentPokemon);
    }
}

// render functions
function renderContent() {
    document.getElementById('content').innerHTML = '';

    for (let i = 0; i < pokemons.length; i++) {
        const pokemon = pokemons[i];
        document.getElementById('content').innerHTML += `
        <div onclick="renderCard(${i})" id="card${i}" class="content-card background-${evaluateType(pokemon)} px-2 py-3 m-cards shadow-sm">
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

function evaluateType(pokemon) {
    //if type0 is normal and type1 exists, return type1
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
    renderButtons(i, pokemon);

    document.body.style.overflowY = "hidden";
    document.body.style.paddingRight = '12px';
}


function renderButtons(i, pokemon) {
    document.getElementById('previous-button').onclick = function () { renderCard(i - 1); };
    document.getElementById('next-button').onclick = function () { renderCard(i + 1); };

    let unitButton = document.getElementById('unit-button');
    unitButton.onclick = function () { convertUnits(i); };
    replaceColor(unitButton, 'background', pokemon);
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
    if (moveUndefined(pokemon, 4)) {
        let move1 = document.getElementById('move1');
        move1.innerHTML = '';

        currentColor = searchForColorProperty(createArray(move1), 'background');
        // use of replaceColor() not possible since it expects a pokemon and "lightgray" is not one
        move1.classList.replace(currentColor, 'background-lightgray');
    } else {
        // take move at index 4 (instead of 1) as moves are sorted by similartiy of their names
        let move1Name = pokemon['moves'][4]['move']['name'];
        let move1 = document.getElementById('move1');

        move1.innerHTML = move1Name.charAt(0).toUpperCase() + move1Name.slice(1);
        replaceColor(move1, 'background-move', pokemon);
    }

    if (moveUndefined(pokemon, 10)) {
        let move2 = document.getElementById('move2');
        move2.innerHTML = '';

        currentColor = searchForColorProperty(createArray(move2), 'background');
        move2.classList.replace(currentColor, 'background-lightgray');
    } else {
        let move2Name = pokemon['moves'][10]['move']['name'];
        let move2 = document.getElementById('move2');

        move2.innerHTML = move2Name.charAt(0).toUpperCase() + move2Name.slice(1);
        replaceColor(move2, 'background-move', pokemon);
    }

    if (moveUndefined(pokemon, 15)) {
        let move3 = document.getElementById('move3');
        move3.innerHTML = '';

        currentColor = searchForColorProperty(createArray(move3), 'background');
        move3.classList.replace(currentColor, 'background-lightgray');
    } else {
        let move3Name = pokemon['moves'][15]['move']['name'];

        move3.innerHTML = move3Name.charAt(0).toUpperCase() + move3Name.slice(1);
        replaceColor(move3, 'background-move', pokemon);
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


function searchCards() {
    let content = document.getElementById('content');
    let search = document.getElementById('search').value.toLowerCase();
    console.log(search);

    /*content.style.minHeight = 'unset';
    document.querySelector('footer').style.position = 'relative';
    document.querySelector('footer').style.bottom = '0';*/

    if (search == '') {
        renderContent();
        /*content.style.minHeight = '68vh';
        document.querySelector('footer').style.position = 'unset';
        document.querySelector('footer').style.bottom = 'unset';*/
    }

    content.innerHTML = '';
    for (let i = 0; i < pokemons.length; i++) {
        const pokemon = pokemons[i];
        if (pokemon['name'].includes(search) || pokemon['id'].toString().includes(search)) {
            content.innerHTML += `
            <div onclick="renderCard(${i})" id="card${i}" class="content-card background-${evaluateType(pokemon)} px-2 py-3 m-cards shadow-sm">
            <div class="text-align-center">
                <h5 id="content-name${i}" class="mb-n0_15">${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h5>
                <span id="content-id${i}">#${pokemon['id']}</span>
            </div>
            <img id="content-sprite${i}" class="content-sprite" src="${pokemon['sprites']['other']['official-artwork']['front_default']}" 
            alt="${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}">
        </div>
            `;
        }
    }
}


// search function
/*
    let input = document.getElementById('search').value;
    search = input.toLowerCase();
    let content = document.getElementById('allPokemon');
    content.innerHTML = '';

    for (let i = 0; i < pokemons.length; i++) {
        const pokemonName = allPokemon[i]['name'];
        if (pokemonName.startsWith(search)) {
            currentPokemon = allPokemon[i];
            renderSmallPokemonCard(i);
        }
    }
}*/


// show/hide elements
function showElement(id) {
    document.getElementById(id).classList.remove('d-none');
}


function hideElement(id) {
    document.getElementById(id).classList.add('d-none');
    if (id == 'container-black') {
        document.body.style.overflowY = "unset";
        document.body.style.paddingRight = 'unset';
    }
}


function doNotClose(event) {
    event.stopPropagation();
}

// color functions
function replaceColor(element, colorProperty, pokemon) {
    let arrayOfClasses = createArray(element);
    let currentColor = searchForColorProperty(arrayOfClasses, split(colorProperty));
    element.classList.replace(currentColor, `${colorProperty}-` + evaluateType(pokemon));
}


function createArray(element) {
    return Array.from(element.classList);
}


function split(colorProperty) {
    return colorProperty.split('-')[0];
}


function searchForColorProperty(arrayOfClasses, splitColorProperty) {
    for (let i = 0; i < arrayOfClasses.length; i++) {
        const currentClass = arrayOfClasses[i];

        if (currentClass.includes(splitColorProperty)) {
            return currentClass;
        }
    }
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


/*mobile devices
$('body').bind('touchmove', function(e){e.preventDefault()})
$('body').unbind('touchmove')*/