const path = require( "path" );
const autoPrefixer = require( "autoprefixer" );
const cssNano = require( "cssnano" );
const postCSSImport = require( "postcss-import" );
const tailwindcss = require( "tailwindcss" );

// https://github.com/C-Lodder/grunt-postcss
module.exports = {
	build: {
		options: {
			map: {
				inline: false,
				annotation: "css/dist",
			},
			processors: [
				autoPrefixer(),
				tailwindcss( path.resolve( __dirname, "../../../tailwind.config.js" ) ),
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
				tailwindcss( path.resolve( __dirname, "../../../tailwind.config.js" ) ),
				postCSSImport(),
				cssNano(),
			],
		},
		src: "css/dist/*.css",
	},
};
