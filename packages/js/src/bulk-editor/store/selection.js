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
		/**
		 * Merges a contiguous range of ids (from anchorId to targetId within allIds) into the current selection.
		 */
		selectRange: ( state, { payload: { anchorId, targetId, allIds } } ) => {
			const anchorIndex = allIds.indexOf( anchorId );
			const targetIndex = allIds.indexOf( targetId );
			if ( anchorIndex === -1 || targetIndex === -1 ) {
				return;
			}
			const [ start, end ] = anchorIndex <= targetIndex
				? [ anchorIndex, targetIndex ]
				: [ targetIndex, anchorIndex ];
			const rangeIds = allIds.slice( start, end + 1 );
			const existing = new Set( state.selectedIds );
			rangeIds.forEach( ( id ) => existing.add( id ) );
			state.selectedIds = [ ...existing ];
		},
	},
	extraReducers: ( builder ) => {
		// Any change to the shown result set resets the selection: the new set may no longer contain the selected rows.
		builder.addCase( queryActions.setStatuses, () => createInitialSelectionState() );
		builder.addCase( queryActions.setSearch, () => createInitialSelectionState() );
		builder.addCase( queryActions.setPage, () => createInitialSelectionState() );
		builder.addCase( activeContentTypeActions.setActiveContentType, () => createInitialSelectionState() );
	},
} );

export const selectionSelectors = {
	selectSelectedIds: ( state ) => get( state, "selection.selectedIds", [] ),
};

export const selectionActions = slice.actions;

export default slice.reducer;
