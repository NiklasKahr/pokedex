//purpose: main script of the project
let pokemons = [];
let currentPokemon;
let isAmerican;
let amountOfPokemon = 0;
let offset;


async function init() { //start of the program
    await fillArray();
    renderContent();
}


async function fillArray() { //load 40 pokemon at a time
    offset = amountOfPokemon;
    amountOfPokemon += 40;
    for (let i = offset; i < amountOfPokemon; i++) { //max of 905
        const url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`; //152
        let response = await fetch(url);
        currentPokemon = await response.json();

        pokemons.push(currentPokemon);
    }
}


//render functions
function renderContent() { //render array of pokemon
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


function renderCard(i) { //event listener for each pokemon card
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
    renderPrevButton(i, pokemon);
    renderNxtButton(i, pokemon);
    renderUnitButton(i, pokemon);
}


function renderUnitButton(i, pokemon) {
    let unitButton = document.getElementById('unit-btn');
    //execute renderButtons() again to update the button
    unitButton.onclick = function () { convertUnits(i); renderButtons(i, pokemon); };
    replaceColor(unitButton, 'color', pokemon);
    unitButton.title = 'Convert to ' + (isAmerican ? 'International' : 'American') + ' Units';
}


function renderPrevButton(i, pokemon) {
    let previousButton = document.getElementById('previous-btn');

    if (pokemon != pokemons[0]) { //if pokemon is not the first one
        previousButton.onclick = function () { renderCard(i - 1); }
        previousButton.title = 'Show ' + pokemons[i - 1]['name'].charAt(0).toUpperCase() + pokemons[i - 1]['name'].slice(1);
    } else {
        previousButton.onclick = '';
        previousButton.title = '';
    }
    replaceColor(previousButton, 'background-move', pokemon);
}


function renderNxtButton(i, pokemon) {
    let nextButton = document.getElementById('next-btn');

    if (pokemon != pokemon[905] && pokemons[i + 1] != undefined) { //if pokemon is not the last one
        nextButton.onclick = function () { renderCard(i + 1); }
        nextButton.title = 'Show ' + pokemons[i + 1]['name'].charAt(0).toUpperCase() + pokemons[i + 1]['name'].slice(1);
    } else {
        //await init(), then execute renderNxtButton() again to update the button
        nextButton.onclick = async function () { await init(); renderNxtButton(i, pokemon); }
        nextButton.title = 'Load more Pokémon';
    }
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
    replaceColor(move0, 'background-move', pokemon); //replace move color with color of pokemon

    renderMove1To3(pokemon, 'move1', 4)
    renderMove1To3(pokemon, 'move2', 10)
    renderMove1To3(pokemon, 'move3', 15)
}


function renderMove1To3(pokemon, moveNumber, moveIndex) {
    if (moveUndefined(pokemon, moveIndex)) {
        let move = document.getElementById(`${moveNumber}`);
        move.innerHTML = ''; //remove text from move

        currentColor = searchForColorProperty(createArrayOfClass(move), 'background'); //get current move color
        //use of replaceColor() not possible since it expects a pokemon and "lightgray" is not one
        move.classList.replace(currentColor, 'background-lightgray'); //replace move color with lightgray
    } else {
        //take moves at indexes [4, 10, 15] (instead of [1, 2, 3]) as moves are sorted by the similartiy of their names
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
        //adjustPropertyElements('add', pokemon);
    } else {
        type.innerHTML =
            evaluateType(pokemon).charAt(0).toUpperCase() + evaluateType(pokemon).slice(1);
        //adjustPropertyElements('remove', pokemon);
    }
    adjustPropertyElements(pokemon);
}

//adjusts the line height of the type element
function adjustPropertyElements(pokemon) {
    if (has2Types(pokemon)) {
        document.getElementById('type').style.lineHeight = 1.1;
        document.getElementById('border-left-white').style.height = '52%';
        document.getElementById('border-right-white').style.height = '52%';

    } else {
        document.getElementById('type').style.lineHeight = 1.2;
        document.getElementById('border-left-white').style.height = '45%';
        document.getElementById('border-right-white').style.height = '45%';
    }
}

//search functions
function searchCards() { //searches for cards with the name or id of the pokemon
    let content = document.getElementById('content');
    let search = document.getElementById('search').value.toLowerCase().replace(/ +/g, "");

    if (search == '') {
        reverseSearch(content);
    } else {
        executeSearch(content, search);
    }
}

//shows all cards again
async function reverseSearch(content) {
    content.innerHTML = '';
    pokemons = [];
    amountOfPokemon = 0;
    await init();
    showButtons();
    document.getElementById('sprite-container').style.justifyContent = 'space-between';
    document.getElementById('load-button').onclick = function () { init(); };
}

//makes preparations and executes the search
function executeSearch(content, search) {
    content.innerHTML = '';
    renderSearchedCards(content, search);
    hideButtons();
    document.getElementById('sprite-container').style.justifyContent = 'center';
    //loads more cards that fulfill the search criteria
    document.getElementById('load-button').onclick = async function () { await fillArray(); executeSearch(content, search); };
}


//renders the cards that match the search
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

//hides the buttons when searching for cards
function hideButtons() {
    document.getElementById('previous-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
}

//shows the buttons when not searching for cards anymore
function showButtons() {
    document.getElementById('previous-btn').style.display = 'flex';
    document.getElementById('next-btn').style.display = 'flex';
}

//prevents the container from closing when clicking inside it
function doNotClose(event) {
    event.stopPropagation();
}

//color functions
function replaceColor(element, colorProperty, pokemon) { //replaces the color of the element
    let arrayOfClasses = createArrayOfClass(element);
    let currentColor = searchForColorProperty(arrayOfClasses, split(colorProperty));
    element.classList.replace(currentColor, `${colorProperty}-` + evaluateType(pokemon));
}

//receives array of classes and returns the class that contains the color property
function searchForColorProperty(arrayOfClasses, splitColorProperty) {
    for (let i = 0; i < arrayOfClasses.length; i++) {
        const currentClass = arrayOfClasses[i];

        if (currentClass.includes(splitColorProperty)) {
            return currentClass;
        }
    }
}

//returns split color property
function split(colorProperty) {
    return colorProperty.split('-')[0];
}

//conditionals
function type0EqualsNormal(pokemon) { //returns true if type0 is normal
    return pokemon['types'][0]['type']['name'] == 'normal';
}

//returns true if type1 exists
function has2Types(pokemon) {
    return pokemon['types'][1];
}

//returns true if the move is undefined
function moveUndefined(pokemon, moveIndex) {
    return pokemon['moves'][moveIndex] == undefined;
}

//returns true if the card is visible
function cardIsVisible() {
    return !document.getElementById('container-black').classList.contains('d-none');
}

//parameter functions
function evaluateType(pokemon) { //returns the type of the pokemon
    if (type0EqualsNormal(pokemon) && has2Types(pokemon)) { //if type0 is normal and type1 exists, return type1
        let type1 = pokemon['types'][1]['type']['name'];
        return type1;
    } else {
        let type0 = pokemon['types'][0]['type']['name'];
        return type0;
    }
}

//returns the id of pokemon based on the card id
function extractPokemon() {
    let i = document.getElementById('id').textContent.replace('#', '') - 1;
    return pokemons[i];
}

//conversion functions
function convertUnits(i) { //converts american units to international units and vice versa
    let pokemon = pokemons[i]
    if (isAmerican) {
        convertToInternational(pokemon);
        isAmerican = false;
    } else {
        convertToAmerican(pokemon);
        isAmerican = true;
    }
}

//converts american units to international units
function convertToInternational(pokemon) {
    document.getElementById('weight').innerHTML = (pokemon['weight'] / 10).toFixed(1).replace('.', ',');
    document.getElementById('kg-lb').innerHTML = 'kg';

    document.getElementById('height').innerHTML = (pokemon['height'] / 10).toFixed(2).replace('.', ',');
    document.getElementById('m-ft').innerHTML = 'm';

    document.getElementById('unit-btn').innerHTML = 'lb/ft';
}

//converts international units to american units
function convertToAmerican(pokemon) {
    let weight = document.getElementById('weight');
    let height = document.getElementById('height');

    weight.innerHTML = ((pokemon['weight'] / 10) * 2.205).toFixed(1);
    document.getElementById('kg-lb').innerHTML = 'lb';

    height.innerHTML = ((pokemon['height'] / 10) * 3.281).toFixed(2);
    document.getElementById('m-ft').innerHTML = 'ft';

    document.getElementById('unit-btn').innerHTML = 'kg/m';
}

//returns an array of classes
function createArrayOfClass(element) {
    return Array.from(element.classList);
}