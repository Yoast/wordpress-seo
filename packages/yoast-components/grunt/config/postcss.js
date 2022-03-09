const cssnano = require( "cssnano" );
const autoprefixer = require( "autoprefixer" );
const postcssImport = require( "postcss-import" );

// See https://github.com/nDmitry/grunt-postcss
module.exports = {
	options: {
		processors: [
			postcssImport(),
			autoprefixer( { browsers: "last 2 versions, IE >= 11" } ),
			cssnano(),
		],
	},
	build: {
		cwd: "css/",
		src: [ "all.css", "standalone.css" ],
		dest: "css-dist/",
		expand: true,
		ext: ".css",
	},
};
