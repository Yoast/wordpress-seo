import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Paper } from "@yoast/ui-library";
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
 * The bulk editor app: the page header, the Search/Social appearance tabs (active tab in the store), and the
 * tab panels. The panels hold placeholders until the field-set data table (Free-FE 4) plugs in.
 *
 * @param {Object}                              props              The props.
 * @param {import("./services").DataProvider}   props.dataProvider The data provider.
 *
 * @returns {JSX.Element} The app.
 */
/**
 * Builds the header copy for a content type, following the design's wording.
 *
 * @param {Object} [contentType] The content type ({ name, label }), if any.
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

const App = ( { dataProvider } ) => {
	const tabs = useMemo( () => [
		{ id: FIELD_SET_SEARCH, label: __( "Search appearance", "wordpress-seo" ) },
		{ id: FIELD_SET_SOCIAL, label: __( "Social appearance", "wordpress-seo" ) },
	], [] );
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );
	const { setActiveFieldSet } = useDispatch( STORE_NAME );

	// Until the content-type navigation (Free-FE 3) drives the selection, the first content type is shown.
	const { title, description } = getHeaderCopy( dataProvider.getContentTypes()[ 0 ] );

	return (
		<div className="yst-p-8 yst-space-y-8 yst-max-w-7xl">
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
	);
};

export default App;
