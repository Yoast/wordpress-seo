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
		"Deploys the recalibration files to MyYoast.",
		function() {
			// eslint-disable-next-line global-require
			const packageJson = require( "../../package.json" );
			const recalibrationVersion = parseInt( packageJson.yoast.recalibrationVersion, 10 );
			const pluginVersion = packageJson.yoast.pluginVersion;

			// Plugin version should be in the form of `X.X.X` or `X.X` or `X`.
			const pluginMatch = pluginVersion.match( /^\d+.\d+.\d+|^\d+\.\d+|^\d+/ );
			if ( pluginMatch.length < 1 ) {
				console.error( "Plugin version is not valid. Should be in the form X.X.X or X.X or X where X is a digit." );
				return;
			}
			// Ensure we always have X.X.X - fill with .0 if needed.
			let wantedPluginVersion = pluginMatch[ 0 ];
			while ( wantedPluginVersion.split( "." ).length < 3 ) {
				wantedPluginVersion += ".0";
			}

			// Joins the versions to the publish version of recalibration.
			const version = [ wantedPluginVersion, recalibrationVersion ].join( "." );
			console.log( "version:", version );

			const filenames = [ "wp-seo-analysis-worker", "analysis" ];
			filenames.forEach( function( filename ) {
				const name = filename + "-" + version + ".min.js";
				const file = "./js/src/" + filename + pluginVersion + ".min.js";
				grunt.task.run( "exec:deployToMyYoast", name, file );
			} );
		}
	);
};
