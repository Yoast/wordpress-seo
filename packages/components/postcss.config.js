module.exports = {
	map: process.env.NODE_ENV === "production" ? false : {
		inline: false,
		annotation: true,
	},
	plugins: [
		require( "postcss-import" ),
		require( "autoprefixer" ),
		...( process.env.NODE_ENV === "production" ? [ require( "cssnano" ) ] : [] ),
	],
};
