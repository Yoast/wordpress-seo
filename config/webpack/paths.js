const path = require( "path" );

const jsDistPath = path.resolve( "js", "dist" );
const jsSrcPath = path.resolve( "packages", "js", "src" );
const cssDistPath = path.resolve( "css", "dist" );

// Output filename: Entry file (relative to jsSrcPath)
const entry = {
	"addon-installation": "./packages/js/build/addon-installation.js",
	"admin-global": "./packages/js/build/admin-global.js",
	"admin-modules": "./packages/js/build/admin-modules.js",
	"analysis-worker": "./packages/js/build/analysis-worker.js",
	"api-client": "./packages/js/build/api-client.js",
	"block-editor": "./packages/js/build/block-editor.js",
	"bulk-editor": "./packages/js/build/bulk-editor.js",
	"schema-blocks": "./packages/js/build/schema-blocks.js",
	"classic-editor": "./packages/js/build/classic-editor.js",
	"dashboard-widget": "./packages/js/build/dashboard-widget.js",
	"dynamic-blocks": "./packages/js/build/dynamic-blocks.js",
	"edit-page": "./packages/js/build/edit-page.js",
	"editor-modules": "./packages/js/build/editor-modules.js",
	elementor: "./packages/js/build/elementor.js",
	"externals-components": "./packages/js/build/externals/components.js",
	"externals-contexts": "./packages/js/build/externals/contexts.js",
	"externals-redux": "./packages/js/build/externals/redux.js",
	"filter-explanation": "./packages/js/build/filter-explanation.js",
	"help-scout-beacon": "./packages/js/build/help-scout-beacon.js",
	"import": "./packages/js/build/import.js",
	indexation: "./packages/js/build/indexation.js",
	"installation-success": "./packages/js/build/installation-success.js",
	"network-admin": "./packages/js/build/network-admin.js",
	"post-edit": "./packages/js/build/post-edit.js",
	"quick-edit-handler": "./packages/js/build/quick-edit-handler.js",
	"reindex-links": "./packages/js/build/reindex-links.js",
	settings: "./packages/js/build/settings.js",
	"structured-data-blocks": "./packages/js/build/structured-data-blocks.js",
	"term-edit": "./packages/js/build/term-edit.js",
	"used-keywords-assessment": "./packages/js/build/used-keywords-assessment.js",
	"react-select": "./packages/js/build/externals/react-select.js",
	workouts: "./packages/js/build/workouts.js",
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
