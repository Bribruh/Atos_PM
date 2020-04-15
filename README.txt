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
    - Moment: npm install moment --save
    
Root Folder:
  TestData.json: User-generated test data stored inside of remote MongoDB
  columData.csv: User-generated CSV document containing column data for Ag-Grid API

  Stylesheets: External CSS files
  bin: Directory location to start express web app as web server
  
  pulldownOptions: Folder to store pulldown selection choices for all options
    - Default Headers: {options, field}
    - CSV File Name: Options for pulldown selections in Input page
    - Admin changes to CSV will need to be re-committed for all users to view
    
 columnData: Stored column-header information for custom generated views in Ag-Grid
    - Default Headers: {headerName, field, sortable, filter, filterParams}
    -CSV File Name: Custom-generated column definitions for Ag-Grid display
  
  Views: All EJS files to be rendered by JS Script
    - Index.ejs: Rendered HTML page with Ag-Grid and Mongo db values
    - Input.ejs: Rendered HTML page to store User Input and insert into MongoDB
    - Modify.ejs: Rendered HTML to display MongoDB value, read user input, and re-insert into MongoDB
  
  Scripts:
    - Connect: 
       - Creates connection into remote MongoDB instance on MyServer using Mongoogse
       - Creates custom schema for MongoDB storage
    - Display: 
       - Main script that handles web-server interactions
       - Routes/Renders static view pages over for each request (button event)
          - Edit Value, New Value, Modify Value, Input Value, Cancel  
    
APIs:
   - Mongoose: https://www.npmjs.com/package/mongoose
   - Express: https://www.npmjs.com/package/express
   - Ag-Grid:https://www.ag-grid.com/
   
Project Manuals: https://drive.google.com/drive/folders/1b1AwEu1kSImFX9z37hzJ6UJFZoZjhxp0?usp=sharing
