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
		src: "css/dist/*.css",
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
		src: "css/dist/*.css",
	},
};
