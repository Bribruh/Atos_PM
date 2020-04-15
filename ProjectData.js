/*

Exports all projects to be used in other files

*/

// Import dependencies
var csv = require('csv-parser')
var fs = require('fs')
var Connect = require('./Connect')
var mongooseproj = Connect.mongooseproj
var Project = Connect.Project

// Import column data from CSV
var columns = []
fs.createReadStream('columnData.csv')
	.pipe(csv(['headerName', 'field','sortable', 'filter','filterParams']))
	.on('data', (data) => columns.push(data))
	//.on('end', () => {console.log(columns)})

// Import project data
var projects = []
Project.find({}, (err, p) => {
	if (err) return console.error(err)
	for (var i=0; i<p.length; i++) {
		projects.push(p[i])
	}
})

// Export data
module.exports.projects = projects
module.exports.columns = columns