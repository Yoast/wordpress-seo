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
			// An explicit select-all replaces the carried-over selection, so its notice would be stale.
			state.preselectedTotal = 0;
		},
		deselectAll: () => createInitialSelectionState(),
		// A selection carried over from the WP admin overview can reference posts the bulk editor does not list
		// (e.g. private posts) or lists with a disabled checkbox (non-editable rows). Once the shown result set is
		// known, such ids must be dropped: they would stay selected without a way to deselect them, and leak into
		// the bulk actions.
		pruneSelection: ( state, { payload } ) => {
			state.selectedIds = state.selectedIds.filter( ( id ) => payload.includes( id ) );
		},
		dismissPreselectionNotice: ( state ) => {
			state.preselectedTotal = 0;
		},
	},
	extraReducers: ( builder ) => {
		// Any change to the shown result set resets the selection: the new set may no longer contain the selected rows.
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
};

export const selectionActions = slice.actions;

export default slice.reducer;
