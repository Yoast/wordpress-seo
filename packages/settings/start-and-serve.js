const { shell } = require( "@pawelgalazka/shell" );

// Do we want the QA config wrapper?
if ( process.argv.slice( 2 ).includes( "--qa" ) ) {
	// eslint-disable-next-line no-console
	console.log( "Starting the Settings UI with a QA wrapper..." );
	shell( "yarn watch:qa", { async: true } );
	shell( "yarn serve", { async: true } );
} else {
	// Add --webpack-no-externals to start a standalone bundle, without wordpress default externals.
	shell( "yarn watch:dev", { async: true } );
	shell( "yarn serve", { async: true } );
}
