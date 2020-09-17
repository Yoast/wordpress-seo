const wordpressApi = require( "../lib/wordpress-api" );

/**
 * Gets stable version for a WordPress plugin from the wordpress api.
 *
 * @param {string} pluginSlug The name of the plugin .
 *
 * @returns {Promise<object|null>} A promise resolving to a single milestone.
 */

async function getPluginStableVersionFromWordPressApi( pluginSlug ) {
	pluginSlug = pluginSlug.toLowerCase();
	const wordpressResponse = await wordpressApi( `plugins/info/1.0/${ pluginSlug }.json` );
	if ( ! wordpressResponse.ok ) {
		return null;
	}
	const ResponseJson = await wordpressResponse.json();
	return ResponseJson.version || null;
}

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
			const contents = grunt.file.read( "readme.txt" );
			const regex = new RegExp( "Stable tag: .*-RC.*" );
			const isRCVersion = contents.search( regex ) !== -1;
			if ( isRCVersion ) {
				grunt.fail.fatal(
					"The Stable tag specified in the readme.txt file contains RC tag. You cannot deploy an RC version. " +
					"The release process has been stopped."
				);
			};
			const pluginSlug = 'wordpress-seo';
			var done = this.async();
			const tmp = await getPluginStableVersionFromWordPressApi( pluginSlug );
			console.log ( tmp )
		 	done();
		}
	);
};
