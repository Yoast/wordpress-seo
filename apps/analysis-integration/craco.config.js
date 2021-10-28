const { getLoaders, loaderByName } = require( "@craco/craco" );
const isString = require( "lodash/isString" );

module.exports = {
	webpack: {
		configure: ( webpackConfig, { env, paths } ) => {
			const { hasFoundAny, matches } = getLoaders( webpackConfig, loaderByName( "babel-loader" ) );

			if ( ! hasFoundAny ) {
				return webpackConfig;
			}

			matches.forEach( ( match ) => {
				if ( ! match.loader.include ) {
					return;
				}

				if ( isString( match.loader.include ) ) {
					match.loader.include = [ match.loader.include ];
				}
				if ( ! match.loader.include ) {
					match.loader.include = [];
				}

				match.loader.include.push( /node_modules[/\\](?=(?:yoast-components|yoastseo|@yoast)[/\\]).*/ );
				// Special case for the Yarn link situation.
				match.loader.include.push( /wordpress-seo[/\\]packages[/\\].*/ );
			} );

			return webpackConfig;
		},
	},
};
