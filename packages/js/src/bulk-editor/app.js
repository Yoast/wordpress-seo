import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Paper } from "@yoast/ui-library";
import { BulkEditorNav } from "./components/bulk-editor-nav";
import { BulkEditorPageHeader } from "./components/bulk-editor-page-header";
import { BulkEditorTabPanel, BulkEditorTabs } from "./components/bulk-editor-tabs";
import { FIELD_SET_SEARCH, FIELD_SET_SOCIAL, STORE_NAME } from "./constants";

/**
 * The placeholder content of a tab panel, until the field-set data table (Free-FE 4) lands here.
 *
 * @param {string} label The tab label.
 *
 * @returns {string} The placeholder text.
 */
const getPanelPlaceholder = ( label ) => {
	/* translators: %s expands to the tab label, e.g. "Search appearance". */
	return sprintf( __( "The %s fields will be editable here.", "wordpress-seo" ), label );
};

/**
 * Builds the header copy for a content type, following the design's wording.
 *
 * @param {Object} [contentType] The content type ({ id, label }), if any.
 *
 * @returns {{title: string, description: string}} The header title and description.
 */
const getHeaderCopy = ( contentType ) => {
	const label = contentType ? contentType.label : __( "Content", "wordpress-seo" );
	const lowercaseLabel = label.toLowerCase();

	return {
		/* translators: %s expands to the content type label, e.g. "Pages". */
		title: sprintf( __( "Bulk editor: %s", "wordpress-seo" ), label ),
		description: sprintf(
			/* translators: %1$s and %2$s expand to the lowercase content type label, e.g. "pages". */
			__( "The bulk editor for %1$s is a tool that you can use to quickly make changes to your search and social media appearance for multiple %2$s.", "wordpress-seo" ),
			lowercaseLabel,
			lowercaseLabel
		),
	};
};

/**
 * The bulk editor app: the content-type sub-navigation, the page header, the Search/Social appearance tabs,
 * and the tab panels. The active content type and field set live in the store.
 *
 * @param {Object}                            props              The props.
 * @param {import("./services").DataProvider} props.dataProvider The data provider.
 *
 * @returns {JSX.Element} The app.
 */
const App = ( { dataProvider } ) => {
	const tabs = useMemo( () => [
		{ id: FIELD_SET_SEARCH, label: __( "Search appearance", "wordpress-seo" ) },
		{ id: FIELD_SET_SOCIAL, label: __( "Social appearance", "wordpress-seo" ) },
	], [] );
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );
	const activeContentTypeName = useSelect( ( select ) => select( STORE_NAME ).selectActiveContentTypeName(), [] );
	const isPremium = useSelect( ( select ) => select( STORE_NAME ).selectPreference( "isPremium", false ), [] );
	const { setActiveFieldSet, setActiveContentType } = useDispatch( STORE_NAME );

	const contentTypes = useMemo(
		() => dataProvider.getContentTypes().map( ( { name, label } ) => ( { id: name, label } ) ),
		[ dataProvider ]
	);
	// An unknown or empty name falls back to the first available content type.
	const activeContentType = contentTypes.find( ( { id } ) => id === activeContentTypeName ) ?? contentTypes[ 0 ];

	const { title, description } = getHeaderCopy( activeContentType );
	// Note: getLink returns "" (not undefined) for unknown links, hence || and not ??.
	const backToToolsUrl = dataProvider.getLink( "tools" ) || "admin.php?page=wpseo_tools";
	const logoHref = dataProvider.getLink( "dashboard" ) || "admin.php?page=wpseo_dashboard";

	return (
		<div className="yst-p-8 yst-flex yst-items-start yst-gap-8 yst-max-w-7xl">
			<div className="yst-w-56 yst-shrink-0">
				<BulkEditorNav
					contentTypes={ contentTypes }
					activeContentType={ activeContentType ? activeContentType.id : "" }
					onChange={ setActiveContentType }
					backToToolsUrl={ backToToolsUrl }
					logoHref={ logoHref }
					isPremium={ isPremium }
				/>
			</div>
			<div className="yst-grow yst-min-w-0 yst-space-y-8">
				<Paper>
					<BulkEditorPageHeader title={ title } description={ description } />
				</Paper>
				<BulkEditorTabs
					tabs={ tabs }
					activeTab={ activeFieldSet }
					onChange={ setActiveFieldSet }
					label={ __( "Bulk editor views", "wordpress-seo" ) }
				/>
				{ tabs.map( ( tab ) => (
					<BulkEditorTabPanel key={ tab.id } tabId={ tab.id } isActive={ tab.id === activeFieldSet }>
						<Paper className="yst-p-8">
							<p className="yst-text-slate-500">{ getPanelPlaceholder( tab.label ) }</p>
						</Paper>
					</BulkEditorTabPanel>
				) ) }
			</div>
		</div>
	);
};

export default App;
