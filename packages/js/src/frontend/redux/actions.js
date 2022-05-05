export const ADD_LINKS = "ADD_LINKS";

/**
 * An action creator for adding the links for an indexable.
 *
 * @param {string} url The url of the indexable.
 *
 * @returns {Object} The ADD_LINKS action.
 */
export const addLinks = ( url ) => {
	return { type: ADD_LINKS, payload: { incoming: [], outgoing: [] } };
};
