/* eslint-disable global-require */
module.exports = {
	plugins: [
		require( "postcss-import" ),
		require( "tailwindcss/nesting" ),
		require( "tailwindcss" ),
		require( "autoprefixer" ),
		...( process.env.NODE_ENV === "production" ? [ require( "cssnano" ) ] : [] ),
	],
};
