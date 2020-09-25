const wordpressApi = require( "../lib/wordpress-api" );

/*
 * Checks if the stable tag in the readme.txt is set to the version currently on wordpress.org and aborts the RC release process if not so.
 *
 * @param {Object} grunt The grunt helper object.
 *
 * @returns {void}
 */
module.exports = function( grunt ) {
	grunt.registerTask(
		"check-deploy-allowed",
		"Checks if the stable tag in the readme.txt is set to the version currently on wordpress.org and aborts the release process if not so.",
		async function() {
			var done = this.async();
			const stableVerion = await wordpressApi.getPluginStableVersionFromWordPressApi( grunt.config.data.pluginSlug );
			if ( stableVerion === null ){
				grunt.fail.fatal(
					"The Stable tag for plugin: " + grunt.config.data.pluginSlug + " could not be retrieved from api.wordpress.org\n" +
					"The release process has been stopped."
				);
			}
			grunt.verbose.writeln( "Worpress api stable tag verion: " + stableVerion + " for plugin: " + grunt.config.data.pluginSlug )
			let contents = grunt.file.read( "readme.txt" );
			contents = contents.split( "\n" ).slice( 0, 9 ).join( "\n" );
            grunt.verbose.writeln("first 10 lines of readme.txt file: \n"+ contents );
			const regex = new RegExp( "\nStable tag: " + stableVerion + "\n" );
			const notVersionMatch = contents.search( regex ) == -1;
			if ( notVersionMatch ) {
				grunt.fail.fatal(
					"The Stable tag specified in the readme.txt file is not set to the stable tag curently on wordpress: " + stableVerion + ". There for you cannot deploy with this readme.txt file.\n" +
					"The release process has been stopped."
				);
			};
			done();
		}
	);
};
