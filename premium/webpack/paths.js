/* global require, module */
const path = require( "path" );

const jsDistPath = path.resolve( "assets", "js", "dist" );
const jsSrcPath = path.resolve( "assets", "js", "src" );
const cssDistPath = path.resolve( "css", "dist" );

// Output filename: Entry file (relative to jsSrcPath)
const entry = {
	"yoast-premium-site-wide-analysis": "./site-wide-analysis.js",
	"yoast-premium-social-preview": "./yoast-premium-social-preview.js",
	"wpseo-premium-contact-support": "./contact-support.js",
	"wp-seo-premium-admin-redirects": "./admin-redirects.js",
	"wp-seo-premium-custom-fields-plugin": "./custom-fields-plugin.js",
	"wp-seo-premium-quickedit-notification": "./quickedit-notification.js",
	"wp-seo-premium-redirect-notifications": "./redirect-notifications.js",
	"yoast-premium-gsc": "./google-search-console.js",
	"wp-seo-premium-metabox": "./metabox.js",
};
/**
 * Flattens a version for usage in a filename.
 *
 * @param {string} version The version to flatten.
 *
 * @returns {string} The flattened version.
 */
function flattenVersionForFile( version ) {
	let versionParts = version.split( "." );
	if ( versionParts.length === 2 && /^\d+$/.test( versionParts[ 1 ] ) ) {
		versionParts.push( 0 );
	}

	return versionParts.join( "" );
}

module.exports = {
	entry,
	jsDist: jsDistPath,
	jsSrc: jsSrcPath,
	cssDist: cssDistPath,
	select2: path.resolve( "node_modules", "select2", "dist" ),
	flattenVersionForFile,
};
