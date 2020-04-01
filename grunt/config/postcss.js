const autoPrefixer = require( "autoprefixer" );
const cssNano = require( "cssnano" );
const postCSSImport = require( "postcss-import" );
// https://github.com/nDmitry/grunt-postcss
module.exports = {
	build: {
		options: {
			map: "<%= developmentBuild %>",
			processors: [
				autoPrefixer(),
				cssNano(),
				postCSSImport(),
			],
		},
		src: "<%= files.css %>",
	},
};
