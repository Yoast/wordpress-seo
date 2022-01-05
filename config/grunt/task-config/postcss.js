const autoPrefixer = require( "autoprefixer" );
const cssNano = require( "cssnano" );
const postCSSImport = require( "postcss-import" );
const tailwindcss = require( "tailwindcss" );

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
				tailwindcss(),
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
				tailwindcss(),
				cssNano(),
			],
		},
		src: "css/dist/*.css",
	},
};
