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

//This is a helper function to send JSON responses. Passes in a status code, and a content JSON object to send.
const jsonResponse = (req, res, statusCode, content) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(content));
  res.end();
};

//Return our places
const getPlaces = (req, res, url) => {
  const params = new URLSearchParams(url.search); //Get the parameters
  if (params.get('size')) { //If we have a size parameter
    if (params.get('size') >= places.results.length) return jsonResponse(req, res, 200, places);  //If our passed in size is too large, send all of them.
    // Otherwise, give them as many as they asked for.
    const limitedPlaces = {
      results: places.results.slice(0, params.get('size')),
    };
    return jsonResponse(req, res, 200, limitedPlaces);  //Return the limited places
  }
  return jsonResponse(req, res, 200, places); //Otherwise, just send places.
};

//Add a place (POST request)
const addPlace = (req, res, body) => {
  if (!body.lat || !body.lng || !body.name || !body.description) {  //If our body doesn't have all parameters
    const response = {
      error: 'Bad Request. Invalid Object.',
      id: 'missingParams',
      message: 'Object did not have all required properties',
    };
    return jsonResponse(req, res, 400, response); //Send a bad request response.
  }

  //Create a new places
  const newPlace = {
    // random ID taken from: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    lat: body.lat,
    lng: body.lng,
    name: body.name,
    description: body.description,
    created: new Date().getTime(),
  };
  places.results.push(newPlace);  //Add the place to our list.
  const successJSON = {
    message: 'POST successful',
  };
  return jsonResponse(req, res, 201, successJSON);  //Send a successful JSON response
};


module.exports.getPlaces = getPlaces;
module.exports.addPlace = addPlace;
