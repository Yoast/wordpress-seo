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
 * tab panels. The panels hold placeholders until the field-set data table (Free-FE 4) plugs in; that is also
 * when the data providers re-enter the component tree.
 *
 * @returns {JSX.Element} The app.
 */
const App = () => {
	const tabs = useMemo( () => [
		{ id: FIELD_SET_SEARCH, label: __( "Search appearance", "wordpress-seo" ) },
		{ id: FIELD_SET_SOCIAL, label: __( "Social appearance", "wordpress-seo" ) },
	], [] );
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );
	const { setActiveFieldSet } = useDispatch( STORE_NAME );

	return (
		<div className="yst-p-8 yst-space-y-8 yst-max-w-7xl">
			<Paper>
				<BulkEditorPageHeader
					title={ __( "Bulk editor", "wordpress-seo" ) }
					description={ __( "Quickly make changes to the search and social appearance of your content.", "wordpress-seo" ) }
				/>
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
