import { get } from "lodash";

/**
 * Gets the facebook title from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook title.
 */
export const getFacebookTitle = state => get( state, "facebookEditor.title", "" );

/**
 * Gets the facebook description from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook description.
 */
export const getFacebookDescription = state => get( state, "facebookEditor.description", "" );

/**
 * Gets the facebook image URL from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook image URL.
 */
export const getFacebookImageUrl = state => get( state, "facebookEditor.image.url" );

/**
 * Gets the facebook image type from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook image type.
 */
export const getFacebookImageType = state => get( state, "facebookEditor.image.type", "" );

/**
 * Gets the facebook image src from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook image src.
 */
export const getFacebookImageSrc = state => get( state, "facebookEditor.image.src", "" );

/**
 * Gets the facebook warnings from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook warnings.
 */
export const getFacebookWarnings = state => get( state, "facebookEditor.warnings", [] );

/**
 * Gets the Facebook image alt text from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook image alt text.
 */
export const getFacebookAlt = state => get( state, "facebookEditor.alt", "" );
