/* global require, module */
const path = require( "path" );

const jsDistPath = path.resolve( "js", "dist" );
const jsSrcPath = path.resolve( "js", "src" );
const cssDistPath = path.resolve( "css", "dist" );

// Output filename: Entry file (relative to jsSrcPath)
const entry = {
	"admin-global": "./js/src/admin-global.js",
	"analysis-worker": "./js/src/analysis-worker.js",
	"api-client": "./js/src/api-client.js",
	"block-editor": "./js/src/block-editor.js",
	"bulk-editor": "./js/src/bulk-editor.js",
	"schema-blocks": "./js/src/schema-blocks.js",
	"classic-editor": "./js/src/classic-editor.js",
	"configuration-wizard": "./js/src/configuration-wizard.js",
	"dashboard-widget": "./js/src/dashboard-widget.js",
	"dynamic-blocks": "./js/src/dynamic-blocks.js",
	"edit-page": "./js/src/edit-page.js",
	"editor-modules": "./js/src/editor-modules.js",
	"elementor": "./js/src/elementor.js",
	"filter-explanation": "./js/src/filter-explanation.js",
	"help-scout-beacon": "./js/src/help-scout-beacon.js",
	indexation: "./js/src/indexation.js",
	"network-admin": "./js/src/network-admin.js",
	"post-edit": "./js/src/post-edit.js",
	"quick-edit-handler": "./js/src/quick-edit-handler.js",
	"reindex-links": "./js/src/reindex-links.js",
	settings: "./js/src/settings.js",
	"structured-data-blocks": "./js/src/structured-data-blocks.js",
	"term-edit": "./js/src/term-edit.js",
	"used-keywords-assessment": "./js/src/used-keywords-assessment.js",
	"react-select": "./js/src/externals/react-select.js",
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
