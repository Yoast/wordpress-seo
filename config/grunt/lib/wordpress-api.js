const fetch = require( "node-fetch" );

/**
 * Gets stable version for a WordPress plugin from the wordpress api.
 *
 * @param {string} pluginSlug The name of the plugin .
 *
 * @returns {Promise<object|null>} A promise resolving to a single milestone.
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

module.exports = getPluginStableVersionFromWordPressApi;
