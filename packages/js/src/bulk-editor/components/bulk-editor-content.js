import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { STORE_NAME } from "../constants";
import { getFieldSets } from "../field-sets";
import { useAiUpsell } from "../hooks/use-ai-upsell";
import { useInlineEdit } from "../hooks/use-inline-edit";
import { usePosts } from "../services/use-posts";
import { BulkActions, SelectionToolbar } from "./bulk-action-bar";
import { BulkEditorTable } from "./table/bulk-editor-table";
import { BulkEditorTabPanel, BulkEditorTabs } from "./bulk-editor-tabs";

/**
 * Generates the selection toolbar's view. While loading, the previous content type's items and selection still
 * linger behind the skeleton rows, so a neutral (empty) selection is presented instead.
 *
 * @param {boolean}  isLoading   Whether the rows are still loading.
 * @param {number[]} selectedIds The currently selected item ids.
 * @param {Object[]} items       The loaded items.
 *
 * @returns {{isAllSelected: boolean, selectedCount: number, totalCount: number, hasSelection: boolean}} The selection view.
 */
const getSelectionView = ( isLoading, selectedIds, items ) => {
	if ( isLoading ) {
		return { isAllSelected: false, selectedCount: 0, totalCount: 0, hasSelection: false };
	}
	return {
		isAllSelected: items.length > 0 && selectedIds.length === items.length,
		selectedCount: selectedIds.length,
		totalCount: items.length,
		hasSelection: selectedIds.length > 0,
	};
};

/**
 * The bulk editor content.
 *
 * @param {Object}                             props                    The props.
 * @param {import("../services").DataProvider} props.dataProvider       The data provider (config + endpoints).
 * @param {Object}                             props.remoteDataProvider The remote data provider (HTTP), used to fetch and save.
 * @param {string}                             props.contentType        The active content type to fetch posts for.
 *
 * @returns {JSX.Element} The content.
 */
export const BulkEditorContent = ( { dataProvider, remoteDataProvider, contentType } ) => {
	const fieldSets = useMemo( () => getFieldSets(), [] );
	const tabs = useMemo(
		() => Object.values( fieldSets ).map( ( { id, label } ) => ( { id, label } ) ),
		[ fieldSets ]
	);
	const activeFieldSet = useSelect( ( select ) => select( STORE_NAME ).selectActiveFieldSet(), [] );
	const selectedIds = useSelect( ( select ) => select( STORE_NAME ).selectSelectedIds(), [] );
	const isPremium = useSelect( ( select ) => select( STORE_NAME ).selectPreference( "isPremium", false ), [] );
	const aiUpsell = useAiUpsell( contentType );
	const { setActiveFieldSet, toggleRow, selectAll, deselectAll } = useDispatch( STORE_NAME );

	const { data: items = [], isPending, updateItem } = usePosts( { dataProvider, remoteDataProvider, contentType } );
	const { editing, stopEditing } = useInlineEdit( { dataProvider, remoteDataProvider, fieldSets, activeFieldSet, items, updateItem } );

	// Switching tab discards in-progress edits; switching content type also clears the selection.
	const onChangeTab = useCallback( ( id ) => {
		stopEditing();
		setActiveFieldSet( id );
	}, [ stopEditing, setActiveFieldSet ] );

	useEffect( () => {
		deselectAll();
	}, [ contentType, deselectAll ] );

	const { isAllSelected, selectedCount, totalCount, hasSelection } = getSelectionView( isPending, selectedIds, items );
	const onSelectAll = useCallback( () => {
		if ( ! isPending ) {
			selectAll( items.map( ( item ) => item.id ) );
		}
	}, [ isPending, selectAll, items ] );
	const onToggleAll = useCallback( () => ( isAllSelected ? deselectAll() : onSelectAll() ), [ isAllSelected, deselectAll, onSelectAll ] );

	const selection = useMemo( () => ( {
		selectedIds,
		onToggleRow: toggleRow,
	} ), [ selectedIds, toggleRow ] );

	return (
		<div className="yst-p-8 yst-space-y-8">
			<BulkEditorTabs
				tabs={ tabs }
				activeTab={ activeFieldSet }
				onChange={ onChangeTab }
				label={ __( "Bulk editor views", "wordpress-seo" ) }
			/>
			{ tabs.map( ( tab ) => (
				<BulkEditorTabPanel key={ tab.id } tabId={ tab.id } isActive={ tab.id === activeFieldSet }>
					<BulkEditorTable
						items={ items }
						fieldSet={ fieldSets[ tab.id ] }
						selection={ selection }
						editing={ editing }
						selectionToolbar={
							<SelectionToolbar
								idSuffix={ `-${ tab.id }` }
								isAllSelected={ isAllSelected }
								onToggleAll={ onToggleAll }
								onSelectAll={ onSelectAll }
								onDeselectAll={ deselectAll }
								selectedCount={ selectedCount }
								totalCount={ totalCount }
							/>
						}
						bulkActions={ <BulkActions isPremium={ isPremium } upsell={ aiUpsell } /> }
						showBulkActions={ hasSelection }
						isLoading={ isPending }
					/>
				</BulkEditorTabPanel>
			) ) }
		</div>
	);
};
