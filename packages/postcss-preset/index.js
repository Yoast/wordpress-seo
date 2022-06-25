/* eslint-disable global-require */
module.exports = {
	map: process.env.NODE_ENV === "production" ? false : {
		inline: false,
		annotation: true,
	},
	plugins: [
		require( "postcss-import" ),
		require( "tailwindcss/nesting" ),
		require( "tailwindcss" ),
		require( "autoprefixer" ),
		...( process.env.NODE_ENV === "production" ? [ require( "cssnano" ) ] : [] ),
	],
};
