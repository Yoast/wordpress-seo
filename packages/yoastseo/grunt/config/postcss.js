var autoprefixer = require( "autoprefixer" );

// See https://github.com/nDmitry/grunt-postcss
module.exports = {
	options: {
		processors: [
			autoprefixer( { browsers: "last 2 versions, IE >= 11" } ),
		],
	},
	build: {
		src: "dist/yoast-seo.min.css",
	},
};
