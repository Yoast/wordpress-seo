const fetch = require( "node-fetch" );

/**
 * Gets stable version for a WordPress plugin from the WordPress API.
 *
 * @param {string} pluginSlug The name of the plugin.
 *
 * @returns {Promise<object|null>} A promise resolving to the version.
 */
async function getPluginStableVersionFromWordPressApi( pluginSlug ) {
	pluginSlug = pluginSlug.toLowerCase();
	const wordpressResponse = await fetch( `https://api.wordpress.org/plugins/info/1.0/${ pluginSlug }.json` );
	if ( ! wordpressResponse.ok ) {
		return null;
	}
	const ResponseJson = await wordpressResponse.json();
	return ResponseJson.version || null;
}

module.exports.getPluginStableVersionFromWordPressApi = getPluginStableVersionFromWordPressApi;

/**
 * Gets the latest WordPress version from the WordPress API.
 *
 * @returns {Promise<object|null>} A promise resolving to the version.
 */
async function getLatestWordpressFromWordPressApi() {
	const wordpressResponse = await fetch( "http://api.wordpress.org/core/version-check/1.7/" );
	if ( ! wordpressResponse.ok ) {
		return null;
	}
	const ResponseJson = await wordpressResponse.json();
	return ResponseJson.offers[ 0 ].version || null;
}

module.exports.getLatestWordpressFromWordPressApi = getLatestWordpressFromWordPressApi;
