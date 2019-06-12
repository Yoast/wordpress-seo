// https://github.com/nDmitry/grunt-postcss
var autoprefixer = require( "autoprefixer" );
var cssnano = require( "cssnano" );

/* global require, global */
module.exports = {
	options: {
		map: global.developmentBuild,
		processors: [
			autoprefixer( { browsers: "last 2 versions, IE >= 9" } ),
			cssnano(),
		],
	},
	build: {
		src: "<%= files.css %>",
	},
};
