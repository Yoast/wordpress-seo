import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";
import { defaultTo } from "lodash";

/**
 * Retrieves the no index value.
 *
 * @returns {string} The no index value.
 */
export const getNoIndex = () => String( defaultTo( select( STORE_NAME_EDITOR.free ).getNoIndex(), "0" ) );

/**
 * Retrieves the no follow value.
 *
 * @returns {string} The no follow value.
 */
export const getNoFollow = () => String( defaultTo( select( STORE_NAME_EDITOR.free ).getNoFollow(), "0" ) );

/**
 * Gets the twitter image URL from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Twitter image URL.
 */
export const getAdvanced = () => {
	const advanced = defaultTo( select( STORE_NAME_EDITOR.free ).getAdvanced(), "" );
	if ( Array.isArray( advanced ) ) {
		return advanced.join( "," );
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
export const getBreadcrumbsTitle = () => defaultTo( select( STORE_NAME_EDITOR.free ).getBreadcrumbsTitle(), "" );

/**
 * Gets the Twitter image src from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image src.
 */
export const getCanonical = () => defaultTo( select( STORE_NAME_EDITOR.free ).getCanonical(), "" );

/**
 * Gets the WordProof timestamp value.
 *
 * @param {Object} state The state.
 *
 * @returns {string} WordProof timestamp value.
 */
export const getWordProofTimestamp = () => select( STORE_NAME_EDITOR.free ).getWordProofTimestamp() ? "1" : "";
