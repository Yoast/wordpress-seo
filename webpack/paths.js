/* global require, module */
const path = require( "path" );

const jsDistPath = path.resolve( "js", "dist" );
const jsSrcPath = path.resolve( "js", "src" );
const cssDistPath = path.resolve( "css", "dist" );

// Output filename: Entry file (relative to jsSrcPath)
const entry = {
	"configuration-wizard": "./configuration-wizard.js",
	"help-scout-beacon": "./help-scout-beacon.js",
	"post-edit": "./post-edit.js",
	"term-edit": "./term-edit.js",
	"settings": "./settings.js",
	"wp-seo-dashboard-widget": "./wp-seo-dashboard-widget.js",
	"wp-seo-modal": "./wp-seo-modal.js",
	"wp-seo-structured-data-blocks": "./wp-seo-structured-data-blocks.js",

	"wp-seo-admin-global": "./wp-seo-admin-global.js",
	"wp-seo-admin-gsc": "./wp-seo-admin-gsc.js",
	"wp-seo-bulk-editor": "./wp-seo-bulk-editor.js",
	"wp-seo-edit-page": "./wp-seo-edit-page.js",
	"wp-seo-recalculate": "./wp-seo-recalculate.js",
	"wp-seo-reindex-links": "./wp-seo-reindex-links.js",
	"wp-seo-api": "./wp-seo-api.js",
	"wp-seo-filter-explanation": "./wp-seo-filter-explanation.js",
	"wp-seo-quick-edit-handler": "./wp-seo-quick-edit-handler.js",
	"wp-seo-network-admin": "./wp-seo-network-admin.js",
	"wp-seo-indexation": "./wp-seo-indexation.js",
};

/**
 * Flattens a version for usage in a filename.
 *
 * @param {string} version The version to flatten.
 *
 * @returns {string} The flattened version.
 */
function flattenVersionForFile( version ) {
	const versionParts = version.split( "." );
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
