module.exports = ( api ) => ( {
	presets: [
		"@babel/preset-env",
		"@babel/preset-react",
	],
	plugins: [
		"@babel/plugin-transform-runtime",
	],
	sourceType: "unambiguous",
	sourceMaps: ( api.env( envName => envName !== "production" ) ),
} );
