const autoPrefixer = require( "autoprefixer" );
const cssNano = require( "cssnano" );
const postCSSImport = require( "postcss-import" );
// https://github.com/nDmitry/grunt-postcss
module.exports = {
	build: {
		options: {
			map: {
				inline: false,
				annotation: "css/dist",
			},
			processors: [
				autoPrefixer(),
				postCSSImport(),
			],
		},
		src: "<%= files.css %>",
	},
	release: {
		options: {
			map: false,
			processors: [
				autoPrefixer(),
				postCSSImport(),
				cssNano(),
			],
		},
		src: "<%= files.css %>",
	},
};
