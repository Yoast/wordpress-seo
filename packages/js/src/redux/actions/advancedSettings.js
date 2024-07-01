import AdvancedFields from "../../helpers/fields/AdvancedFields";

export const SET_NO_INDEX = "SET_NO_INDEX";
export const SET_NO_FOLLOW = "SET_NO_FOLLOW";
export const SET_ADVANCED = "SET_ADVANCED";
export const SET_BREADCRUMBS_TITLE = "SET_BREADCRUMBS_TITLE";
export const SET_CANONICAL_URL = "SET_CANONICAL_URL";
export const LOAD_ADVANCED_SETTINGS = "LOAD_ADVANCED_SETTINGS";

/**
 * An action creator for setting the No Index value (Advanced Settings).
 *
 * @param {String} value The value.
 *
 * @returns {Object} The action object.
 */
export const setNoIndex = ( value ) => {
	AdvancedFields.noIndex = value;
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
	AdvancedFields.noFollow = value;
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
	AdvancedFields.advanced = value.join( "," );
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
	AdvancedFields.breadcrumbsTitle = value;
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
	AdvancedFields.canonical = value;
	return { type: SET_CANONICAL_URL, value };
};

/**
 * An action creator for loading all Advanced Settings data.
 *
 * @returns {object} The action object.
 */
export const loadAdvancedSettingsData = () => {
	return {
		type: LOAD_ADVANCED_SETTINGS,
		settings: {
			noIndex: AdvancedFields.noIndex,
			noFollow: AdvancedFields.noFollow,
			advanced: AdvancedFields.advanced.split( "," ),
			breadcrumbsTitle: AdvancedFields.breadcrumbsTitle,
			canonical: AdvancedFields.canonical,
			isLoading: false,
		},
	};
};
