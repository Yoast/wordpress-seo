import { useDispatch, useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Paper } from "@yoast/ui-library";
import { FIELD_SET_SEARCH, FIELD_SET_SOCIAL, STORE_NAME } from "../constants";
import { BulkEditorTabPanel, BulkEditorTabs } from "./bulk-editor-tabs";

/**
 * The placeholder content of a tab panel.
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
 * The bulk editor content: the Search/Social appearance tab bar and the tab panels.
 *
 * @returns {JSX.Element} The content.
 */
export const BulkEditorContent = () => {
	const tabs = useMemo( () => [
		{ id: FIELD_SET_SEARCH, label: __( "Search appearance", "wordpress-seo" ) },
		{ id: FIELD_SET_SOCIAL, label: __( "Social appearance", "wordpress-seo" ) },
	], [] );
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );
	const { setActiveFieldSet } = useDispatch( STORE_NAME );

	return (
		<>
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
		</>
	);
};
