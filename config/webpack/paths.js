const path = require( "path" );

const jsDistPath = path.resolve( "js", "dist" );
const jsSrcPath = path.resolve( "packages", "js", "src" );
const cssDistPath = path.resolve( "css", "dist" );

// Output filename: Entry file (relative to jsSrcPath)
const entry = {
	"addon-installation": "./packages/js/src/addon-installation.js",
	"admin-global": "./packages/js/src/admin-global.js",
	"admin-modules": "./packages/js/src/admin-modules.js",
	"analysis-worker": "./packages/js/src/analysis-worker.js",
	"api-client": "./packages/js/src/api-client.js",
	"block-editor": "./packages/js/src/block-editor.js",
	"bulk-editor": "./packages/js/src/bulk-editor.js",
	"schema-blocks": "./packages/js/src/schema-blocks.js",
	"classic-editor": "./packages/js/src/classic-editor.js",
	"configuration-wizard": "./packages/js/src/configuration-wizard.js",
	"dashboard-widget": "./packages/js/src/dashboard-widget.js",
	"dynamic-blocks": "./packages/js/src/dynamic-blocks.js",
	"edit-page": "./packages/js/src/edit-page.js",
	"editor-modules": "./packages/js/src/editor-modules.js",
	elementor: "./packages/js/src/elementor.js",
	"filter-explanation": "./packages/js/src/filter-explanation.js",
	"help-scout-beacon": "./packages/js/src/help-scout-beacon.js",
	indexation: "./packages/js/src/indexation.js",
	"import": "./packages/js/src/import.js",
	"network-admin": "./packages/js/src/network-admin.js",
	"post-edit": "./packages/js/src/post-edit.js",
	"quick-edit-handler": "./packages/js/src/quick-edit-handler.js",
	"reindex-links": "./packages/js/src/reindex-links.js",
	settings: "./packages/js/src/settings.js",
	"structured-data-blocks": "./packages/js/src/structured-data-blocks.js",
	"term-edit": "./packages/js/src/term-edit.js",
	"used-keywords-assessment": "./packages/js/src/used-keywords-assessment.js",
	"react-select": "./packages/js/src/externals/react-select.js",
	workouts: "./packages/js/src/workouts.js",
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
