const places = {
  results: [
    {
      id: '000',
      lat: 43.083378,
      lng: -77.694665,
      name: 'Buried Treasure',
      description: 'Here is where I buried my loot!',
      created: 1567991457000,
    },
    {
      id: '001',
      lat: 43.079647,
      lng: -77.680484,
      name: 'My Seat',
      description: 'Im only getting up for a minute!',
      created: 1567300257000,
    },
    {
      id: '002',
      lat: 43.084255,
      lng: -77.679840,
      name: 'Monday Classes',
      description: 'Here is where my monday classes are.',
      created: 1566792657000,
    },
    {
      id: '003',
      lat: 43.084944,
      lng: -77.672076,
      name: 'Intramural Futsal',
      description: 'RIT plays intramural futsal here.',
      created: 1565759757000,
    },
    {
      id: '004',
      lat: 43.072100,
      lng: -77.644357,
      name: 'McKennas Diner',
      description: 'Best diner near RIT!',
      created: 1567401357000,
    },
  ],
};

// This is a helper function to send JSON responses.
// Passes in a status code, and a content JSON object to send.
const jsonRes = (req, res, statusCode, content) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(content));
  res.end();
};

// This function sends a response back without content
const jsonMetaResponse = (req, res, statusCode) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end();
};

// Return our places
const getPlaces = (req, res, url) => {
  const copy = [...places.results]; // Make a copy for array sorting
  const params = new URLSearchParams(url.search); // Get the parameters

  // Date Sort taken from:
  // https://stackoverflow.com/questions/10123953/how-to-sort-an-array-by-a-date-property
  // Return them in the order of date
  if (params.get('filter') && params.get('filter') === 'date') {
    const dateArr = copy.sort((a, b) => new Date(a.created) - new Date(b.created));
    return jsonRes(req, res, 200, { results: dateArr });
  }
  // Filter the results by alphabetical order.
  if (params.get('filter') && params.get('filter') === 'name') {
    return jsonRes(req, res, 200, { results: copy.sort((a, b) => a.name > b.name) });
  }

  // Filtering size last so we can filter and then reduce the
  // amount of places we're returning.
  // If we have a size parameter, limit the number of places we're sending.
  if (params.get('size')) {
    if (params.get('size') >= places.results.length) return jsonRes(req, res, 200, places); // If our passed in size is too large, send all of them.
    // Otherwise, give them as many as they asked for.
    const limitedPlaces = {
      results: places.results.slice(0, params.get('size')),
    };
    return jsonRes(req, res, 200, limitedPlaces); // Return the limited places
  }

  return jsonRes(req, res, 200, places); // Otherwise, just send places.
};

const getPlacesMeta = (req, res) => {
  jsonMetaResponse(req, res, 200);
};

// Add a place (POST request)
const addPlace = (req, res, body) => {
  if (!body.lat || !body.lng || !body.name || !body.description) {
    const response = {
      error: 'Bad Request. Invalid Object.',
      id: 'missingParams',
      message: 'Object did not have all required properties',
    };
    return jsonRes(req, res, 400, response); // Send a bad request response.
  }

  // Create a new places
  const newPlace = {
    // random ID taken from: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    lat: body.lat,
    lng: body.lng,
    name: body.name,
    description: body.description,
    created: new Date().getTime(),
  };
  places.results.push(newPlace); // Add the place to our list.
  const successJSON = {
    message: 'POST successful',
    objectID: newPlace.id,
  };
  return jsonRes(req, res, 201, successJSON); // Send a successful JSON response
};

// Updated an existing place (PUT request)
const updatePlace = (req, res, url, body) => {
  // Check to see if we have a matching ID
  const params = new URLSearchParams(url.search); // Get the parameters
  if (!params.get('id') || (!body.lat || !body.lng || !body.name || !body.description)) { // If we have a size parameter
    const response = {
      error: 'Bad Request. No ID provided.',
      id: 'no_id',
      message: 'No ID provided with call.',
    };
    return jsonRes(req, res, 400, response); // Send a bad request response.
  }

  // Check if we have a full body
  if (!body.lat || !body.lng || !body.name || !body.description) {
    const response = {
      error: 'Bad Request. Invalid Object.',
      id: 'missingParams',
      message: 'Object did not have all required properties',
    };
    return jsonRes(req, res, 400, response); // Send a bad request response.
  }

  // WE HAVE AN ID! AND WE HAVE A CORRECT BODY!
  for (let i = 0; i < places.results.length; i++) {
    if (places.results[i].id === params.get('id')) {
      places.results[i].lat = body.lat;
      places.results[i].lng = body.lng;
      places.results[i].name = body.name;
      places.results[i].description = body.description;
      return jsonRes(req, res, 204, {});
    }
  }
  return jsonRes(req, res, 400, { error: 'Bad Request. No Object Found.', id: 'object not found', message: 'Object Not Found.' });
};


module.exports.getPlaces = getPlaces;
module.exports.getPlacesMeta = getPlacesMeta;
module.exports.addPlace = addPlace;
module.exports.updatePlace = updatePlace;
