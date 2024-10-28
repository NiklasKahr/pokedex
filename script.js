let pokemons = [];
let preloadedPokemons = [];
let currentPokemon;
let amountOfPokemon = 0;
let offset;
let isAmerican;
let searchQuery;

async function init() { // start of the program
    disableButtons(true); // prevent user from spamming
    await loadAndRenderPokemons(render);
    preloadNextBatch();
    disableButtons(false);
}

// load and render the current set of Pokémon
async function loadAndRenderPokemons() {
    const offset = amountOfPokemon;
    amountOfPokemon += 30;

    for (let i = offset; i < amountOfPokemon; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        pokemons.push(currentPokemon);
        if (!searchQuery || nameOrIdMatch(currentPokemon, searchQuery)) {
            render(currentPokemon, i);
        }
    }
}

// preload the next batch of 30 Pokémon without rendering
async function preloadNextBatch() {
    const preloadOffset = amountOfPokemon;
    const preloadAmount = preloadOffset + 30;
    preloadedPokemons = []; // Clear any previous preloaded data

    for (let i = preloadOffset; i < preloadAmount; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i + 1}/`;
        let response = await fetch(url);
        let nextPokemon = await response.json();
        if (!searchQuery || nameOrIdMatch(nextPokemon, searchQuery)) {
            preloadedPokemons.push(nextPokemon);
        }
    }
}

// render functions
function render(pokemon, i) {
    let formattedName = pokemon['name']
        .replace('-f', ' (f)')
        .replace('-m', ' (m)');
    formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);

    document.getElementById('content').innerHTML += `
        <div onclick="renderCard(${i})" id="card${i}" class="content-card background-${evaluateType(pokemon)} filter px-2 py-3 m-cards shadow-sm">
            <div class="text-align-center">
                <h5 class="content-name mb-0">${formattedName}</h5>
                <span class="content-id">#${pokemon['id']}</span>
            </div>
            <img class="content-sprite" src="${pokemon['sprites']['other']['official-artwork']['front_default']}" 
            alt="${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}">
        </div>
    `;
}

// load preloaded Pokémon when "Load More" is clicked, and preload the next batch
async function loadMorePokemons() {
    disableButtons(true);

    // add preloaded Pokémon to main array and render only those matching the search
    preloadedPokemons.forEach((pokemon, index) => {
        pokemons.push(pokemon);
        if (!searchQuery || nameOrIdMatch(pokemon, searchQuery)) {
            render(pokemon, amountOfPokemon + index);
        }
    });

    amountOfPokemon += preloadedPokemons.length;
    await preloadNextBatch();
    disableButtons(false);
}

function renderCard(i) { // event listener for each pokemon card
    let pokemon = pokemons[i];
    showElement('container-black');

    renderCredentials(pokemon);
    renderMoves(pokemon);
    renderType(pokemon);
    replaceColor(document.getElementById('selected-card'), 'background', pokemon);

    isAmerican ? convertToAmerican(pokemon) : convertToInternational(pokemon)
    renderButtons(i, pokemon);

    if (window.innerWidth > 465) {
        document.body.style.overflowY = "hidden";
        document.body.style.marginRight = '14px';
        header.style.width = 'calc(100% + 14px)';
        footer.style.width = 'calc(100% + 14px)';
        let currentPaddingRight = returnCurrentPadding(true);
        header.style.setProperty('padding-right', `${currentPaddingRight}`, 'important');
        footer.style.setProperty('padding-right', `${currentPaddingRight}`, 'important');
    }
}

function renderButtons(i, pokemon) {
    renderPrevButton(i, pokemon);
    renderNxtButton(i, pokemon);
    renderUnitButton(i, pokemon);
}

function renderUnitButton(i, pokemon) {
    let unitButton = document.getElementById('unit-btn');
    // execute renderButtons() again to update the button
    unitButton.onclick = function () { convertUnits(i); renderButtons(i, pokemon); };
    replaceColor(unitButton, 'color', pokemon);
    unitButton.title = 'Convert to ' + (isAmerican ? 'International' : 'American') + ' Units';
}

function renderPrevButton(i, pokemon) {
    let previousButton = document.getElementById('previous-button');

    if (pokemonIsNotFirst(i)) { // if pokemon is not the first one
        previousButton.onclick = function () { renderCard(i - 1); }
        let formattedName = pokemons[i - 1]['name']
            .replace('-f', ' (f)')
            .replace('-m', ' (m)');
        formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
        previousButton.title = 'Show ' + formattedName;
        previousButton.disabled = false;
    } else {
        previousButton.disabled = true;
        previousButton.title = '';
    }
    replaceColor(previousButton, 'background-move', pokemon);
}

function renderNxtButton(i, pokemon) {
    let nextButton = document.getElementById('next-button');

    if (pokemonIsNotLast(i)) { // if pokemon is not the last one
        nextButton.onclick = function () { renderCard(i + 1); }
        let formattedName = pokemons[i + 1]['name']
            .replace('-f', ' (f)')
            .replace('-m', ' (m)');
        formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
        nextButton.title = 'Show ' + formattedName;
    } else {
        // await init(), then execute renderNxtButton() again to update the button
        nextButton.onclick = async function () { await loadMorePokemons(); renderNxtButton(i, pokemon); }
        nextButton.title = 'Load More Pokémon';
    }
    replaceColor(nextButton, 'background-move', pokemon);
}

function renderCredentials(pokemon) {
    let formattedName = pokemon['name']
        .replace('-f', ' (f)')
        .replace('-m', ' (m)');
    formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
    document.getElementById('name').innerHTML = formattedName;
    document.getElementById('id').innerHTML = '#' + pokemon['id'];
    document.getElementById('sprite').src = pokemon['sprites']['other']['official-artwork']['front_default'];
}

function renderMoves(pokemon) {
    // use moves at indices [4, 10, 15] (instead of [1, 2, 3]) as moves are sorted by the similartiy of their names
    const moveIndices = [0, 4, 10, 15];

    moveIndices.forEach((moveIndex, i) => {
        const moveElement = document.getElementById(`move${i}`);

        if (pokemon['moves'][moveIndex] && pokemon['moves'][moveIndex]['move']['name']) {
            // format move name by capitalizing and removing hyphens
            let moveName = pokemon['moves'][moveIndex]['move']['name']
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            moveElement.innerHTML = moveName;
            replaceColor(moveElement, 'background-move', pokemon);
        } else {
            // if move is undefined, clear the innerHTML and set a default color
            moveElement.innerHTML = '';
            // use of replaceColor() not possible since it expects a pokemon and "lightgray" is not one
            moveElement.classList.replace(searchForColorProperty(createArrayOfClass(moveElement), 'background'), 'background-lightgray');
        }
    });
}

function renderType(pokemon) {
    let type = document.getElementById('type');

    if (has2Types(pokemon)) { // display 2 types if pokemon has 2 types
        type.innerHTML =
            pokemon['types'][0]['type']['name'].charAt(0).toUpperCase() +
            pokemon['types'][0]['type']['name'].slice(1) + '<br>' +
            pokemon['types'][1]['type']['name'].charAt(0).toUpperCase() +
            pokemon['types'][1]['type']['name'].slice(1);
    } else { // display 1 type if pokemon has 1 type
        type.innerHTML =
            evaluateType(pokemon).charAt(0).toUpperCase() + evaluateType(pokemon).slice(1);
    }
    adjustPropertyElements(pokemon);
}

function adjustPropertyElements(pokemon) { // adjust the line height of the type element
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

// search functions
function searchCards() { // search for cards with the name or id of the pokemon
    searchQuery = document.getElementById('search').value.toLowerCase().replace(/ +/g, "");
    document.getElementById('content').innerHTML = "";

    // filter and render based on the current search query
    pokemons.forEach((pokemon, index) => {
        if (nameOrIdMatch(pokemon, searchQuery)) {
            render(pokemon, index);
        }
    });
}

function executeSearch() { // make preparations and executes the search
    if (document.getElementById('search').value.trim() == '') {
        reverseSearch(content);
    }
    searchQuery = document.getElementById('search').value.toLowerCase().replace(/ +/g, "");
    document.getElementById('content').innerHTML = '';
    renderSearchedCards(searchQuery);
    hideButtons();
    document.getElementById('sprite-container').style.justifyContent = 'center';
}

async function reverseSearch(content) { // show all cards again
    document.getElementById('search').disabled = true; // prevent user from spamming backspace
    document.getElementById('previous-button').disabled = false;
    document.getElementById('next-button').disabled = false;
    document.getElementById('load-button').disabled = false;

    content.innerHTML = '';
    document.getElementById('search').value = '';
    pokemons = [];
    amountOfPokemon = 0;
    await init();
    showButtons();
    document.getElementById('sprite-container').style.justifyContent = 'space-between';
    document.getElementById('load-button').onclick = function () { init(); };
    document.getElementById('search').disabled = false;
}

function renderSearchedCards(search) { // render the cards that match the search
    for (let i = 0; i < pokemons.length; i++) {
        const pokemon = pokemons[i];
        if (nameOrIdMatch(pokemon, search)) {
            let formattedName = pokemon['name']
                .replace('-f', ' (f)')
                .replace('-m', ' (m)');
            formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);

            document.getElementById('content').innerHTML += `
            <div onclick="renderCard(${i})" id="card${i}" class="content-card background-${evaluateType(pokemon)} filter px-2 py-3 m-cards shadow-sm">
                <div class="text-align-center">
                    <h5 class="content-name mb-0">${formattedName}</h5>
                    <span class="content-id">#${pokemon['id']}</span>
                </div>
                <img class="content-sprite" src="${pokemon['sprites']['other']['official-artwork']['front_default']}" 
                alt="${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}">
            </div>
            `;
        }
    }
}

// show/hide functions
function showElement(id) {
    document.getElementById(id).classList.remove('d-none');
}

function hideElement(id) {
    document.getElementById(id).classList.add('d-none');
    if (id == 'container-black' && window.innerWidth > 465) {
        document.body.style.overflowY = "overlay";
        document.body.style.marginRight = '0px';
        header.style.width = '100%';
        footer.style.width = '100%';
        let currentPaddingRight = returnCurrentPadding();
        header.style.setProperty('padding-right', `${currentPaddingRight}`);
        footer.style.setProperty('padding-right', `${currentPaddingRight}`);
    }
}

function hideButtons() { // hide the buttons when searching for cards
    document.getElementById('previous-button').style.display = 'none';
    document.getElementById('next-button').style.display = 'none';
    document.getElementById('load-button').style.display = 'none';
}

function showButtons() { // show the buttons when not searching for cards anymore
    document.getElementById('previous-button').style.display = 'flex';
    document.getElementById('next-button').style.display = 'flex';
    document.getElementById('load-button').style.display = 'block';
}

function doNotClose(event) { // prevent the container from closing when clicking inside it
    event.stopPropagation();
}

// color functions
function replaceColor(element, colorProperty, pokemon) { // replace the color of the element
    let arrayOfClasses = createArrayOfClass(element);
    let currentColor = searchForColorProperty(arrayOfClasses, split(colorProperty));
    element.classList.replace(currentColor, `${colorProperty}-` + evaluateType(pokemon));
}

// receive array of classes and returns the class that contains the color property
function searchForColorProperty(arrayOfClasses, splitColorProperty) {
    for (let i = 0; i < arrayOfClasses.length; i++) {
        const currentClass = arrayOfClasses[i];

        if (currentClass.includes(splitColorProperty)) {
            return currentClass;
        }
    }
}

function split(colorProperty) { // return split color property
    return colorProperty.split('-')[0];
}

// conditionals
function type0EqualsNormal(pokemon) { // return true if type0 is normal
    return pokemon['types'][0]['type']['name'] == 'normal';
}

function has2Types(pokemon) { // return true if type1 exists
    return pokemon['types'][1];
}

function moveUndefined(pokemon, moveIndex) { // return true if the move is undefined
    return pokemon['moves'][moveIndex] == undefined;
}

function pokemonIsNotFirst(i) { return i != 0; } // return true if the pokemon is not the first

function pokemonIsNotLast(i) { return i != pokemons.length - 1; } // return true if the pokemon is not the last

function cardIsVisible() { // return true if the card is visible
    return !document.getElementById('container-black').classList.contains('d-none');
}

function nameOrIdMatch(pokemon, search) { // return true if the name or id of the pokemon matches the search
    return pokemon['name'].includes(search) || pokemon['id'].toString().includes(search);
}

// parameter functions
function evaluateType(pokemon) { // return the type of the pokemon
    if (type0EqualsNormal(pokemon) && has2Types(pokemon)) { // if type0 is normal and type1 exists, return type1
        let type1 = pokemon['types'][1]['type']['name'];
        return type1;
    } else {
        let type0 = pokemon['types'][0]['type']['name'];
        return type0;
    }
}

function extractPokemon() { // return the id of pokemon based on the card id
    let i = document.getElementById('id').textContent.replace('#', '') - 1;
    return pokemons[i];
}

// conversion functions
function convertUnits(i) { // convert american units to international units and vice versa
    let pokemon = pokemons[i]
    if (isAmerican) {
        convertToInternational(pokemon);
        isAmerican = false;
    } else {
        convertToAmerican(pokemon);
        isAmerican = true;
    }
}

function convertToInternational(pokemon) { // convert american units to international units
    document.getElementById('weight').innerHTML = (pokemon['weight'] / 10).toFixed(1).replace('.', ',');
    document.getElementById('kg-lb').innerHTML = 'kg';

    document.getElementById('height').innerHTML = (pokemon['height'] / 10).toFixed(2).replace('.', ',');
    document.getElementById('m-ft').innerHTML = 'm';

    document.getElementById('unit-btn').innerHTML = 'lb/ft';
}

function convertToAmerican(pokemon) { // convert international units to american units
    let weight = document.getElementById('weight');
    let height = document.getElementById('height');

    weight.innerHTML = ((pokemon['weight'] / 10) * 2.205).toFixed(1);
    document.getElementById('kg-lb').innerHTML = 'lb';

    height.innerHTML = ((pokemon['height'] / 10) * 3.281).toFixed(2);
    document.getElementById('m-ft').innerHTML = 'ft';

    document.getElementById('unit-btn').innerHTML = 'kg/m';
}

function disableButtons(isDisabled) {
    document.getElementById('load-button').disabled = isDisabled;
    document.getElementById('next-button').disabled = isDisabled;
}

function createArrayOfClass(element) { // return an array of classes
    return Array.from(element.classList);
}

function returnCurrentPadding(includingScrollbar) { // return the current padding right of both the header and footer
    let scrollbarWidth = includingScrollbar ? 14 : 0;
    let paddingValue;
    const screenWidth = window.innerWidth;

    switch (true) {
        case (screenWidth > 465 && screenWidth <= 785):
            paddingValue = 'calc(14.5% + 4px + ' + scrollbarWidth + 'px)';
            break;
        case (screenWidth > 355 && screenWidth <= 465):
            paddingValue = 'calc(3% + 4px + ' + scrollbarWidth + 'px)';
            break;
        case (screenWidth <= 355):
            paddingValue = 'calc(2% + 4px + ' + scrollbarWidth + 'px)';
            break;
        default:
            paddingValue = 'calc(14.5% + 8px + ' + scrollbarWidth + 'px)';
    }

    return paddingValue;
}

addEventListener('resize', setLayout);

function setLayout() {
    if (cardIsVisible()) {
        let currentPaddingRight = returnCurrentPadding(true);
        header.style.setProperty('padding-right', `${currentPaddingRight}`, 'important');
        footer.style.setProperty('padding-right', `${currentPaddingRight}`, 'important');
        if (window.innerWidth > 465) {
            document.body.style.overflowY = "hidden";
            document.body.style.marginRight = '14px';
            header.style.width = 'calc(100% + 14px)';
            footer.style.width = 'calc(100% + 14px)';
        }
    } else {
        let currentPaddingRight = returnCurrentPadding();
        header.style.setProperty('padding-right', `${currentPaddingRight}`, 'important');
        footer.style.setProperty('padding-right', `${currentPaddingRight}`, 'important');
        if (window.innerWidth > 465) {
            document.body.style.overflowY = "overlay";
            document.body.style.marginRight = '0';
            header.style.width = 'calc(100%)';
            footer.style.width = 'calc(100%)';
        }
    }
    if (window.innerWidth < 465) {
        document.body.style.overflowY = "overlay";
        document.body.style.marginRight = '0';
    }

}