let pokemons = [];
let currentPokemon;
let isAmerican;
let amountOfPokemon = 0;
let offset;


async function init() {
    await fillArray();
    renderContent();
}


async function fillArray() {
    offset = amountOfPokemon;
    amountOfPokemon += 30;
    for (let i = offset; i < amountOfPokemon; i++) { //max of 905
        const url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`; //152
        let response = await fetch(url);
        currentPokemon = await response.json();

        pokemons.push(currentPokemon);
    }
}


//render functions
function renderContent() {
    for (let i = offset; i < pokemons.length; i++) {
        const pokemon = pokemons[i];
        document.getElementById('content').innerHTML += `
        <div onclick="renderCard(${i})" id="card${i}" class="content-card background-${evaluateType(pokemon)} filter px-2 py-3 m-cards shadow-sm">
            <div class="text-align-center">
                <h5 class="content-name mb-0">${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h5>
                <span class="content-id">#${pokemon['id']}</span>
            </div>
            <img class="content-sprite" src="${pokemon['sprites']['other']['official-artwork']['front_default']}" 
            alt="${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}">
        </div>
        `;
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
}


function renderButtons(i, pokemon) {
    let unitButton = document.getElementById('unit-btn');

    renderPrevAndNxtButton(i, pokemon);

    unitButton.onclick = function () { convertUnits(i); };
    replaceColor(unitButton, 'color', pokemon);
}


function renderPrevAndNxtButton(i, pokemon) {
    let previousButton = document.getElementById('previous-btn');
    let nextButton = document.getElementById('next-btn');

    previousButton.onclick = function () {
        if (pokemon != pokemons[0]) {
            renderCard(i - 1);
        }
    };
    replaceColor(previousButton, 'background-move', pokemon);

    nextButton.onclick = function () {
        if (pokemon != pokemon[905] && pokemons[i + 1] != undefined) {
            renderCard(i + 1);
        }
    };
    replaceColor(nextButton, 'background-move', pokemon);
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

    renderMove1To3(pokemon, 'move1', 4)
    renderMove1To3(pokemon, 'move2', 10)
    renderMove1To3(pokemon, 'move3', 15)
}


function renderMove1To3(pokemon, moveNumber, moveIndex) {
    if (moveUndefined(pokemon, moveIndex)) {
        let move = document.getElementById(`${moveNumber}`);
        move.innerHTML = '';

        currentColor = searchForColorProperty(createArrayOfClass(move), 'background');
        //use of replaceColor() not possible since it expects a pokemon and "lightgray" is not one
        move.classList.replace(currentColor, 'background-lightgray');
    } else {
        //take moves at indexes [4, 10, 15] (instead of [1, 2, 3]) as moves are sorted by similartiy of their names
        let moveName = pokemon['moves'][moveIndex]['move']['name'];
        let move = document.getElementById(`${moveNumber}`);

        move.innerHTML = moveName.charAt(0).toUpperCase() + moveName.slice(1);
        replaceColor(move, 'background-move', pokemon);
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
    document.getElementById('kg-lb').classList[action]('unit-alignment');
    document.getElementById('m-ft').classList[action]('unit-alignment');

    adjustStyle(pokemon);

    let typeElementHeight = type.getBoundingClientRect()['height'] + 'px';
    weight.style.height = typeElementHeight;
    height.style.height = typeElementHeight;

    adjustPropertyElementsMobile();
}


function adjustStyle(pokemon) {
    if (has2Types(pokemon)) {
        document.getElementById('weight-container').style.alignItems = 'center';
        document.getElementById('height-container').style.alignItems = 'center';
        document.getElementById('type').style.lineHeight = 1.1;
        document.getElementById('kg-lb').style.lineHeight = 'unset';
        document.getElementById('m-ft').style.lineHeight = 'unset';
    } else {
        document.getElementById('weight-container').style.alignItems = 'flex-end';
        document.getElementById('height-container').style.alignItems = 'flex-end';
        document.getElementById('type').style.lineHeight = 1.2;
        document.getElementById('kg-lb').style.lineHeight = 'unset';
        document.getElementById('m-ft').style.lineHeight = 'unset';
    }
}


function adjustPropertyElementsMobile() {
    if (has2Types(extractPokemon()) && window.innerWidth <= 465) {
        document.getElementById('kg-lb').style.lineHeight = 'unset';
        document.getElementById('m-ft').style.lineHeight = 'unset';
    } else if (window.innerWidth <= 465) {
        document.getElementById('kg-lb').style.lineHeight = '1.2';
        document.getElementById('m-ft').style.lineHeight = '1.2';
    }
}

//search functions
function searchCards() {
    let content = document.getElementById('content');
    let search = document.getElementById('search').value.toLowerCase().replace(/ +/g, "");

    if (search == '') {
        renderContent();
    }

    content.innerHTML = '';
    renderSearchedCards(content, search);
}


function renderSearchedCards(content, search) {
    for (let i = 0; i < pokemons.length; i++) {
        const pokemon = pokemons[i];
        if (pokemon['name'].includes(search) || pokemon['id'].toString().includes(search)) {
            content.innerHTML += `
            <div onclick="renderCard(${i})" id="card${i}" class="content-card background-${evaluateType(pokemon)} filter px-2 py-3 m-cards shadow-sm">
                <div class="text-align-center">
                    <h5 class="content-name mb-0">${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h5>
                    <span class="content-id">#${pokemon['id']}</span>
                </div>
                <img class="content-sprite" src="${pokemon['sprites']['other']['official-artwork']['front_default']}" 
                alt="${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}">
            </div>
            `;
        }
    }
}

//show/hide functions
function showElement(id) {
    document.getElementById(id).classList.remove('d-none');
}


function hideElement(id) {
    document.getElementById(id).classList.add('d-none');
    if (id == 'container-black') {
        document.body.style.overflowY = "overlay";
    }
}


function doNotClose(event) {
    event.stopPropagation();
}

//color functions
function replaceColor(element, colorProperty, pokemon) {
    let arrayOfClasses = createArrayOfClass(element);
    let currentColor = searchForColorProperty(arrayOfClasses, split(colorProperty));
    element.classList.replace(currentColor, `${colorProperty}-` + evaluateType(pokemon));
}


function searchForColorProperty(arrayOfClasses, splitColorProperty) {
    for (let i = 0; i < arrayOfClasses.length; i++) {
        const currentClass = arrayOfClasses[i];

        if (currentClass.includes(splitColorProperty)) {
            return currentClass;
        }
    }
}


function split(colorProperty) {
    return colorProperty.split('-')[0];
}

//conditionals
function type0EqualsNormal(pokemon) {
    return pokemon['types'][0]['type']['name'] == 'normal';
}


function has2Types(pokemon) {
    return pokemon['types'][1];
}


function moveUndefined(pokemon, moveIndex) {
    return pokemon['moves'][moveIndex] == undefined;
}


function cardIsVisible() {
    return !document.getElementById('container-black').classList.contains('d-none');
}

//parameter functions
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


function extractPokemon() {
    let i = document.getElementById('id').textContent.replace('#', '') - 1;
    return pokemons[i];
}

//conversion functions
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

    document.getElementById('unit-btn').innerHTML = 'lb/ft';
}


function convertToAmerican(pokemon) {
    let weight = document.getElementById('weight');
    let height = document.getElementById('height');

    weight.innerHTML = ((pokemon['weight'] / 10) * 2.205).toFixed(1);
    document.getElementById('kg-lb').innerHTML = 'lb';

    height.innerHTML = ((pokemon['height'] / 10) * 3.281).toFixed(2);
    document.getElementById('m-ft').innerHTML = 'ft';

    document.getElementById('unit-btn').innerHTML = 'kg/m';
}

//other
function createArrayOfClass(element) {
    return Array.from(element.classList);
}