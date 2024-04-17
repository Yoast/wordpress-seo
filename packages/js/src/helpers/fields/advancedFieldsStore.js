import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";

/**
 * Retrieves the no index value.
 *
 * @returns {string} The no index value.
 */
export const getNoIndex = () => String( select( STORE_NAME_EDITOR.free ).getNoIndex() );

/**
 * Retrieves the no follow value.
 *
 * @returns {string} The no follow value.
 */
export const getNoFollow = () => String( select( STORE_NAME_EDITOR.free ).getNoFollow() );

/**
 * Gets the twitter image URL from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Twitter image URL.
 */
export const getAdvanced = () => {
	const advanced = select( STORE_NAME_EDITOR.free ).getAdvanced();
	if ( Array.isArray( advanced ) ) {
		return advanced.join();
	}
	return advanced;
};

/**
 * Gets the twitter image type from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Twitter image type.
 */
export const getBreadcrumbsTitle = () => select( STORE_NAME_EDITOR.free ).getBreadcrumbsTitle();

/**
 * Gets the Twitter image src from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image src.
 */
export const getCanonical = () => select( STORE_NAME_EDITOR.free ).getCanonical();

/**
 * Gets the WordProof timestamp value.
 *
 * @param {Object} state The state.
 *
 * @returns {string} WordProof timestamp value.
 */
export const getWordProofTimestamp = () => select( STORE_NAME_EDITOR.free ).getWordProofTimestamp() ? "1" : "";
