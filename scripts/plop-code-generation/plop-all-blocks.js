/* External dependencies */
const nodePlop = require( "node-plop" );
const path = require( "path" );
const ora = require( "ora" );
const chalk = require( "chalk" );
const flatMap = require( "lodash/flatMap" );

/* Internal dependencies */
const configuration = require( "./configuration.js" );

const generators = flatMap( configuration, ( definitions, path ) => {
	return flatMap( definitions, definition => {
		return definition[ "@type" ];
	} );
} ).filter( Boolean );

// Load an instance of plop from a plopfile
const plop = nodePlop( path.join( __dirname, "../..", "./plopfile.js" ) );

const typeDisplay = {
	"function": chalk.yellow( "->" ),
	add: chalk.green( "++" ),
	addMany: chalk.green( "+!" ),
	modify: `${chalk.green( "+" )}${chalk.red( "-" )}`,
	append: chalk.green( "_+" ),
};
const typeMap = ( name, noMap ) => {
	const dimType = chalk.dim( name );
	return ( noMap ? dimType : typeDisplay[ name ] || dimType );
};

// Do something after the actions have run
const progress = ora();
const onComment = ( msg ) => {
	progress.info( msg ); progress.start();
};

const onSuccess = ( change ) => {
	let line = "";
	if ( change.type ) {
		line += ` ${typeMap( change.type )}`;
	}
	if ( change.path ) {
		line += ` ${change.path}`;
	}
	progress.succeed( line ); progress.start();
};

const onFailure = ( fail ) => {
	let line = "";
	if ( fail.type ) {
		line += ` ${typeMap( fail.type )}`;
	}
	if ( fail.path ) {
		line += ` ${fail.path}`;
	}
	const errMsg = fail.error || fail.message;
	if ( errMsg ) {
		line += ` ${errMsg}`;
	}
	progress.fail( line ); progress.start();
};

progress.start();

const results = generators.map( ( generatorName ) => {
	const generator = plop.getGenerator( "structural-blocks-" + generatorName );

	return generator.runActions( {}, { onSuccess, onFailure, onComment } );
} );

Promise.all( results )
	.then( () => {
		const generator = plop.getGenerator( "structural-blocks-list" );

		return generator.runActions( {}, { onSuccess, onFailure, onComment } );
	} )
	.then( () => {
		progress.stop();
	} );

