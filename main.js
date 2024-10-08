const { getClient } = require('./get-client');

(async () => {
  const client = await getClient();
  let createTableQuery = `
    CREATE TABLE IF NOT EXISTS my_table(
      id PRIMARY KEY NOT NULL ,
      name varchar,
      date TIMESTAMP NOT NULL DEFAULT current_timestamp
    );
  `;
  const res = await client.query(createTableQuery);
  console.log(`Created table.`);
  await client.end();
})();
(() => {
  
  restApiURL = '/api/';
  data = null;

  async function loadData(){ 
    try{
    
        const response = await fetch(restApiURL);
        if(!response.ok){
            throw new Error(`HTTPerror:${response.status}`);
        }
       
        data=await response.json();
       
        render(); 
    } catch(error){
        console.error(`Could not get product data:${error}`);
    }
  }

  function render() {
    blogPostContainer = document.querySelector('.container.blog-posts');

    let outputHtml = '<ul>';
    data.forEach((blogPost) => {
      outputHtml += `<li><a href="${restApiURL}/${blogPost.id}">${blogPost.title} by ${blogPost.author}</a></li>`;
    });  
    outputHtml += '</ul>';
    
    blogPostContainer.innerHTML = outputHtml;
  }

  function init() {
    console.info("DOM loaded");
    loadData();
  }
  
  if (document.readyState === "loading") {
    
    document.addEventListener("DOMContentLoaded", init);
  } else {
 
    init();
  }

})();  

const http = require('http');
const url = require('url');
const { getClient } = require('./get-client');

// This is our main function which handles serving HTTP requests

(async () => {

  // Similar to our previous examples, we need a database client.
  const client = await getClient();

  // Ensure that our database table is setup correctly.
  await setupTable(client);

  const server = http.createServer(); // Initializing the HTTP server
  const address = { port: 8080, host: '0.0.0.0' };

  // request handler function: each request to the HTTP server will be handled here
  let requestHandler = async function (req, res) {

    // Utility function helping to return a json response and doing request logging, we can also specify the HTTP status
    // code here which allows to signal if a request was successful or give a hint why it failed.

    const jsonResponse = (responseObject, responseCode = 200) => {
      res.writeHead(responseCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responseObject));

      console.log(new Date(), '-- Handled request:', req.method, req.url, responseCode);
    };

    // Parse the URL from which the request came from.
    const requestUrl = new URL(req.url, 'http://localhost:8080');

    // We mainly need the URL to check if a specific name was passed as a query string
    const name = requestUrl.searchParams.get('name') ?? 'john';

    // Here we setup the simple request routing, depending on which URL path was specified, we handle the request differently.

    try {

      if (requestUrl.pathname === '' || requestUrl.pathname === '/') {

        // Default URL path - we query all entries in our table without filtering
        const entries = await client.query('SELECT * FROM my_table;');
        jsonResponse(entries.rows);

      } else if (requestUrl.pathname === '/read') {

        // Read URL path - we filter by the name which was specified as query string
        const entries = await client.query('SELECT * FROM my_table WHERE name = $1;', [name]);
        jsonResponse(entries.rows);

      } else if (requestUrl.pathname === '/add') {

        // Add URL path - a new entry is inserted into the database with the specified name.
        let insertRow = await client.query('INSERT INTO my_table(name) VALUES($1);', [`${name}`]);
        jsonResponse({ success: true, message: `Inserted ${insertRow.rowCount} row with name '${name}'` });

      } else {

        // If no of our know paths is returned, we will respond with the standard "Not Found" response with HTTP response code 404
        jsonResponse("The requested route doesn't exist :(", 404);

      }
    } catch (e) {

      // If anything fails during the request handling, we handle the error gracefully by responding with the standard
      // HTTP response code 500 which stands for "Internal Server Error"
      jsonResponse(`Some error happened :(( -- (error: ${e.message})`, 500);

    }
  };

  // Here we assign our previously defined request handler to our server instance
  server.on('request', requestHandler);

  // Final step: starting the server and waiting for requests.
  server.listen(address.port, address.host);

  // Enter the URL in your browser and check if request are handled.
  console.log(`Listening on: http://${address.host}:${address.port}`);

})();

// Function with same functionality as in the 'setup-table.js' file

async function setupTable(client) {
  let createTableQuery = `
    CREATE TABLE IF NOT EXISTS my_table(
      id PRIMARY KEY NOT NULL ,
      name varchar,
      date TIMESTAMP NOT NULL DEFAULT current_timestamp
    );
  `;
  return await client.query(createTableQuery);
}