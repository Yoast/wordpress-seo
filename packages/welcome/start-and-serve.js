const { shell } = require( "@pawelgalazka/shell" );

// Add --webpack-no-externals to start a standalone bundle, without wordpress default externals.
shell( "yarn watch:dev", { async: true } );
shell( "yarn serve", { async: true } );
