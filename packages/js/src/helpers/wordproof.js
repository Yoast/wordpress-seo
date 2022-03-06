/* External dependencies */
import { get } from "lodash";

/* Internal dependencies */
import getL10nObject from "../analysis/getL10nObject";

/**
 * @param {string} prop Prop to get from WordProof SDK data.
 * @returns {Object|*} All WordProof SDK data or a single prop from that data.
 */
export const getWordProofSdkData = ( prop ) => get( window, `wordproofSdk.data${ prop ? `.${prop}` : "" }`, {} );

/**
 * Returns whether or not the WordProof integration is active.
 *
 * @returns {boolean} Whether or not the WordProof integration is active.
 */
export const isWordProofIntegrationActive = () => {
	const l10nObject = getL10nObject();
	return get( l10nObject, "wordproofIntegrationActive", 0 ) === 1;
};

/**
 * Dispatches custom event.
 *
 * @param {string} name The name of the event.
 * @returns {void} Returns void.
 */
const dispatchEvent = ( name ) => {
	const event = new CustomEvent( name );
	window.dispatchEvent( event );
};

/**
 * Dispatches event to open authentication.
 * @returns {void} Returns void.
 */
export const openAuthentication = () => {
	dispatchEvent( "wordproof:open_authentication" );
};

/**
 * Dispatches event to open settings.
 * @returns {void} Returns void.
 */
export const openSettings = () => {
	dispatchEvent( "wordproof:open_settings" );
};


