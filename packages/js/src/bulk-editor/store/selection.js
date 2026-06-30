import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
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
		// Changing the status filter resets the selection: the filtered set may no longer contain the selected rows.
		builder.addCase( queryActions.setStatuses, () => createInitialSelectionState() );
	},
} );

export const selectionSelectors = {
	selectSelectedIds: ( state ) => get( state, "selection.selectedIds", [] ),
};

export const selectionActions = slice.actions;

export default slice.reducer;
