const path = require( "path" );

// See https://github.com/gruntjs/grunt-contrib-clean
module.exports = {
	publish: [
		"dist",
	],
	js: [
		path.resolve( "dist", "build" ),
	],
};
