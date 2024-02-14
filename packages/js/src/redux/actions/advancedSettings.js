import MetaboxFieldSync from "../../helpers/fields/MetaboxFieldSync";

export const SET_NO_INDEX = "SET_NO_INDEX";
export const SET_NO_FOLLOW = "SET_NO_FOLLOW";
export const SET_ADVANCED = "SET_ADVANCED";
export const SET_BREADCRUMBS_TITLE = "SET_BREADCRUMBS_TITLE";
export const SET_CANONICAL_URL = "SET_CANONICAL_URL";
export const SET_WORDPROOF_TIMESTAMP = "SET_WORDPROOF_TIMESTAMP";
export const LOAD_ADVANCED_SETTINGS = "LOAD_ADVANCED_SETTINGS";

/**
 * An action creator for setting the No Index value (Advanced Settings).
 *
 * @param {String} value The value.
 *
 * @returns {Object} The action object.
 */
export const setNoIndex = ( value ) => {
	MetaboxFieldSync.setNoIndex( value );
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
	MetaboxFieldSync.setFieldValueBySingleId( "yoast_wpseo_meta-robots-nofollow", value );
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
	MetaboxFieldSync.setFieldValueBySingleId( "yoast_wpseo_meta-robots-adv", value.join( "," ) );
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
	MetaboxFieldSync.setFieldValue( "bctitle", value );
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
	MetaboxFieldSync.setFieldValue( "canonical", value );
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
	MetaboxFieldSync.setBooleanFieldValue( "wordproof_timestamp", value );
	return { type: SET_WORDPROOF_TIMESTAMP, value };
};

/**
 * An action creator for loading all Advanced Settings data.
 *
 * @returns {object} The action object.
 */
export const loadAdvancedSettingsData = () => {
	const advancedValue = MetaboxFieldSync.getInitialValue( "meta-robots-adv" );
	const advancedList = typeof advancedValue === "string" ? advancedValue.split( "," ) : [];
	return {
		type: LOAD_ADVANCED_SETTINGS,
		settings: {
			noIndex: MetaboxFieldSync.getNoIndex(),
			noFollow: MetaboxFieldSync.getInitialValue( "meta-robots-nofollow" ),
			advanced: advancedList,
			breadcrumbsTitle: MetaboxFieldSync.getInitialValue( "bctitle" ),
			canonical: MetaboxFieldSync.getInitialValue( "canonical" ),
			wordproofTimestamp: MetaboxFieldSync.getInitialValue( "wordproof_timestamp" ) === "1",
			isLoading: false,
		},
	};
};
