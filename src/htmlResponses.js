const fs = require('fs');

// Create variables for all of the files we want to load
const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const notFound = fs.readFileSync(`${__dirname}/../client/404.html`);
const mainJS = fs.readFileSync(`${__dirname}/../client/js/main.js`);
const mapJS = fs.readFileSync(`${__dirname}/../client/js/map.js`);
const logo = fs.readFileSync(`${__dirname}/../client/media/logo.png`);
const favicon = fs.readFileSync(`${__dirname}/../client/media/favicon.png`);


// This function returns an HTML page from a given file
const getHTML = (req, res, page) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write(page);
  res.end();
};

// This function returns a specified JS file.
const getJS = (req, res, path) => {
  res.writeHead(200, { 'Content-Type': 'application/javascript' });
  if (path.pathname === '/js/main.js') res.write(mainJS);
  else if (path.pathname === '/js/map.js') res.write(mapJS);
  else res.write(mainJS);
  res.end();
};

// This function returns an image at a given path.
const getImage = (req, res, path) => {
  let img;
  switch (path.pathname) {
    case '/media/logo.png':
      img = logo;
      break;
    case '/media/favicon.png':
      img = favicon;
      break;
    default:
      img = logo;
      break;
  }
  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.write(img);
  res.end();
};

// Our getIndex returns the index HTML page
module.exports.getIndex = (req, res) => {
  getHTML(req, res, index);
};
// Our 404 function returns the 404 HTML page
module.exports.get404 = (req, res) => {
  getHTML(req, res, notFound);
};
module.exports.getImage = getImage;
module.exports.getJS = getJS;
