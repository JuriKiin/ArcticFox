window.onload = () => {
    getPlaces('/places?size=10&filter=date');
}

function getPlaces(url) {
    //Make 
    fetch(url, {
        method: 'HEAD'
    }).then(res => {
        console.log(res);
    });

    //Make a call to the server to get 10 places
    this.fetch(url, {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }).then(res => res.json()) .then(data => {
        document.getElementById('places').innerHTML = '';
        document.getElementById('places').style.opacity = 1.0;
        document.getElementById('refresh').style.opacity = 0.7;
        document.getElementById('refresh').classList.remove('bor-1');
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
    //Make the fetch call
    fetch('updatePlace?id='+document.querySelector('#submit').getAttribute('d-id'), {
        method: 'PUT',
        body: JSON.stringify(place),
        headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
    }).then((res) => {  //On a response
        if(res.status == 204) {
            console.log(res);   //Log our response
            showToast("Place Updated", 2000);
            //Set our refresh button letting the user know the list isn't up to date.
            document.getElementById('places').style.opacity = 0.7;
            document.getElementById('refresh').style.opacity = 1.0;
            document.getElementById('refresh').classList.add('bor-1');
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
    let placeDate = document.createElement('p');
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

    let createdDate;
    place.created ? createdDate = new Date(place.created) : createdDate = new Date();
    let dd = createdDate.getDate();
    let mm = createdDate.getMonth()+1;
    let yyyy = createdDate.getFullYear();
    let hh = createdDate.getHours();
    if(hh < 10) hh = '0' + hh;
    let min = createdDate.getMinutes();
    if(min < 10) min = '0' + min;
    placeDate.textContent = mm + '-' + dd + '-' + yyyy + ' | ' + hh + ':' + min;
    placeDate.classList = 'font-sm font-text';

    placeLocation.textContent = `Lat: ${place.lat} | Lng: ${place.lng}`;
    placeLocation.classList = 'font-sm font-text bold';

    placeDesc.textContent = place.description;
    placeDesc.classList = 'font-sm font-text o-x';

    //Append children to the container
    placeContainer.appendChild(placeHeader);
    placeContainer.appendChild(placeDate);
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

//This function shows a toast with a given text and duration.
function showToast(text, time) {
    let toast = document.getElementById("snackbar");
    toast.innerText = text;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, time);
}

//This function simply calls a generic getplaces call if we need a refresh.
function refresh() {
    if(document.getElementById('refresh').style.opacity != 1.0) return;
    getPlaces('/places?size=10&filter=date');
}

//This function changes the sorting method for the places list.
function changeSort(e) {
    if(e.getAttribute('data-sortType') === 'date') {
        e.setAttribute('data-sortType','name');
        e.innerText = 'Sort by: name';
        getPlaces('places?filter=name');
    } else {
        e.setAttribute('data-sortType','date');
        e.innerText = 'Sort by: date';
        getPlaces('places?filter=date');
    }
}