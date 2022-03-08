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
 * Gets the facebook image src from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook image src.
 */
export const getFacebookImageSrc = state => get( state, "facebookEditor.image.src", "" );

/**
 * Gets the facebook alt text from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook alt text.
 */
export const getFacebookAltText = state => get( state, "facebookEditor.image.alt", "" );

/**
 * Gets the facebook warnings from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Facebook warnings.
 */
export const getFacebookWarnings = state => get( state, "facebookEditor.warnings", [] );
