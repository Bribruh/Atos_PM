Install Guide: 
  Local Machine Install:
    - Node.js (MSI File): https://nodejs.org/en/download/
    - MongoDB Community Server v4.2.3 (MSI File): https://www.mongodb.com/download-center/community

  NPM Packages: 
    - Morgan: npm install morgan --save
    - Optimist: npm install optimist --save
    - Mongoose: npm install mongoose --save
    - Express: npm install express --save
    - EJS: npm install ejs --save
    - CSV-Parser: npm install csv-parser --save

Root Folder:
  TestData.json: User-generated test data stored inside of remote MongoDB
  columData.csv: User-generated CSV document containing column data for Ag-Grid API

  Stylesheets: External CSS files
  bin: Directory location to start express web app as web server
  
  Views: All EJS files to be rendered by JS Script
    - Index.ejs: Rendered HTML page with Ag-Grid and Mongo db values
    - Input.ejs: Rendered HTML page to store User Input and insert into MongoDB
    - Modify.ejs: Rendered HTML to display MongoDB value, read user input, and re-insert into MongoDB
  
  Scripts:
    - Connect: Creates connection into remote MongoDB instance on MyServer using Mongoogse
    - Display: Stores all mongo db values from collection and passes into Index.ejs to be rendered onto Ag-Grid
    - Input:
    - Modify:
