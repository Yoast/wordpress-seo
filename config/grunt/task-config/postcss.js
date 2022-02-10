const path = require( "path" );
const autoPrefixer = require( "autoprefixer" );
const cssNano = require( "cssnano" );
const postCSSImport = require( "postcss-import" );
const tailwindcss = require( "tailwindcss" );
const tailwindcssNesting = require( "tailwindcss/nesting" );

// https://github.com/C-Lodder/grunt-postcss
module.exports = {
	build: {
		options: {
			map: {
				inline: false,
				annotation: "css/dist",
			},
			processors: [
				postCSSImport(),
				tailwindcssNesting,
				tailwindcss( path.resolve( __dirname, "../../../tailwind.config.js" ) ),
				autoPrefixer(),
			],
		},
		src: "css/dist/*.css",
	},
	release: {
		options: {
			map: false,
			processors: [
				postCSSImport(),
				tailwindcssNesting( path.resolve( __dirname, "../../../tailwind.config.js" ) ),
				tailwindcss( path.resolve( __dirname, "../../../tailwind.config.js" ) ),
				autoPrefixer(),
				cssNano(),
			],
		},
		src: "css/dist/*.css",
	},
};
