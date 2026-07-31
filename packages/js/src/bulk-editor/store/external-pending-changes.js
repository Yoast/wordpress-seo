import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {boolean} The initial external-pending-changes state.
 */
export const createInitialExternalPendingChangesState = () => false;

const slice = createSlice( {
	name: "externalPendingChanges",
	initialState: createInitialExternalPendingChangesState(),
	reducers: {
		// An external plugin (e.g. Premium's AI suggestions) reports whether it has pending changes, so the tab-change
		// guard can defer the switch and let that plugin confirm via its own modal.
		setHasExternalPendingChanges: ( state, { payload } ) => Boolean( payload ),
	},
} );

export const externalPendingChangesSelectors = {
	selectHasExternalPendingChanges: ( state ) => get( state, "externalPendingChanges", false ),
};

export const externalPendingChangesActions = slice.actions;

export default slice.reducer;
