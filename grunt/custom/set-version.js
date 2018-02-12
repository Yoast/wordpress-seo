/**
 * A task that updates version numbers in project files in accordance with
 * build config.
 *
 * @param {Object} grunt The grunt helper object.
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerMultiTask(
		"set-version",
		"Configures a new version number.",
		function() {
			let options = this.options(
				{
					base: "Option to use as a base",
					target: "Target value to set"
				}
			);

			var version = grunt.option( "new-version" ) || '';
			if ( version.toString().trim().length === 0 ) {
				grunt.fail.fatal( 'Missing --new-version argument' );
			}

			this.files.forEach( (file) => {
				file.src.forEach( (path) => {
					let contents = grunt.file.readJSON( path );
					contents[ options.base ][ options.target ] = version.toString();
					grunt.file.write( path, JSON.stringify( contents, null, '  ' ) + "\n" );
				} );
			} );
		}
	);
}
