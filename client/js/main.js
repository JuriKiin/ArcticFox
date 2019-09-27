window.onload = () => {
    getPlaces(10);
}

function getPlaces() {
    //Make 
    fetch('/places', {
        method: 'HEAD'
    }).then(res => {
        console.log(res);
    });

    //Make a call to the server to get 10 places
    this.fetch('/places', {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }).then(res => res.json()) .then(data => {
        document.getElementById('places').style.opacity = 1.0;
        document.getElementById('refresh').style.display = 'none';
        data.results.forEach(function(e) {   //Add each place to the list
            addPlaceToList(e);
            addMarkersFromData(e);
        });
    });
}

function submitForm(e) {
    if(e.textContent === 'Add') addPlace();
    else if(e.textContent === 'Update') updatePlace();
}

//POST call to add a place to the server
function addPlace() {
    let place = createPlace();  //Create a place
    if(!placeIsValid(place)) {  //Check if it's valid
        //Display a popup with information regarding why not valid
        showToast("Make sure you fill out every box.", 2000);
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
            res.json().then((result) => {
                if(result.objectID) place.id = result.objectID;
                addPlaceToList(place);
                addMarkersFromData(place);
                clearForm();
                showToast('Place Added.', 2000);
            });
        }
    }).catch(() => {
        showToast('Error Adding Place. Try Again.', 2000);
    });
};

//PUT call to update a place
function updatePlace() {
    if (!document.querySelector('#submit').getAttribute('d-id')) {
        showToast('Place not selected', 2000);
        return;
    }
    let place = createPlace();  //Create a place
    if(!placeIsValid(place)) {  //Check if it's valid
        //Display a popup with information regarding why not valid
        showToast("Make sure you fill out every box.", 2000);
        return;
    }

    fetch('updatePlace?id='+document.querySelector('#submit').getAttribute('d-id'), {
        method: 'PUT',
        body: JSON.stringify(place),
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
    }).then((res) => {
        if(res.status == 204) {
            console.log(res);
            showToast("Place Updated", 2000);
            document.getElementById('places').style.opacity = 0.7;
            document.getElementById('refresh').style.display = 'block';
        }
    }).catch(() => {
        showToast('Error Updating Place. Try Again.', 2000);
    });
}

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
    placeContainer.setAttribute('d-id', place.id);

    //Add click event 
    placeContainer.addEventListener('click', () => {
        map.panTo({lat: parseFloat(place.lat), lng: parseFloat(place.lng)});
        map.setZoom(16);
        populateForm(place);
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

//This function populates the form with the clicked on place.
//This also sets the button to Update, because we should already have a place
//This will be used to update that place.
function populateForm(place) {
    document.querySelector('#lat').value = place.lat;
    document.querySelector('#lng').value = place.lng;
    document.querySelector('#name').value = place.name;
    document.querySelector('#desc').value = place.description;
    document.querySelector('#submit').textContent = 'Update';
    document.querySelector('#submit').setAttribute('d-id',place.id);
}

//This function clears a form once a place has been added
function clearForm() {
    document.querySelector('#lat').value = '';
    document.querySelector('#lng').value = '';
    document.querySelector('#name').value = '';
    document.querySelector('#desc').value = '';
    document.querySelector('#submit').textContent = 'Add';
    document.querySelector('#submit').removeAttribute('d-id');
}

//This function validates whether we are sending correct and all parameters to the server.
function placeIsValid(place) {
    if(!place.lat || !place.lng || !place.name || !place.description) {
        return false;
    } else return true;
}

function showToast(text, time) {
    let toast = document.getElementById("snackbar");
    toast.innerText = text;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, time);
}