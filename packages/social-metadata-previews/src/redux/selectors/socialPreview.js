import { getFacebookFallback, getFacebookTitleFallback } from "./fallbacks";

/**
 * Gets the socialPreview data from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.socialPreview data.
 */
const getSocialPreview = state => state.socialPreview;

/** FACEBOOK */

/**
 * Gets the facebook data from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Facebook data.
 */
const getFacebookData = state => getSocialPreview( state ).facebook;


/**
 * Gets the facebook title from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Facebook title.
 */
export const getFacebookTitle = state => getFacebookData( state ).title || getFacebookTitleFallback( state ) || "ULTIMATE_FAILURE";

/**
 * Gets the facebook description from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Facebook description.
 */
export const getFacebookDescription = state => getFacebookData( state ).description || getFacebookFallback( state, "description" );

/**
 * Gets the facebook image URL from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Facebook image URL.
 */
export const getFacebookImageUrl = state => getFacebookData( state ).ImageUrl;

/**
 * Gets the facebook image type from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Facebook image type.
 */
export const getFacebookImageType = state => getFacebookData( state ).ImageType;


/**
 * Gets the facebook author from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Facebook author.
 */
export const getFacebookAuthor = state => state.LOCAL.Author;

/**
 * Gets the facebook site name from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Facebook sitename.
 */
export const getFacebookSiteName = state => state.LOCAL.siteName;


/** TWITTER */

/**
 * Gets the twitter data from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Twitter data.
 */
const getTwitterData = state => getSocialPreview( state ).twitter;


/**
 * Gets the twitter title from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Twitter title.
 */
export const getTwitterTitle = state => getTwitterData( state ).title;

/**
 * Gets the twitter description from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Twitter description.
 */
export const getTwitterDescription = state => getTwitterData( state ).description;

/**
 * Gets the twitter image URL from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Twitter image URL.
 */
export const getTwitterImageUrl = state => getTwitterData( state ).ImageUrl;

/**
 * Gets the twitter image type from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Twitter image type.
 */
export const getTwitterImageType = state => getTwitterData( state ).ImageType;


/**
 * Gets the twitter author from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Twitter author.
 */
export const getTwitterAuthor = state => state.LOCAL.Author;

/**
 * Gets the twitter sitename from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String}.Twitter sitename.
 */
export const getTwitterSiteName = state => state.LOCAL.siteName;
