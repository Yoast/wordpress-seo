/* eslint-disable global-require */
module.exports = {
	plugins: [
		require( "postcss-import" ),
		require( "tailwindcss" ),
		require( "tailwindcss/nesting" ),
		require( "autoprefixer" ),
		...( process.env.NODE_ENV === "production" ? [ require( "cssnano" ) ] : [] ),
	],
};
