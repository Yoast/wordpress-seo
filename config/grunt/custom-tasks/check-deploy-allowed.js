const getPluginStableVersionFromWordPressApi = require( "../lib/wordpress-api" );

/*
 * Checks if the stable tag is an RC version and aborts the release process if so.
 *
 * @param {Object} grunt The grunt helper object.
 *
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"check-deploy-allowed",
		"Checks if the stable tag is an RC version and aborts the release process if so.",
		async function() {
			var done = this.async();
			const stableVerion = await getPluginStableVersionFromWordPressApi( grunt.config.data.pluginSlug );
			grunt.verbose.writeln( "Worpress returned this stable verion: " + stableVerion + " for plugin: " + grunt.config.data.pluginSlug )
			let contents = grunt.file.read( "readme.txt" );
			contents = contents.split( "\n" ).slice( 0, 9 ).join( "\n" );
            grunt.verbose.writeln("first 10 lines of readme.txt file: \n"+ contents );
			const regex = new RegExp( "\nStable tag: " + stableVerion + "\n" );
			const notVersionMatch = contents.search( regex ) == -1;
			if ( notVersionMatch ) {
				grunt.fail.fatal(
					"The Stable tag specified in the readme.txt file is not set to the stable tag curently on wordpress " + stableVerion + ". You cannot deploy with this " +
					"The release process has been stopped."
				);
			};
			done();
		}
	);
};
