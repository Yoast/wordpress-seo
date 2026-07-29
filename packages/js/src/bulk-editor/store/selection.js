import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { activeContentTypeActions } from "./active-content-type";
import { queryActions } from "./query";

/**
 * @returns {Object} The initial selection state: no rows selected, no selection carried over from the WP admin overview.
 */
export const createInitialSelectionState = () => ( {
	selectedIds: [],
	// How many items were selected on the WP admin overview when the user came in via its bulk action; drives the
	// "only the first 20 are selected" notice. 0 when the user did not come in that way (or the notice was dismissed).
	preselectedTotal: 0,
	// Whether pruning dropped carried-over ids the bulk editor cannot show or edit; drives the exclusion notice.
	// False when nothing was dropped (or the notice was dismissed).
	hasExcludedPreselected: false,
} );

const slice = createSlice( {
	name: "selection",
	initialState: createInitialSelectionState(),
	reducers: {
		toggleRow: ( state, { payload } ) => {
			if ( state.selectedIds.includes( payload ) ) {
				state.selectedIds = state.selectedIds.filter( ( id ) => id !== payload );
			} else {
				state.selectedIds.push( payload );
			}
		},
		selectAll: ( state, { payload } ) => {
			state.selectedIds = [ ...payload ];
			// An explicit select-all replaces the carried-over selection, so its notices would be stale.
			state.preselectedTotal = 0;
			state.hasExcludedPreselected = false;
		},
		deselectAll: () => createInitialSelectionState(),
		// A selection carried over from the WP admin overview can reference posts the bulk editor does not list
		// (e.g. private posts) or lists with a disabled checkbox (non-editable rows). Once the shown result set is
		// known, such ids must be dropped: they would stay selected without a way to deselect them, and leak into
		// the bulk actions. Dropping any flags the exclusion notice, so the user learns why their selection shrank.
		pruneSelection: ( state, { payload } ) => {
			const pruned = state.selectedIds.filter( ( id ) => payload.includes( id ) );
			if ( pruned.length < state.selectedIds.length ) {
				state.hasExcludedPreselected = true;
			}
			state.selectedIds = pruned;
		},
		dismissPreselectionNotice: ( state ) => {
			state.preselectedTotal = 0;
		},
		dismissExclusionNotice: ( state ) => {
			state.hasExcludedPreselected = false;
		},
	},
	extraReducers: ( builder ) => {
		// Any change to the shown result set resets the selection: the new set may no longer contain the selected rows.
		// The "Overview selection" filter (query slice) intentionally outlives these resets: it narrows the result set
		// like any other filter, while the carried-over selection itself is one-shot and never restored.
		builder.addCase( queryActions.setStatuses, () => createInitialSelectionState() );
		builder.addCase( queryActions.setSearch, () => createInitialSelectionState() );
		builder.addCase( queryActions.setPage, () => createInitialSelectionState() );
		builder.addCase( queryActions.setOverviewFilterActive, () => createInitialSelectionState() );
		builder.addCase( activeContentTypeActions.setActiveContentType, () => createInitialSelectionState() );
	},
} );

export const selectionSelectors = {
	selectSelectedIds: ( state ) => get( state, "selection.selectedIds", [] ),
	selectPreselectedTotal: ( state ) => get( state, "selection.preselectedTotal", 0 ),
	selectHasExcludedPreselected: ( state ) => get( state, "selection.hasExcludedPreselected", false ),
};

export const selectionActions = slice.actions;

export default slice.reducer;
