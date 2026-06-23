import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

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
} );

export const selectionSelectors = {
	selectSelectedIds: ( state ) => get( state, "selection.selectedIds", [] ),
};

export const selectionActions = slice.actions;

export default slice.reducer;
