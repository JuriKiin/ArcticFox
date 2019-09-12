const http = require('http');
const url = require('url');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Create handlers for our HTML and JSON
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

// This holds the key/value pairs for URLs
// we might want to access and what should be done once accessed.
const urls = {
  '/': htmlHandler.getIndex,
  '/media/logo.png': htmlHandler.getImage,
  '/js/main.js': htmlHandler.getJS,
  '/js/map.js': htmlHandler.getJS,
  '/places': jsonHandler.getPlaces,
  '/addPlace': jsonHandler.addPlace,
};

// Handle post requests
const handlePOST = (req, res, reqURL) => {
  const body = [];

  req.on('error', () => { // If we get an error when posting, set our status code and end our response.
    res.statusCode = 400;
    res.end();
  });
  req.on('data', (chunk) => { // When we receive data, add it to our body.
    body.push(chunk);
  });
  // on end of upload stream.
  req.on('end', () => { // Once all data has been pushed, parse it and handle it.
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = JSON.parse(bodyString);
    if (reqURL.pathname === '/addPlace') jsonHandler.addPlace(req, res, bodyParams);
  });
};

// This function handles HEAD requests
const handleHEAD = (req, res, pUrl) => {
  if (pUrl.pathname === '/places') handlePOST(req, res, pUrl);
  else htmlHandler.get404(req, res, pUrl);
};

// This function handles requests from the client.
const onRequest = (req, res) => {
  const reqURL = url.parse(req.url); // Get our request URL.

  // If we are attempting a post, send it to our function to handle post requests
  // Send it to our function to handle HEAD requests
  if (req.method === 'POST') {
    handlePOST(req, res, reqURL);
  } else if (req.method === 'HEAD') handleHEAD(req, res, reqURL);
  // Else try to access the proper handler from our URL struct
  else if (urls[reqURL.pathname]) urls[reqURL.pathname](req, res, reqURL);
  else htmlHandler.get404(req, res, reqURL); // If we can't find anything to do, throw the 404.
};

http.createServer(onRequest).listen(port); // Create the server.
