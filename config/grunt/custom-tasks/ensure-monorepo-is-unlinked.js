const fs = require( "fs" );
const childProcess = require( "child_process" );

/**
 * Ensures that the monorepo is unlinked when creating an RC.
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"ensure-monorepo-is-unlinked",
		"Ensures the monorepo is unlinked",
		function() {
			let files = fs
				.readdirSync( "./node_modules/@yoast" )
				.map( file => `./node_modules/@yoast/${ file }` );

			files = [
				...files,
				"./node_modules/yoast-components",
				"./node_modules/yoastseo",
			];


			for ( let i = 0; i < files.length; i++ ) {
				const file = files[ i ];

				if ( ! fs.existsSync( file ) ) {
					grunt.log.warn( `Package ${ file } not found, continuing normally.` );
					continue;
				}

				const stat = fs.lstatSync( file );

				if ( stat.isSymbolicLink() ) {
					grunt.log.ok( "Detected linked package, unlinking monorepo." );

					try {
						childProcess.execSync( "yarn unlink-monorepo" );
						grunt.log.ok( "Unlinked monorepo successfully!" );
					} catch ( e ) {
						grunt.fail.fatal( "Failed unlinking the monorepo, please unlink manually." );
					}
					return true;
				}
			}

			grunt.log.ok( "Found no linked packages." );
		}
	);
};
