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
 * Commits a switch. A content-type change also clears the unsaved edits, so a stale draft can't leak into the
 * newly shown type; the selection reset is handled by setActiveContentType itself. A "navigate" switch leaves the
 * page for a URL, discarding all view state, so it only hands off to the browser.
 *
 * @param {{kind: string, target: string}} pending The switch to commit.
 *
 * @returns {Function} The thunk.
 */
export const commitSwitch = ( { kind, target } ) => ( { dispatch } ) => {
	if ( kind === "navigate" ) {
		// Clear the deferral before leaving so a cancelled navigation (e.g. the user dismisses a still-armed
		// beforeunload prompt) can't strand the pending switch and let the self-heal effect re-fire it.
		dispatch.clearPendingSwitch();
		window.location.href = target;
		return;
	}
	if ( kind === "contentType" ) {
		dispatch.setActiveContentType( target );
		dispatch.stopEdit();
	} else {
		dispatch.setActiveFieldSet( target );
	}
	dispatch.clearPendingSwitch();
};

/**
 * Requests a switch, guarding it when manual edits are in progress or an external plugin (Premium AI) reports
 * pending changes: the switch is then held until the user resolves it, otherwise it commits immediately. A
 * "navigate" switch targets a URL rather than a view value, so it skips the no-op check that compares against the
 * current view.
 *
 * @param {{kind: string, target: string}} request The requested switch.
 *
 * @returns {Function} The thunk.
 */
export const requestSwitch = ( { kind, target } ) => ( { select, dispatch } ) => {
	if ( kind !== "navigate" ) {
		const current = kind === "contentType" ? select.selectActiveContentTypeName() : select.selectActiveFieldSet();
		if ( target === current ) {
			return;
		}
	}
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
