import { select } from "@wordpress/data";
import { EDITOR_STORE } from "../../shared-admin/constants";

/**
 * Retrieves the no index value.
 *
 * @returns {string} The no index value.
 */
export const getNoIndex = () => select( EDITOR_STORE )?.getNoIndex() ? String( select( EDITOR_STORE ).getNoIndex() ) : "0";

/**
 * Retrieves the no follow value.
 *
 * @returns {string} The no follow value.
 */
export const getNoFollow = () => {
	const noFollow = select( EDITOR_STORE )?.getNoFollow();
	if ( noFollow && typeof noFollow === "string" ) {
		return noFollow;
	} else if ( typeof noFollow === "number" ) {
		return String( noFollow );
	}
	return "0";
};

/**
 * Gets the twitter image URL from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Twitter image URL.
 */
export const getAdvanced = () => {
	const advanced = select( EDITOR_STORE )?.getAdvanced();
	if ( Array.isArray( advanced ) ) {
		return advanced.join( "," );
	} else if ( typeof advanced === "string" ) {
		return advanced;
	}
	return "";
};

/**
 * Gets the twitter image type from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Twitter image type.
 */
export const getBreadcrumbsTitle = () => select( EDITOR_STORE )?.getBreadcrumbsTitle();

/**
 * Gets the Twitter image src from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image src.
 */
export const getCanonical = () => select( EDITOR_STORE )?.getCanonical();

/**
 * Gets the WordProof timestamp value.
 *
 * @param {Object} state The state.
 *
 * @returns {string} WordProof timestamp value.
 */
export const getWordProofTimestamp = () => select( EDITOR_STORE )?.getWordProofTimestamp() ? "1" : "0";
