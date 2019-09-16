const http = require('http');
const url = require('url');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Create handlers for our HTML and JSON
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// This holds the key/value pairs for URLs
// we might want to access and what should be done once accessed.

const handleBody = (req, res, reqURL) => {
  const body = [];
  req.on('error', () => { // If we get an error when posting, set our status code and end our response.
    res.statusCode = 400;
    res.end();
    return body;
  });
  req.on('data', (chunk) => { // When we receive data, add it to our body.
    body.push(chunk);
  });
  // on end of upload stream.
  req.on('end', () => { // Once all data has been pushed, parse it and handle it.
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = JSON.parse(bodyString);
    if (reqURL.pathname === '/addPlace') jsonHandler.addPlace(req, res, bodyParams);
    if (reqURL.pathname === '/updatePlace') jsonHandler.updatePlace(req, res, reqURL, bodyParams);
  });
};

const urls = {
  GET: {
    '/': htmlHandler.getIndex,
    '/media/logo.png': htmlHandler.getImage,
    '/js/main.js': htmlHandler.getJS,
    '/js/map.js': htmlHandler.getJS,
    '/places': jsonHandler.getPlaces,
  },
  HEAD: {
    '/placesHEAD': jsonHandler.getPlacesMeta,
  },
  POST: {
    '/addPlace': handleBody,
  },
  PUT: {
    '/updatePlace': handleBody,
  },
};

// This function handles requests from the client.
const onRequest = (req, res) => {
  const reqURL = url.parse(req.url); // Get our request URL.
  if (urls[req.method][reqURL.pathname]) {
    urls[req.method][reqURL.pathname](req, res, reqURL);
  } else {
    htmlHandler.get404(req, res);
  }
};

http.createServer(onRequest).listen(port); // Create the server.
