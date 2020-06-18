/* global require, module */
const path = require( "path" );

const jsDistPath = path.resolve( "js", "dist" );
const jsSrcPath = path.resolve( "js", "src" );
const cssDistPath = path.resolve( "css", "dist" );

// Output filename: Entry file (relative to jsSrcPath)
const entry = {
	"admin-global": "./admin-global.js",
	"api-client": "./api-client.js",
	"bulk-editor": "./bulk-editor.js",
	"configuration-wizard": "./configuration-wizard.js",
	"dashboard-widget": "./dashboard-widget.js",
	"edit-page": "./edit-page.js",
	"filter-explanation": "./filter-explanation.js",
	"help-scout-beacon": "./help-scout-beacon.js",
	"indexation": "./indexation.js",
	"modal": "./modal.js",
	"network-admin": "./network-admin.js",
	"post-edit": "./post-edit.js",
	"quick-edit-handler": "./quick-edit-handler.js",
	"recalculate": "./recalculate.js",
	"reindex-links": "./reindex-links.js",
	"settings": "./settings.js",
	"structured-data-blocks": "./structured-data-blocks.js",
	"term-edit": "./term-edit.js",
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
