/* global require, module */
const path = require( "path" );

const jsDistPath = path.resolve( "js", "dist" );
const jsSrcPath = path.resolve( "js", "src" );
const cssDistPath = path.resolve( "css", "dist" );

// Output filename: Entry file (relative to jsSrcPath)
const entry = {
	"configuration-wizard": "./configuration-wizard.js",
	"search-appearance": "./search-appearance.js",
	"wp-seo-dashboard-widget": "./wp-seo-dashboard-widget.js",
	"wp-seo-help-center": "./wp-seo-help-center.js",
	"wp-seo-metabox": "./wp-seo-metabox.js",
	"wp-seo-post-scraper": "./wp-seo-post-scraper.js",
	"wp-seo-term-scraper": "./wp-seo-term-scraper.js",
	"wp-seo-modal": "./wp-seo-modal.js",
	"wp-seo-replacevar-plugin": "./wp-seo-replacevar-plugin.js",
	"wp-seo-structured-data-blocks": "./wp-seo-structured-data-blocks.js",

	"wp-seo-admin-global": "./wp-seo-admin-global.js",
	"wp-seo-admin-gsc": "./wp-seo-admin-gsc.js",
	"wp-seo-admin-media": "./wp-seo-admin-media.js",
	"wp-seo-admin": "./wp-seo-admin.js",
	"wp-seo-bulk-editor": "./wp-seo-bulk-editor.js",
	"wp-seo-edit-page": "./wp-seo-edit-page.js",
	"wp-seo-featured-image": "./wp-seo-featured-image.js",
	"wp-seo-metabox-category": "./wp-seo-metabox-category.js",
	"wp-seo-recalculate": "./wp-seo-recalculate.js",
	"wp-seo-reindex-links": "./wp-seo-reindex-links.js",
	"wp-seo-shortcode-plugin": "./wp-seo-shortcode-plugin.js",
	"wp-seo-api": "./wp-seo-api.js",
	"wp-seo-filter-explanation": "./wp-seo-filter-explanation.js",
	"wp-seo-quick-edit-handler": "./wp-seo-quick-edit-handler.js",
	"wp-seo-network-admin": "./wp-seo-network-admin.js",
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
