const path = require( "path" );
const { getLoaders, loaderByName } = require( "@craco/craco" );
const { isString, zipObject, map } = require( "lodash" );

const yoastPackages = [
	"@yoast/analysis-report",
	"@yoast/components",
	"@yoast/helpers",
	"@yoast/replacement-variable-editor",
	"@yoast/search-metadata-previews",
	"@yoast/style-guide",
	"yoast-components",
	"yoastseo",
];

module.exports = {
	webpack: {
		alias: {
			"react": path.resolve( "./node_modules/react" ),
			"@wordpress/data": path.resolve( "./node_modules/@wordpress/data" ),
			"@wordpress/element": path.resolve( "./node_modules/@wordpress/element" ),
			"@wordpress/hooks": path.resolve( "./node_modules/@wordpress/hooks" ),
			"@wordpress/i18n": path.resolve( "./node_modules/@wordpress/i18n" ),
			// Some published Yoast packages are critically behind (missing imports) the repo source, enforce the use of the repo versions.
			...zipObject( yoastPackages, map( yoastPackages, name => path.resolve( `./node_modules/${ name }` ) ) ),
			// Note sure why this is needed. Without gives the following error: `Uncaught TypeError: styleSheet.inject is not a function`.
			"styled-components": path.resolve( "./node_modules/styled-components" ),
		},
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

				// Build the Yoast packages that do not build themselves.
				match.loader.include.push( new RegExp( `/node_modules[/\\\\](?=(?:${ yoastPackages.join( "|" ) })[/\\\\]).*/` ) );
				// Special case for the Yarn link situation.
				// match.loader.include.push( /wordpress-seo[/\\]packages[/\\].*/ );
			} );

			return webpackConfig;
		},
	},
};
