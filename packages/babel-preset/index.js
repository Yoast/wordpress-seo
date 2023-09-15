module.exports = ( api ) => {
	api.cache( true );

	return {
		presets: [ "@wordpress/babel-preset-default" ],
		plugins: [
			"@babel/plugin-proposal-optional-chaining",
			"@babel/plugin-transform-runtime",
			"@babel/plugin-proposal-class-properties",
		],
		sourceType: "unambiguous",
	};
};
