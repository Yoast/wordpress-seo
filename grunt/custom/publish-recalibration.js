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

			// Plugin version should be in the form of `X.X.X` or `X.X` or `X`.
			const pluginMatch = pluginVersion.package.match( /^\d+.\d+.\d+|^\d+\.\d+|^\d+/ );
			if ( pluginMatch.length < 1 ) {
				grunt.log.error( "Plugin version is not valid. Should be in the form X.X.X or X.X or X where X is a digit." );
				return;
			}
			// Use the first match as plugin version.
			pluginVersion.extended = pluginMatch[ 0 ];
			// Ensure we always have X.X.X - fill with .0 if needed.
			while ( pluginVersion.extended.split( "." ).length < 3 ) {
				pluginVersion.extended += ".0";
			}
			// For the file the dots need to be stripped.
			pluginVersion.dotless = pluginVersion.package.replace( ".", "" );

			// Join the versions for the publish version of recalibration.
			const version = pluginVersion.extended + "." + recalibrationVersion;
			grunt.verbose.write( "Recalibration version " );
			grunt.verbose.ok( version );
			grunt.verbose.writeln();

			// Populate the tasks array with exec:deployToMyYoast commands.
			const tasks = [];
			const entries = [ "wp-seo-analysis-worker", "analysis" ];
			entries.forEach( function( entry ) {
				// Transform the entry to a MyYoast name & plugin file.
				const name = entry + "-" + version + ".min.js";
				const file = "./js/dist/" + entry + "-" + pluginVersion.dotless + ".min.js";

				grunt.verbose.writeln( "Entry", entry );
				grunt.verbose.writeln( "URL: ", name );
				grunt.verbose.writeln( "File:", file );

				// Sanity check before adding to the tasks.
				if ( grunt.file.exists( file ) ) {
					tasks.push( [ "exec:deployToMyYoast", name, file ].join( ":" ) );
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
