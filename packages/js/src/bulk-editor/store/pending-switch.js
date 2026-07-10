import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * @returns {null} The initial pending-switch state: no switch is deferred.
 */
export const createInitialPendingSwitchState = () => null;

const slice = createSlice( {
	name: "pendingSwitch",
	initialState: createInitialPendingSwitchState(),
	reducers: {
		// Holds a deferred switch ({ kind: "fieldSet" | "contentType", target }) until the guard is resolved.
		setPendingSwitch: ( _state, { payload } ) => payload,
		clearPendingSwitch: () => null,
	},
} );

/**
 * Commits a switch. A content-type change also resets the per-type selection and edits, so a stale selection or
 * unsaved draft can't leak into the newly-shown type.
 *
 * @param {{kind: string, target: string}} pending The switch to commit.
 *
 * @returns {Function} The thunk.
 */
export const commitSwitch = ( { kind, target } ) => ( { dispatch } ) => {
	if ( kind === "contentType" ) {
		dispatch.setActiveContentType( target );
		dispatch.deselectAll();
		dispatch.stopEdit();
	} else {
		dispatch.setActiveFieldSet( target );
	}
	dispatch.clearPendingSwitch();
};

/**
 * Requests a switch, guarding it when manual edits are in progress or an external plugin (Premium AI) reports
 * pending changes: the switch is then held until the user resolves it, otherwise it commits immediately.
 *
 * @param {{kind: string, target: string}} request The requested switch.
 *
 * @returns {Function} The thunk.
 */
export const requestSwitch = ( { kind, target } ) => ( { select, dispatch } ) => {
	const hasUnsavedEdits = Object.keys( select.selectEditingRows() ).length > 0;
	if ( hasUnsavedEdits || select.selectHasExternalPendingChanges() ) {
		dispatch.setPendingSwitch( { kind, target } );
		return;
	}
	dispatch.commitSwitch( { kind, target } );
};

export const pendingSwitchSelectors = {
	selectPendingSwitch: ( state ) => get( state, "pendingSwitch", null ),
};

export const pendingSwitchActions = {
	...slice.actions,
	requestSwitch,
	commitSwitch,
};

export default slice.reducer;
