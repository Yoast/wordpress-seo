import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * A deferred switch, held until the unsaved-edits guard is resolved.
 *
 * @typedef {Object} PendingSwitch
 *
 * @property {"fieldSet"|"contentType"|"navigate"|"page"} kind What the switch targets.
 * @property {string|number} target The field-set/content-type name, the destination URL, or (for "page") the 1-based page number.
 */

/**
 * @returns {?PendingSwitch} The initial pending-switch state: no switch is deferred.
 */
export const createInitialPendingSwitchState = () => null;

const slice = createSlice( {
	name: "pendingSwitch",
	initialState: createInitialPendingSwitchState(),
	reducers: {
		setPendingSwitch: ( _state, { payload } ) => payload,
		clearPendingSwitch: () => null,
	},
} );

/**
 * Commits a switch. A content-type change also clears the unsaved edits, so a stale draft can't leak into the
 * newly shown type; the selection reset is handled by setActiveContentType itself. A "navigate" switch leaves the
 * page for a URL, discarding all view state, so it only hands off to the browser. A "page" switch changes the
 * results page.
 *
 * @param {PendingSwitch} pending The switch to commit.
 *
 * @returns {Function} The thunk.
 */
export const commitSwitch = ( { kind, target } ) => ( { dispatch } ) => {
	if ( kind === "navigate" ) {
		// Clear the deferral before exit so a cancelled navigation can't leave a pending switch and cause the self-repair to re-trigger.
		dispatch.clearPendingSwitch();
		// Security: Now, `target` is a server-generated URL (see bulk-editor-integration.php).
		// If it ever comes from input, it has to be validated to prevent open redirects or malicious URIs.
		window.location.href = target;
		return;
	}
	if ( kind === "page" ) {
		dispatch.setPage( target );
		dispatch.clearPendingSwitch();
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
 * Requests a switch.
 * Defers the request when manual edits are unsaved or an external plugin (Premium AI) reports pending changes.
 * Otherwise, commits immediately. In-app switches ("contentType", "fieldSet", "page") are silently dropped
 * when already at the target or while external generation is in flight; hard navigation ("navigate") bypasses
 * both guards because a page unload cancels any in-flight request regardless.
 *
 * @param {PendingSwitch} request The requested switch.
 *
 * @returns {Function} The thunk.
 */
export const requestSwitch = ( { kind, target } ) => ( { select, dispatch } ) => {
	const currentValueSelector = {
		contentType: select.selectActiveContentTypeName,
		fieldSet: select.selectActiveFieldSet,
		page: select.selectPage,
	}[ kind ];
	if ( currentValueSelector ) {
		// A no-op switch (to the value already shown) needs no guard.
		if ( target === currentValueSelector() ) {
			return;
		}
		if ( select.selectHasExternalGeneration() ) {
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
	/**
	 * @param {Object} state The root store state.
	 *
	 * @returns {?PendingSwitch} The deferred switch, or null when none is pending.
	 */
	selectPendingSwitch: ( state ) => get( state, "pendingSwitch", null ),
};

export const pendingSwitchActions = {
	...slice.actions,
	requestSwitch,
	commitSwitch,
};

export default slice.reducer;
