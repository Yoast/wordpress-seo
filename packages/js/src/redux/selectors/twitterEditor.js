import { get } from "lodash";

/**
 * Gets the twitter title from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter title.
 */
export const getTwitterTitle = state => get( state, "twitterEditor.title", "" );

/**
 * Gets the twitter description from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter description.
 */
export const getTwitterDescription = state => get( state, "twitterEditor.description", "" );

/**
 * Gets the twitter image URL from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image URL.
 */
export const getTwitterImageUrl = state => get( state, "twitterEditor.image.url", "" );

/**
 * Gets the twitter image type from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image type.
 */
export const getTwitterImageType = state => get( state, "settings.socialPreviews.twitterCardType", "summary" );

/**
 * Gets the Twitter image src from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image src.
 */
export const getTwitterImageSrc = state => get( state, "twitterEditor.image.src", "" );

/**
 * Gets the Twitter alt text from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter alt text.
 */
export const getTwitterAltText = state => get( state, "twitterEditor.image.alt", "" );

/**
 * Gets the Twitter warnings from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter warnings.
 */
export const getTwitterWarnings = state => get( state, "twitterEditor.warnings", [] );
