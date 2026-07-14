import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

/**
 * A deferred switch, held until the unsaved-edits guard is resolved.
 *
 * @typedef {Object} PendingSwitch
 *
 * @property {"fieldSet"|"contentType"|"navigate"} kind What the switch targets: a field set, a content type, or a URL to navigate to.
 * @property {string} target The field-set name, content-type name, or (for "navigate") the destination URL.
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
 * page for a URL, discarding all view state, so it only hands off to the browser.
 *
 * @param {PendingSwitch} pending The switch to commit.
 *
 * @returns {Function} The thunk.
 */
export const commitSwitch = ( { kind, target } ) => ( { dispatch } ) => {
	if ( kind === "navigate" ) {
		// Clear the deferral before exit so a cancelled navigation can’t leave a pending switch and cause the self-repair to re-trigger.
		// beforeunload prompt) can't strand the pending switch and let the self-heal effect re-fire it.
		dispatch.clearPendingSwitch();
		// Security: target flows unvalidated into location.href, so it must stay a server-generated URL (the localized
		// links in bulk-editor-integration.php). If a link ever derives from request input, validate it here first
		// (same-origin and an http(s) scheme) to avoid an open redirect or a javascript: URI.
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
 * @param {PendingSwitch} request The requested switch.
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
