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
 * @returns {{isAllSelected: boolean, isIndeterminate: boolean, selectedCount: number, totalCount: number, hasSelection: boolean}} The selection view.
 */
export const getSelectionView = ( isLoading, selectedIds, items, total ) => {
	if ( isLoading ) {
		return { isAllSelected: false, isIndeterminate: false, selectedCount: 0, totalCount: 0, hasSelection: false };
	}
	const selectedCount = selectedIds.length;
	const isAllSelected = items.length > 0 && selectedCount === items.length;
	return {
		isAllSelected,
		isIndeterminate: selectedCount > 0 && ! isAllSelected,
		selectedCount,
		totalCount: total,
		hasSelection: selectedCount > 0,
	};
};

/**
 * The bulk editor content.
 *
 * @param {Object}                             props                    The props.
 * @param {import("../services").DataProvider} props.dataProvider       The data provider (config + endpoints).
 * @param {Object}                             props.remoteDataProvider The remote data provider (HTTP), used to fetch and save.
 * @param {string}                             props.contentType        The active content type to fetch posts for.
 * @param {string}                             props.contentTypeLabel   The active content type label, used in the search placeholder.
 * @param {string}                             props.contentTypeSingularLabel The active content type singular label, passed to the bulk actions.
 *
 * @returns {JSX.Element} The content.
 */
export const BulkEditorContent = ( { dataProvider, remoteDataProvider, contentType, contentTypeLabel, contentTypeSingularLabel } ) => {
	const fieldSets = useMemo( () => getFieldSets(), [] );
	const tabs = useMemo(
		() => Object.values( fieldSets ).map( ( { id, label } ) => ( { id, label } ) ),
		[ fieldSets ]
	);
	const { activeFieldSet, selectedIds, isPremium, isAiEnabled, hasExternalPendingChanges } = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		return {
			activeFieldSet: store.selectActiveFieldSet(),
			selectedIds: store.selectSelectedIds(),
			isPremium: store.selectPreference( "isPremium", false ),
			isAiEnabled: store.selectPreference( "isAiEnabled", false ),
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
	const editCount = Object.keys( editing.editingRows ).length;
	const hasUnsavedEdits = editCount > 0;


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

	const onSaveAndSwitch = useCallback( async() => {
		// On success the drafts clear and the failed rows stay open,
		// so close the modal to reveal the error notice behind it.
		const saved = await editing.onApplyAll();
		if ( ! saved ) {
			setPendingTab( null );
		}
	}, [ editing ] );

	const onDiscardAndSwitch = useCallback( () => {
		// Clearing the edits flips hasUnsavedEdits to false; the self-heal effect or the slot modal then completes
		// the switch, so a still-pending external guard is honoured rather than overridden.
		stopEditing();
	}, [ stopEditing ] );

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

	const { isAllSelected, isIndeterminate, selectedCount, totalCount, hasSelection } = getSelectionView( isPending, selectedIds, items, total );
	const onSelectAll = useCallback( () => {
		if ( ! isPending ) {
			selectAll( items.map( ( item ) => item.id ) );
		}
	}, [ isPending, selectAll, items ] );
	// Clicking the master checkbox clears the selection whenever anything is selected (all or a partial).
	const onToggleAll = useCallback( () => ( hasSelection ? deselectAll() : onSelectAll() ), [ hasSelection, deselectAll, onSelectAll ] );

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
								isIndeterminate={ isIndeterminate }
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
								isAiEnabled={ isAiEnabled }
								isActive={ tab.id === activeFieldSet }
								selectedIds={ selectedIds }
								activeFieldSet={ activeFieldSet }
								contentType={ contentType }
								contentTypeLabel={ contentTypeLabel }
								contentTypeSingularLabel={ contentTypeSingularLabel }
								hasUnsavedEdits={ hasUnsavedEdits }
								editCount={ editCount }
								onApplyAll={ editing.onApplyAll }
								onDiscardAll={ editing.onDiscardAll }
								isApplyingAll={ editing.isApplyingAll }
								hasSaveError={ editing.hasSaveError }
								onDismissSaveError={ editing.dismissSaveError }
							/>
						}
						// A selection only warrants the band while AI is enabled (the AI affordances are its only
						// selection-driven occupant); with AI off the band collapses. Unsaved manual edits are a
						// separate, non-AI occupant, so they keep it open regardless of the AI toggle.
						showBulkActions={ ( hasSelection && isAiEnabled ) || hasUnsavedEdits }
						filters={ <BulkEditorFilters /> }
						isLoading={ isPending }
						hasExternalPendingChanges={ hasExternalPendingChanges }
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
				isSaving={ editing.isApplyingAll }
			/>
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
