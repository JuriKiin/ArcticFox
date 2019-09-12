window.onload = () => {
    getPlaces(10);
}

//GET call to get places with optional size param.
function getPlaces(size) {
    //Make a call to the server to get 10 places
    this.fetch('/places', {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }).then(res => res.json()) .then(data => {
        data.results.forEach(function(e) {   //Add each place to the list
            addPlaceToList(e);
            addMarkersFromData(e);
        });
    });
}

//POST call to add a place to the server
function addPlace() {
    let place = createPlace();  //Create a plae
    if(!placeIsValid(place)) {  //Check if it's valid
        //Display a popup with information regarding why not valid
        return;
    }
    fetch('/addPlace', {    //Call our server
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(place)
    }).then((res) => {
        if(res.status == 201) {
            res.json().then(() => {
                addPlaceToList(place);
                addMarkersFromData(place);
                clearForm();
            });
        }
    });
};

//This function gets the new marker info from inputs and returns it.
function createPlace() {
    return {
        lat: document.querySelector('#lat').value,
        lng: document.querySelector('#lng').value,
        name: document.querySelector('#name').value,
        description: document.querySelector('#desc').value
    };
}

//Add a place to the sidebar list.
function addPlaceToList(place) {
    //Create elements
    let placeContainer = document.createElement('div');
    let placeHeader = document.createElement('h1');
    let placeLocation = document.createElement('h2');
    let placeDesc = document.createElement('p');

    //Set classes
    placeContainer.classList = 'bg-fire margin-5 snow pad-10p link-clear slide-r';

    //Add click event 
    placeContainer.addEventListener('click', () => {
        map.panTo({lat: parseFloat(place.lat), lng: parseFloat(place.lng)});
        map.setZoom(16);
    });

    //Set content & classes
    placeHeader.textContent = place.name;
    placeHeader.classList = 'font-text font-md';

    placeLocation.textContent = `Lat: ${place.lat} | Lng: ${place.lng}`;
    placeLocation.classList = 'font-sm font-text bold';

    placeDesc.textContent = place.description;
    placeDesc.classList = 'font-sm font-text o-x';

    //Append children to the container
    placeContainer.appendChild(placeHeader);
    placeContainer.appendChild(placeLocation);
    placeContainer.appendChild(placeDesc);
    document.querySelector('#places').insertBefore(placeContainer,document.querySelector('#places').firstChild);
}

//This function clears a form once a place has been added
function clearForm() {
    document.querySelector('#lat').value = '';
    document.querySelector('#lng').value = '';
    document.querySelector('#name').value = '';
    document.querySelector('#desc').value = '';
}

//This function validates whether we are sending correct and all parameters to the server.
function placeIsValid(place) {
    //Validate some stuff here
    return true;
}