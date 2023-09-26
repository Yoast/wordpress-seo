module.exports = ( api ) => {
	api.cache( true );

	return {
		presets: [ "@wordpress/babel-preset-default" ],
		plugins: [
			"@babel/plugin-proposal-optional-chaining",
			"@babel/plugin-transform-runtime",
			"@babel/plugin-transform-class-properties",
		],
		sourceType: "unambiguous",
	};
};
