/**
 * A task which deploys the recalibration files to MyYoast.
 *
 * @param {Object} grunt The grunt helper object.
 *
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"publish-recalibration",
		"Deploys the recalibration files to My Yoast.",
		function() {
			// Read the versions from the package.json file.
			const packageJson = grunt.file.readJSON( "./package.json" );
			const recalibrationVersion = parseInt( packageJson.yoast.recalibrationVersion, 10 );
			const pluginVersion = { package: packageJson.yoast.pluginVersion };

			// For the filename the dots need to be stripped.
			pluginVersion.dotless = pluginVersion.package.replace( ".", "" );

			// Plugin version should be in the form of `X.X`.
			const pluginMatch = pluginVersion.package.match( /^\d+\.\d+/ );
			if ( pluginMatch.length < 1 ) {
				grunt.log.error( "Plugin version is not valid. Should start with X.X where X is a digit." );
				return;
			}

			// Use the first match as prefix.
			const version = pluginMatch[ 0 ] + "." + recalibrationVersion;
			grunt.verbose.write( "Recalibration version " );
			grunt.verbose.ok( version );
			grunt.verbose.writeln();

			// Populate the tasks array with exec:deployToMyYoast commands.
			const tasks = [];
			const entries = [
				{
					name: "analysis-worker",
					file: "wp-seo-analysis-worker",
				}, {
					name: "analysis",
					file: "analysis",
				},
			];
			entries.forEach( function( entry ) {
				// Create the filename.
				const filename = "./js/dist/" + entry.file + "-" + pluginVersion.dotless + ".min.js";

				grunt.verbose.writeln( "Entry", entry.name );
				grunt.verbose.writeln( "File:", filename );

				// Sanity check before adding to the tasks.
				if ( grunt.file.exists( filename ) ) {
					tasks.push( [ "exec:deployToMyYoast", entry.name, filename, version ].join( ":" ) );
					grunt.verbose.ok();
				} else {
					grunt.verbose.error();
				}
				grunt.verbose.writeln();
			} );

			grunt.task.run( tasks );
		}
	);
};
