export const SET_NO_INDEX = "SET_NO_INDEX";
export const SET_NO_FOLLOW = "SET_NO_FOLLOW";
export const SET_ADVANCED = "SET_ADVANCED";
export const SET_BREADCRUMBS_TITLE = "SET_BREADCRUMBS_TITLE";
export const SET_CANONICAL_URL = "SET_CANONICAL_URL";
export const SET_WORDPROOF_TIMESTAMP = "SET_WORDPROOF_TIMESTAMP";

/**
 * An action creator for setting the No Index value (Advanced Settings).
 *
 * @param {String} value The value.
 *
 * @returns {Object} The action object.
 */
export const setNoIndex = ( value ) => {
	return { type: SET_NO_INDEX, value };
};

/**
 * An action creator for setting the No Follow value (Advanced Settings).
 *
 * @param {String} value The value.
 *
 * @returns {Object} The action object.
 */
export const setNoFollow = ( value ) => {
	return { type: SET_NO_FOLLOW, value };
};

/**
 * An action creator for setting the Advanced Metarobots setting (Advanced Settings).
 *
 * @param {Array} value The value.
 *
 * @returns {Object} The action object.
 */
export const setAdvanced = ( value ) => {
	return { type: SET_ADVANCED, value };
};

/**
 * An action creator for setting the BreadcrumbsTitle setting (Advanced Settings).
 *
 * @param {String} value The value.
 *
 * @returns {Object} The action object.
 */
export const setBreadcrumbsTitle = ( value ) => {
	return { type: SET_BREADCRUMBS_TITLE, value };
};

/**
 * An action creator for setting the Canonical URL setting (Advanced Settings).
 *
 * @param {String} value The value.
 *
 * @returns {Object} The action object.
 */
export const setCanonical = ( value ) => {
	return { type: SET_CANONICAL_URL, value };
};

/**
 * An action creator for setting the timestamp setting (Advanced Settings).
 *
 * @param {Boolean} value The value.
 *
 * @returns {Object} The action object.
 */
export const setWordProofTimestamp = ( value ) => {
	return { type: SET_WORDPROOF_TIMESTAMP, value };
};
