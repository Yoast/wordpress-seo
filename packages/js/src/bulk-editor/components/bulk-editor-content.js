import { Slot } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useMemo, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { PENDING_CHANGES_MODAL_SLOT, STORE_NAME } from "../constants";
import { getFieldSets } from "../field-sets";
import { useInlineEdit } from "../hooks/use-inline-edit";
import { usePosts } from "../services/use-posts";
import { BulkActions, SelectionToolbar } from "./bulk-action-bar";
import { BulkEditorFilters } from "./bulk-editor-filters";
import { BulkEditorFooter } from "./bulk-editor-footer";
import { BulkEditorTable } from "./table/bulk-editor-table";
import { BulkEditorTabPanel, BulkEditorTabs } from "./bulk-editor-tabs";
import { UnsavedChangesModal } from "./unsaved-changes-modal";
import { SearchBox } from "./search-box";

/**
 * Generates the selection toolbar's view. While loading, the previous content type's items and selection still
 * linger behind the skeleton rows, so a neutral (empty) selection is presented instead.
 *
 * @param {boolean}  isLoading   Whether the rows are still loading.
 * @param {number[]} selectedIds The currently selected item ids.
 * @param {Object[]} items       The loaded items (per page).
 * @param {number}   total       The total number of items across all pages.
 *
 * @returns {{isAllSelected: boolean, selectedCount: number, totalCount: number, hasSelection: boolean}} The selection view.
 */
const getSelectionView = ( isLoading, selectedIds, items, total ) => {
	if ( isLoading ) {
		return { isAllSelected: false, selectedCount: 0, totalCount: 0, hasSelection: false };
	}
	return {
		isAllSelected: items.length > 0 && selectedIds.length === items.length,
		selectedCount: selectedIds.length,
		totalCount: total,
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
 * @param {string}             props.contentTypeLabel   The active content type label, used in the search placeholder.
 *
 * @returns {JSX.Element} The content.
 */
export const BulkEditorContent = ( { dataProvider, remoteDataProvider, contentType, contentTypeLabel } ) => {
	const fieldSets = useMemo( () => getFieldSets(), [] );
	const tabs = useMemo(
		() => Object.values( fieldSets ).map( ( { id, label } ) => ( { id, label } ) ),
		[ fieldSets ]
	);
	const { activeFieldSet, selectedIds, isPremium, hasExternalPendingChanges } = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		return {
			activeFieldSet: store.selectActiveFieldSet(),
			selectedIds: store.selectSelectedIds(),
			isPremium: store.selectPreference( "isPremium", false ),
			// An external plugin (e.g. Premium's AI suggestions) reports pending changes so the switch can be guarded.
			hasExternalPendingChanges: store.selectHasExternalPendingChanges(),
		};
	}, [] );
	const { setActiveFieldSet, toggleRow, selectAll, deselectAll } = useDispatch( STORE_NAME );

	const { data: items = [], total = 0, totalPages = 0, isPending, updateItem } = usePosts( { dataProvider, remoteDataProvider, contentType } );
	const { editing, stopEditing } = useInlineEdit( { dataProvider, remoteDataProvider, fieldSets, activeFieldSet, items, updateItem } );

	// The tab the user wants to switch to while a switch is guarded (unsaved manual edits, or an external plugin
	// reporting pending changes); drives the confirmation modal.
	const [ pendingTab, setPendingTab ] = useState( null );
	const hasUnsavedEdits = Object.keys( editing.editingRows ).length > 0;


	const onChangeTab = useCallback( ( id ) => {
		if ( id === activeFieldSet ) {
			return;
		}
		// Guard the switch when manual edits are in progress or an external plugin (Premium AI) reports pending
		// changes; otherwise switch straight away. The guarded tab is held in pendingTab until the user decides.
		if ( hasUnsavedEdits || hasExternalPendingChanges ) {
			setPendingTab( id );
			return;
		}
		setActiveFieldSet( id );
	}, [ activeFieldSet, hasUnsavedEdits, hasExternalPendingChanges, setActiveFieldSet ] );

	const onSaveAndSwitch = useCallback( () => {
		// Fire the save for every open field; each reads its draft synchronously, so clearing the edit state
		// right after still posts the captured values while leaving the new tab clean.
		Object.entries( editing.editingRows ).forEach( ( [ id, row ] ) =>
			row.openFields.forEach( ( key ) => editing.onApplyField( { id: Number( id ), key } ) )
		);
		stopEditing();
		setActiveFieldSet( pendingTab );
		setPendingTab( null );
	}, [ editing, stopEditing, pendingTab, setActiveFieldSet ] );

	const onDiscardAndSwitch = useCallback( () => {
		stopEditing();
		setActiveFieldSet( pendingTab );
		setPendingTab( null );
	}, [ stopEditing, pendingTab, setActiveFieldSet ] );

	const onCancelSwitch = useCallback( () => setPendingTab( null ), [] );

	// Commits the deferred switch for an external guard (Premium fills the slot below and calls this once it has
	// handled its own pending changes). Free's own manual edits use onSaveAndSwitch/onDiscardAndSwitch instead.
	const onCommitSwitch = useCallback( () => {
		setActiveFieldSet( pendingTab );
		setPendingTab( null );
	}, [ pendingTab, setActiveFieldSet ] );

	// Self-heal a stranded switch: if a deferral is outstanding but nothing guards it any more (manual edits saved
	// and the external plugin cleared its pending changes), complete the switch so the user can never get stuck on a
	// tab with no modal to resolve.
	useEffect( () => {
		if ( pendingTab !== null && ! hasUnsavedEdits && ! hasExternalPendingChanges ) {
			onCommitSwitch();
		}
	}, [ pendingTab, hasUnsavedEdits, hasExternalPendingChanges, onCommitSwitch ] );

	useEffect( () => {
		deselectAll();
	}, [ contentType, deselectAll ] );

	const { isAllSelected, selectedCount, totalCount, hasSelection } = getSelectionView( isPending, selectedIds, items, total );
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
		<div className="yst-p-8 yst-space-y-6">
			<div className="yst-flex yst-flex-col yst-gap-4 sm:yst-flex-row sm:yst-items-start sm:yst-justify-between">
				<BulkEditorTabs
					tabs={ tabs }
					activeTab={ activeFieldSet }
					onChange={ onChangeTab }
					label={ __( "Bulk editor views", "wordpress-seo" ) }
				/>
				<SearchBox contentTypeLabel={ contentTypeLabel } />
			</div>
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
								contentTypeLabel={ contentTypeLabel }
							/>
						}
						bulkActions={
							<BulkActions
								isPremium={ isPremium }
								isActive={ tab.id === activeFieldSet }
								selectedIds={ selectedIds }
								activeFieldSet={ activeFieldSet }
								contentType={ contentType }
							/>
						}
						showBulkActions={ hasSelection }
						filters={ <BulkEditorFilters /> }
						isLoading={ isPending }
						footer={ total > 0
							? <BulkEditorFooter total={ total } totalPages={ totalPages } isPending={ isPending } />
							: null }
					/>
				</BulkEditorTabPanel>
			) ) }
			<UnsavedChangesModal
				isOpen={ hasUnsavedEdits && pendingTab !== null }
				onSave={ onSaveAndSwitch }
				onDiscard={ onDiscardAndSwitch }
				onClose={ onCancelSwitch }
			/>
			<BulkEditorFooter total={ total } totalPages={ totalPages } isPending={ isPending } />
			<Slot
				name={ PENDING_CHANGES_MODAL_SLOT }
				fillProps={ {
					isOpen: pendingTab !== null && ! hasUnsavedEdits,
					onCommit: onCommitSwitch,
					onCancel: onCancelSwitch,
				} }
			/>
		</div>
	);
};
