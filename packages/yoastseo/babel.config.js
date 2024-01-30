module.exports = ( api ) => {
	const isTest = api.env( "test" );

	if ( isTest ) {
		return {
			presets: [ "@babel/preset-env" ],
		};
	}

	return {
		presets: [
			[
				"@babel/preset-env", {
					modules: false,
				},
			],
		],
	};
};
