import { get } from "lodash";

/**
	 * The factory function creates the selectors for the store related to the social previews.
	 * You should provide, as a string, the path within your store to the social previews.
	 *
	 * E.g.: if your store looks as follows:
	 * state = {
	 *    stuff: {},
	 *    previews: {
	 *         socialPreviews: {
	 *             facebook: {},
	 *             twitter{},
	 *         },
	 *     },
	 * };
	 * you should provide "previews.socialPreviews".
	 *
	 * @param {String} path The path to the social preview slice of the store.
	 *
	 * @returns {Object} An object containing all selector functions.
	 */
const socialMetadataSelectorsFactory = ( path ) => {
	const selectors = {};

	// FACEBOOK

	/**
	 * Gets the facebook data from the state.
	 *
	 * @param {Object} state The state.
	 *
	 * @returns {String} Facebook data.
	 */
	selectors.getFacebookData = state => get( state, `${ path }.facebook`, {} );


	/**
	 * Gets the facebook title from the state.
	 *
	 * @param {Object} state The state.
	 *
	 * @returns {String} Facebook title.
	 */
	selectors.getFacebookTitle = state => selectors.getFacebookData( state ).title;

	/**
	 * Gets the facebook description from the state.
	 *
	 * @param {Object} state The state.
	 *
	 * @returns {String} Facebook description.
	 */
	selectors.getFacebookDescription = state => selectors.getFacebookData( state ).description;

	/**
	 * Gets the facebook image URL from the state.
	 *
	 * @param {Object} state The state.
	 *
	 * @returns {String} Facebook image URL.
	 */
	selectors.getFacebookImageUrl = state => selectors.getFacebookData( state ).image.url;

	/**
	 * Gets the facebook image type from the state.
	 *
	 * @param {Object} state The state.
	 *
	 * @returns {String} Facebook image type.
	 */
	selectors.getFacebookImageType = state => selectors.getFacebookData( state ).image.type;


	// TWITTER

	/**
	 * Gets the twitter data from the state.
	 *
	 * @param {Object} state The state.
	 *
	 * @returns {String} Twitter data.
	 */
	selectors.getTwitterData = state => get( state, `${ path }.twitter`, {} );


	/**
	 * Gets the twitter title from the state.
	 *
	 * @param {Object} state The state.
	 *
	 * @returns {String} Twitter title.
	 */
	selectors.getTwitterTitle = state => selectors.getTwitterData( state ).title;

	/**
	 * Gets the twitter description from the state.
	 *
	 * @param {Object} state The state.
	 *
	 * @returns {String} Twitter description.
	 */
	selectors.getTwitterDescription = state => selectors.getTwitterData( state ).description;

	/**
	 * Gets the twitter image URL from the state.
	 *
	 * @param {Object} state The state.
	 *
	 * @returns {String} Twitter image URL.
	 */
	selectors.getTwitterImageUrl = state => selectors.getTwitterData( state ).image.url;

	/**
	 * Gets the twitter image type from the state.
	 *
	 * @param {Object} state The state.
	 *
	 * @returns {String} Twitter image type.
	 */
	selectors.getTwitterImageType = state => selectors.getTwitterData( state ).image.type;

	return selectors;
};

export default socialMetadataSelectorsFactory;
