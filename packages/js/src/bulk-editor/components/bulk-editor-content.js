import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { STORE_NAME } from "../constants";
import { getFieldSets } from "../field-sets";
import { getMockRows } from "../services/mock-rows";
import { BulkEditorTable } from "./bulk-editor-table";
import { BulkEditorTabPanel, BulkEditorTabs } from "./bulk-editor-tabs";

/**
 * The bulk editor content: the Search/Social appearance tab bar and the tab panels with the field-set table.
 *
 * @returns {JSX.Element} The content.
 */
export const BulkEditorContent = () => {
	const fieldSets = useMemo( () => getFieldSets(), [] );
	const tabs = useMemo(
		() => Object.values( fieldSets ).map( ( { id, label } ) => ( { id, label } ) ),
		[ fieldSets ]
	);
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );
	const activeContentType = useSelect( ( select ) => select( STORE_NAME ).selectActiveContentTypeName(), [] );
	const selectedIds = useSelect( ( select ) => select( STORE_NAME ).selectSelectedIds(), [] );
	const { setActiveFieldSet, toggleRow, selectAll, deselectAll } = useDispatch( STORE_NAME );

	// TEMPORARY fixture items until the list endpoint feeds the table through the provider.
	const items = useMemo( () => getMockRows(), [] );

	useEffect( () => {
		deselectAll();
	}, [ activeContentType, deselectAll ] );

	const isAllSelected = items.length > 0 && selectedIds.length === items.length;
	const onToggleAll = useCallback(
		() => ( isAllSelected ? deselectAll() : selectAll( items.map( ( item ) => item.id ) ) ),
		[ isAllSelected, deselectAll, selectAll, items ]
	);

	const selection = useMemo( () => ( {
		selectedIds,
		isAllSelected,
		onToggleRow: toggleRow,
		onToggleAll,
	} ), [ selectedIds, isAllSelected, toggleRow, onToggleAll ] );

	return (
		<div className="yst-p-8 yst-space-y-8">
			<BulkEditorTabs
				tabs={ tabs }
				activeTab={ activeFieldSet }
				onChange={ setActiveFieldSet }
				label={ __( "Bulk editor views", "wordpress-seo" ) }
			/>
			{ tabs.map( ( tab ) => (
				<BulkEditorTabPanel key={ tab.id } tabId={ tab.id } isActive={ tab.id === activeFieldSet }>
					<BulkEditorTable items={ items } fieldSet={ fieldSets[ tab.id ] } selection={ selection } />
				</BulkEditorTabPanel>
			) ) }
		</div>
	);
};
