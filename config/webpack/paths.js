const path = require( "path" );

const jsDistPath = path.resolve( "js", "dist" );

/**
 * Composes a list of entries based on the current NODE_ENV mode.
 *
 * @param {string} sourceDirectory The source path.
 *
 * @returns {object} A list of entries.
 */
const getEntries = ( sourceDirectory = "./packages/js/src" ) => ( {
	"addon-installation": `${ sourceDirectory }/addon-installation.js`,
	"admin-global": `${ sourceDirectory }/admin-global.js`,
	"admin-modules": `${ sourceDirectory }/admin-modules.js`,
	"analysis-worker": `${ sourceDirectory }/analysis-worker.js`,
	"api-client": `${ sourceDirectory }/api-client.js`,
	"block-editor": `${ sourceDirectory }/block-editor.js`,
	"bulk-editor": `${ sourceDirectory }/bulk-editor.js`,
	"schema-blocks": `${ sourceDirectory }/schema-blocks.js`,
	"classic-editor": `${ sourceDirectory }/classic-editor.js`,
	"dashboard-widget": `${ sourceDirectory }/dashboard-widget.js`,
	"dynamic-blocks": `${ sourceDirectory }/dynamic-blocks.js`,
	"edit-page": `${ sourceDirectory }/edit-page.js`,
	"editor-modules": `${ sourceDirectory }/editor-modules.js`,
	elementor: `${ sourceDirectory }/elementor.js`,
	"externals-components": `${ sourceDirectory }/externals/components.js`,
	"externals-contexts": `${ sourceDirectory }/externals/contexts.js`,
	"externals-redux": `${ sourceDirectory }/externals/redux.js`,
	"filter-explanation": `${ sourceDirectory }/filter-explanation.js`,
	"first-time-configuration": `${ sourceDirectory }/first-time-configuration.js`,
	"help-scout-beacon": `${ sourceDirectory }/help-scout-beacon.js`,
	"import": `${ sourceDirectory }/import.js`,
	indexation: `${ sourceDirectory }/indexation.js`,
	"installation-success": `${ sourceDirectory }/installation-success.js`,
	"network-admin": `${ sourceDirectory }/network-admin.js`,
	"post-edit": `${ sourceDirectory }/post-edit.js`,
	"quick-edit-handler": `${ sourceDirectory }/quick-edit-handler.js`,
	"reindex-links": `${ sourceDirectory }/reindex-links.js`,
	settings: `${ sourceDirectory }/settings.js`,
	"structured-data-blocks": `${ sourceDirectory }/structured-data-blocks.js`,
	"term-edit": `${ sourceDirectory }/term-edit.js`,
	"used-keywords-assessment": `${ sourceDirectory }/used-keywords-assessment.js`,
	"react-select": `${ sourceDirectory }/externals/react-select.js`,
	workouts: `${ sourceDirectory }/workouts.js`,
	"wordproof-data": "./vendor_prefixed/wordproof/wordpress-sdk/resources/js/data.js",
	"wordproof-uikit": `${ sourceDirectory }/wordproof-uikit.js`,
	"wordproof-block-editor": "./vendor_prefixed/wordproof/wordpress-sdk/resources/js/wordproof-block-editor.js",
	"wordproof-classic-editor": "./vendor_prefixed/wordproof/wordpress-sdk/resources/js/wordproof-classic-editor.js",
	"wordproof-elementor-editor": "./vendor_prefixed/wordproof/wordpress-sdk/resources/js/wordproof-elementor-editor.js",
} );

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
	entry: getEntries(),
	jsDist: jsDistPath,
	select2: path.resolve( "node_modules", "select2", "dist" ),
	flattenVersionForFile,
};
