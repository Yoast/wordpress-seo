module.exports = ( api ) => ( {
	presets: [
		[
			"@babel/preset-env",
			{
				modules: api.env( "test" ) ? "auto" : false,
			},
		],
		"@babel/preset-react",
	],
	plugins: [
		"@babel/plugin-transform-optional-chaining",
		"@babel/plugin-transform-runtime",
	],
	sourceType: "unambiguous",
	sourceMaps: ( api.env( envName => envName !== "production" ) ),
} );
