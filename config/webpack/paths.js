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
	"classic-editor": `${ sourceDirectory }/classic-editor.js`,
	"crawl-settings": `${ sourceDirectory }/crawl-settings.js`,
	"dashboard-widget": `${ sourceDirectory }/dashboard-widget.js`,
	"wincher-dashboard-widget": `${ sourceDirectory }/wincher-dashboard-widget.js`,
	"dynamic-blocks": `${ sourceDirectory }/dynamic-blocks.js`,
	"edit-page": `${ sourceDirectory }/edit-page.js`,
	"editor-modules": `${ sourceDirectory }/editor-modules.js`,
	elementor: `${ sourceDirectory }/elementor/initialize.js`,
	"externals-components": `${ sourceDirectory }/externals/components.js`,
	"externals-contexts": `${ sourceDirectory }/externals/contexts.js`,
	"externals-redux": `${ sourceDirectory }/externals/redux.js`,
	"filter-explanation": `${ sourceDirectory }/filter-explanation.js`,
	"help-scout-beacon": `${ sourceDirectory }/help-scout-beacon.js`,
	"import": `${ sourceDirectory }/import.js`,
	indexation: `${ sourceDirectory }/indexation.js`,
	"installation-success": `${ sourceDirectory }/installation-success.js`,
	"integrations-page": `${ sourceDirectory }/integrations-page.js`,
	introductions: `${ sourceDirectory }/introductions/initialize.js`,
	"network-admin": `${ sourceDirectory }/network-admin.js`,
	"post-edit": `${ sourceDirectory }/post-edit.js`,
	"quick-edit-handler": `${ sourceDirectory }/quick-edit-handler.js`,
	"reindex-links": `${ sourceDirectory }/reindex-links.js`,
	"redirect-old-features-tab": `${ sourceDirectory }/redirect-old-features-tab.js`,
	settings: `${ sourceDirectory }/settings.js`,
	"new-settings": `${ sourceDirectory }/settings/initialize.js`,
	academy: `${ sourceDirectory }/academy/initialize.js`,
	"general-page": `${ sourceDirectory }/general/initialize.js`,
	support: `${ sourceDirectory }/support/initialize.js`,
	"how-to-block": `${ sourceDirectory }/structured-data-blocks/how-to/block.js`,
	"faq-block": `${ sourceDirectory }/structured-data-blocks/faq/block.js`,
	"term-edit": `${ sourceDirectory }/term-edit.js`,
	"used-keywords-assessment": `${ sourceDirectory }/used-keywords-assessment.js`,
	"react-select": `${ sourceDirectory }/externals/react-select.js`,
	workouts: `${ sourceDirectory }/workouts.js`,
	"frontend-inspector-resources": `${ sourceDirectory }/frontend-inspector-resources.js`,
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
	flattenVersionForFile,
};
