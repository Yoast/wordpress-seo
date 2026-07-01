import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { activeContentTypeActions } from "./active-content-type";
import { queryActions } from "./query";

/**
 * @returns {Object} The initial selection state: no rows selected.
 */
export const createInitialSelectionState = () => ( {
	selectedIds: [],
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
		},
		deselectAll: () => createInitialSelectionState(),
	},
	extraReducers: ( builder ) => {
		// Any change to the shown result set resets the selection: the new set may no longer contain the selected rows.
		builder.addCase( queryActions.setStatuses, () => createInitialSelectionState() );
		builder.addCase( queryActions.setSearch, () => createInitialSelectionState() );
		builder.addCase( activeContentTypeActions.setActiveContentType, () => createInitialSelectionState() );
	},
} );

export const selectionSelectors = {
	selectSelectedIds: ( state ) => get( state, "selection.selectedIds", [] ),
};

export const selectionActions = slice.actions;

export default slice.reducer;
