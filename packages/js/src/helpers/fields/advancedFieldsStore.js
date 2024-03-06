import { select } from "@wordpress/data";
import { STORE } from "../../constants";

/**
 * Retrieves the no index value.
 *
 * @returns {string} The no index value.
 */
export const getNoIndex = () => String( select( STORE )?.getNoIndex() );

/**
 * Retrieves the no follow value.
 *
 * @returns {string} The no follow value.
 */
export const getNoFollow = () => String( select( STORE )?.getNoFollow() );

/**
 * Gets the twitter image URL from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Twitter image URL.
 */
export const getAdvanced = () => select( STORE )?.getAdvanced().join( "," );

/**
 * Gets the twitter image type from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Twitter image type.
 */
export const getBreadcrumbsTitle = () => select( STORE )?.getBreadcrumbsTitle();

/**
 * Gets the Twitter image src from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image src.
 */
export const getCanonical = () => select( STORE )?.getCanonical();

/**
 * Gets the WordProof timestamp value.
 *
 * @param {Object} state The state.
 *
 * @returns {string} WordProof timestamp value.
 */
export const getWordProofTimestamp = () => select( STORE )?.getWordProofTimestamp() ? "1" : "0";
