/* global require, module */
const path = require( "path" );

const jsDistPath = path.resolve( "js", "dist" );
const jsSrcPath = path.resolve( "js", "src" );
const cssDistPath = path.resolve( "css", "dist" );

// Output filename: Entry file (relative to jsSrcPath)
const entryAll = {
	"yoast-premium-site-wide-analysis.js": "assets/js/src/site-wide-analysis.js",
	"yoast-premium-social-preview.js": "assets/js/src/yoast-premium-social-preview.js",
	"wpseo-premium-contact-support.js": "assets/js/src/contact-support.js",
	"wp-seo-premium-admin-redirects.js": "assets/js/src/admin-redirects.js",
	"wp-seo-premium-custom-fields-plugin.js": "assets/js/src/custom-fields-plugin.js",
	"wp-seo-premium-quickedit-notification.js": "assets/js/src/quickedit-notification.js",
	"wp-seo-premium-redirect-notifications.js": "assets/js/src/redirect-notifications.js",
	"yoast-premium-gsc.js": "assets/js/src/google-search-console.js",
	"wp-seo-premium-metabox.js": "assets/js/src/metabox.js",
};

// Output filename: Entry file (relative to jsSrcPath)
const entry = {
	vendor: [
		"react",
		"react-dom",
		"styled-components",
	],
	"configuration-wizard": "./configuration-wizard.js",
	"search-appearance": "./search-appearance.js",
	"wp-seo-dashboard-widget": "./wp-seo-dashboard-widget.js",
	"wp-seo-help-center": "./wp-seo-help-center.js",
	"wp-seo-metabox": "./wp-seo-metabox.js",
	"wp-seo-post-scraper": "./wp-seo-post-scraper.js",
	"wp-seo-term-scraper": "./wp-seo-term-scraper.js",
	"wp-seo-modal": "./wp-seo-modal.js",
	"wp-seo-wp-globals-backport": "./wp-seo-wp-globals-backport.js",
	"wp-seo-replacevar-plugin": "./wp-seo-replacevar-plugin.js",
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
	entryAll,
	jsDist: jsDistPath,
	jsSrc: jsSrcPath,
	cssDist: cssDistPath,
	select2: path.resolve( "node_modules", "select2", "dist" ),
	flattenVersionForFile,
};
