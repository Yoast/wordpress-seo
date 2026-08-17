import { Slot } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect, useMemo, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
	BULK_UPDATE_BATCH_SIZE,
	PENDING_CHANGES_MODAL_SLOT,
	STORE_NAME,
} from "../constants";
import { getFieldSets } from "../field-sets";
import { useInlineEdit } from "../hooks/use-inline-edit";
import { usePosts } from "../hooks/use-posts";
import { BulkActions, SelectionToolbar } from "./bulk-action-bar";
import { BulkEditorFilters } from "./bulk-editor-filters";
import { BulkEditorTour } from "./tour/bulk-editor-tour";
import { BulkEditorFooter } from "./bulk-editor-footer";
import { BulkEditorTable } from "./table/bulk-editor-table";
import { BulkEditorTabPanel, BulkEditorTabs } from "./bulk-editor-tabs";
import { UnsavedChangesModal } from "./unsaved-changes-modal";
import { SearchBox } from "./search-box";
import { getSelectionView, getSmartSelectItems } from "../helpers";

/**
 * Decides whether the bulk-actions band row is expanded.
 *
 * A selection only warrants the band while AI is enabled (the AI affordances are its only selection-driven
 * occupant); with AI off the band collapses. Unsaved manual edits are a separate, non-AI occupant, so they
 * keep it open regardless of the AI toggle. External pending changes (Premium's AI suggestions) also keep
 * it open: a filter, search, or page change clears the selection but must leave the pending suggestions
 * actionable. The overview-selection truncation and exclusion notices live in the band's notices region,
 * so either opens the band too.
 *
 * @param {Object}  view                           The view state.
 * @param {boolean} view.hasSelection              Whether any rows are selected.
 * @param {boolean} view.isAiEnabled               Whether the AI feature is enabled.
 * @param {boolean} view.hasUnsavedEdits           Whether a row has unsaved manual edits.
 * @param {boolean} view.hasExternalPendingChanges Whether an external plugin reports pending changes.
 * @param {boolean} view.hasOverviewNotice         Whether an overview-selection notice (truncation or exclusion) must show.
 *
 * @returns {boolean} Whether the band is expanded.
 */
export const shouldShowBulkActions = ( { hasSelection, isAiEnabled, hasUnsavedEdits, hasExternalPendingChanges, hasOverviewNotice } ) =>
	( hasSelection && isAiEnabled ) || hasUnsavedEdits || hasExternalPendingChanges || hasOverviewNotice;

/**
 * Decides whether an overview-selection notice (truncation or exclusion) must show.
 *
 * @param {Object}  view                        The view state.
 * @param {number}  view.preselectedTotal       How many items were selected on the WP admin overview.
 * @param {boolean} view.hasExcludedPreselected Whether pruning dropped carried-over ids.
 *
 * @returns {boolean} Whether an overview-selection notice must show.
 */
export const getHasOverviewNotice = ( { preselectedTotal, hasExcludedPreselected } ) =>
	preselectedTotal > BULK_UPDATE_BATCH_SIZE || hasExcludedPreselected;

/**
 * The bulk editor content.
 *
 * @param {Object}                             props                    The props.
 * @param {import("../services").DataProvider} props.dataProvider       The data provider (config + endpoints).
 * @param {Object}                             props.remoteDataProvider The remote data provider (HTTP), used to fetch and save.
 * @param {string}                             props.contentType        The active content type to fetch posts for.
 * @param {string}                             props.contentTypeLabel   The active content type label, used in the search placeholder.
 * @param {string}                             props.contentTypeSingularLabel The active content type singular label, used in the selected-count copy.
 *
 * @returns {JSX.Element} The content.
 */
export const BulkEditorContent = ( { dataProvider, remoteDataProvider, contentType, contentTypeLabel } ) => {
	const fieldSets = useMemo( () => getFieldSets(), [] );
	const tabs = useMemo(
		() => Object.values( fieldSets ).map( ( { id, label } ) => ( { id, label } ) ),
		[ fieldSets ]
	);
	const {
		activeFieldSet,
		selectedIds,
		preselectedTotal,
		hasExcludedPreselected,
		isPremium,
		isAiEnabled,
		hasExternalPendingChanges,
		hasExternalGeneration,
		pendingSwitch,
	} = useSelect( ( select ) => {
		const store = select( STORE_NAME );
		return {
			activeFieldSet: store.selectActiveFieldSet(),
			selectedIds: store.selectSelectedIds(),
			// The size of a selection carried over from the WP admin overview; drives the truncation notice.
			preselectedTotal: store.selectPreselectedTotal(),
			// Whether pruning dropped carried-over ids the bulk editor cannot show or edit; drives the exclusion notice.
			hasExcludedPreselected: store.selectHasExcludedPreselected(),
			isPremium: store.selectPreference( "isPremium", false ),
			isAiEnabled: store.selectPreference( "isAiEnabled", false ),
			// An external plugin (e.g. Premium's AI suggestions) reports pending changes so the switch can be guarded.
			hasExternalPendingChanges: store.selectHasExternalPendingChanges(),
			// It also reports an in-flight generation request so row editing can be locked while it runs.
			hasExternalGeneration: store.selectHasExternalGeneration(),
			pendingSwitch: store.selectPendingSwitch(),
		};
	}, [] );
	const {
		requestSwitch,
		commitSwitch,
		clearPendingSwitch,
		toggleRow,
		selectAll,
		deselectAll,
		dismissPreselectionNotice,
		dismissExclusionNotice,
		selectRange,
	} = useDispatch( STORE_NAME );

	const { data: items = [], total = 0, totalPages = 0, isPending, updateItem } = usePosts( { dataProvider, remoteDataProvider, contentType } );
	const { editing, stopEditing } = useInlineEdit( { dataProvider, remoteDataProvider, fieldSets, activeFieldSet, items, updateItem } );

	const editCount = Object.keys( editing.editingRows ).length;
	const hasUnsavedEdits = editCount > 0;

	// A tab click requests a field-set switch; requestSwitch guards it (defers to the modal), skips a no-op switch,
	// or commits straight away. Kept free of the active field set so the handler stays referentially stable.
	const onChangeTab = useCallback( ( id ) => requestSwitch( { kind: "fieldSet", target: id } ), [ requestSwitch ] );

	const onSaveAndSwitch = useCallback( async() => {
		// Close the modal only when the save actually failed, so its notice is revealed; a clean save lets the
		// self-heal effect complete the switch, and an in-flight save (null) is left alone.
		const saved = await editing.onApplyAll();
		if ( saved === false ) {
			clearPendingSwitch();
		}
	}, [ editing, clearPendingSwitch ] );

	const onDiscardAndSwitch = useCallback( () => {
		// Clearing the edits flips hasUnsavedEdits to false; the self-heal effect or the slot modal then completes
		// the switch, so a still-pending external guard is honoured rather than overridden.
		stopEditing();
	}, [ stopEditing ] );

	const onCancelSwitch = useCallback( () => clearPendingSwitch(), [ clearPendingSwitch ] );

	// Commits the deferred switch for an external guard (Premium fills the slot below and calls this once it has
	// handled its own pending changes). Free's own manual edits use onSaveAndSwitch/onDiscardAndSwitch instead.
	const onCommitSwitch = useCallback( () => {
		if ( pendingSwitch ) {
			commitSwitch( pendingSwitch );
		}
	}, [ pendingSwitch, commitSwitch ] );

	// Self-heal a stranded switch: if a deferral is outstanding but nothing guards it any more (manual edits saved
	// and the external plugin cleared its pending changes), complete the switch so the user can never get stuck
	// with no modal to resolve.
	useEffect( () => {
		if ( pendingSwitch !== null && ! hasUnsavedEdits && ! hasExternalPendingChanges ) {
			onCommitSwitch();
		}
	}, [ pendingSwitch, hasUnsavedEdits, hasExternalPendingChanges, onCommitSwitch ] );

	const { isAllSelected, isIndeterminate, selectedCount, totalCount, hasSelection } = getSelectionView( isPending, selectedIds, items, total );

	// Tracks the last plain-click selection to anchor shift+click ranges.
	const anchorIdRef = useRef( null );

	// When a query change (search, filter, page) resets the store's selectedIds to [], clear the anchor so
	// the next shift+click starts a fresh range rather than extending from a row the user selected before the reset.
	useEffect( () => {
		if ( selectedIds.length === 0 ) {
			anchorIdRef.current = null;
		}
	}, [ selectedIds ] );

	const onToggleRow = useCallback( ( id, shiftKey ) => {
		const allEditableIds = items.filter( ( item ) => item.editable ).map( ( item ) => item.id );
		if ( shiftKey && anchorIdRef.current !== null ) {
			selectRange( { anchorId: anchorIdRef.current, targetId: id, allIds: allEditableIds } );
		} else {
			// A plain deselect clears the anchor: deselecting a row cannot serve as the start of a range.
			// Shift+click only ever adds to the selection; it does not toggle rows off.
			anchorIdRef.current = selectedIds.includes( id ) ? null : id;
			toggleRow( id );
		}
	}, [ items, selectedIds, toggleRow, selectRange ] );

	// The truncation and exclusion notices for a selection carried over from the WP admin overview, shown in the
	// band's notices region; either one keeps the band expanded.
	const hasOverviewNotice = getHasOverviewNotice( { preselectedTotal, hasExcludedPreselected } );
	const showBulkActions = shouldShowBulkActions( { hasSelection, isAiEnabled, hasUnsavedEdits, hasExternalPendingChanges, hasOverviewNotice } );
	const onSelectAll = useCallback( () => {
		if ( ! isPending ) {
			anchorIdRef.current = null;
			// Only posts the user can edit are selectable for bulk editing.
			selectAll( items.filter( ( item ) => item.editable ).map( ( item ) => item.id ) );
		}
	}, [ isPending, selectAll, items ] );

	const handleDeselectAll = useCallback( () => {
		anchorIdRef.current = null;
		deselectAll();
	}, [ deselectAll ] );

	// Clicking the master checkbox clears the selection whenever anything is selected (all or a partial).
	const onToggleAll = useCallback( () => ( hasSelection ? handleDeselectAll() : onSelectAll() ), [ hasSelection, handleDeselectAll, onSelectAll ] );

	const handleSmartSelectAll = useCallback( ( ids ) => {
		anchorIdRef.current = null;
		selectAll( ids );
	}, [ selectAll ] );

	const smartSelectItems = useMemo(
		() => getSmartSelectItems( { activeFieldSet, items, isPending, selectAll: handleSmartSelectAll } ),
		[ activeFieldSet, items, isPending, handleSmartSelectAll ]
	);

	const selection = useMemo( () => ( {
		selectedIds,
		onToggleRow,
	} ), [ selectedIds, onToggleRow ] );

	return (
		<>
			<div className="yst-p-8 yst-space-y-6">
				<div className="yst-flex yst-flex-col yst-gap-4 sm:yst-flex-row sm:yst-items-start sm:yst-justify-between">
					<BulkEditorTabs
						tabs={ tabs }
						activeTab={ activeFieldSet }
						disabled={ hasExternalGeneration }
						onChange={ onChangeTab }
						label={ __( "Bulk editor views", "wordpress-seo" ) }
					/>
					{ /* key remounts on content-type switch, resetting local state; a prop change alone would not. */ }
					<SearchBox key={ contentType } contentTypeLabel={ contentTypeLabel } />
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
									onDeselectAll={ handleDeselectAll }
									selectedCount={ selectedCount }
									totalCount={ totalCount }
									contentTypeLabel={ contentTypeLabel }
									smartSelectItems={ smartSelectItems }
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
									hasUnsavedEdits={ hasUnsavedEdits }
									editCount={ editCount }
									onApplyAll={ editing.onApplyAll }
									onDiscardAll={ editing.onDiscardAll }
									isApplyingAll={ editing.isApplyingAll }
									hasSaveError={ editing.hasSaveError }
									onDismissSaveError={ editing.dismissSaveError }
									preselectedTotal={ preselectedTotal }
									onDismissPreselection={ dismissPreselectionNotice }
									hasExcludedPreselected={ hasExcludedPreselected }
									onDismissExclusion={ dismissExclusionNotice }
								/>
							}
							showBulkActions={ showBulkActions }
							filters={ <BulkEditorFilters /> }
							isLoading={ isPending }
							hasExternalPendingChanges={ hasExternalPendingChanges }
							hasExternalGeneration={ hasExternalGeneration }
							footer={ total > 0
								? <BulkEditorFooter total={ total } totalPages={ totalPages } isPending={ isPending } />
								: null }
						/>
					</BulkEditorTabPanel>
				) ) }
				<UnsavedChangesModal
					isOpen={ hasUnsavedEdits && pendingSwitch !== null }
					isSaving={ editing.isApplyingAll }
					onSave={ onSaveAndSwitch }
					onDiscard={ onDiscardAndSwitch }
					onClose={ onCancelSwitch }
				/>
				<Slot
					name={ PENDING_CHANGES_MODAL_SLOT }
					fillProps={ {
						isOpen: pendingSwitch !== null && ! hasUnsavedEdits,
						onCommit: onCommitSwitch,
						onCancel: onCancelSwitch,
					} }
				/>
			</div>
			<BulkEditorTour onSelectAll={ onSelectAll } onDeselectAll={ handleDeselectAll } hasSelection={ hasSelection } />
		</>
	);
};
