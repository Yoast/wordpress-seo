import SearchMetadataFields from "../../helpers/fields/SearchMetadataFields";

export const LOAD_SEARCH_METADATA = "LOAD_SEARCH_METADATA";
export const SET_SEARCH_METADATA_TITLE = "SET_SEARCH_METADATA_TITLE";
export const SET_SEARCH_METADATA_DESCRIPTION = "SET_SEARCH_METADATA_DESCRIPTION";
export const SET_SEARCH_METADATA_KEYPHRASE = "SET_SEARCH_METADATA_KEYPHRASE";

/**
 * Loads the search metadata.
 *
 * @returns {object} The action object.
 */
export const loadSearchMetadata = () => {
	return {
		type: LOAD_SEARCH_METADATA,
		title: SearchMetadataFields.title,
		description: SearchMetadataFields.description,
		keyphrase: SearchMetadataFields.keyphrase,
	};
};

/**
 * Updates the title.
 *
 * @param {string} title The title.
 *
 * @returns {Object} An action for redux.
 */
export const setSearchMetadataTitle = ( title ) => {
	SearchMetadataFields.title = title;
	return {
		type: SET_SEARCH_METADATA_TITLE,
		title,
	};
};

/**
 * Updates the description.
 *
 * @param {string} description The description.
 *
 * @returns {Object} An action for redux.
 */
export const setSearchMetadataDescription = ( description ) => {
	SearchMetadataFields.description = description;
	return {
		type: SET_SEARCH_METADATA_DESCRIPTION,
		description,
	};
};

/**
 * Updates the keyphrase.
 *
 * @param {string} keyphrase The keyphrase.
 *
 * @returns {Object} An action for redux.
 */
export const setSearchMetadataKeyphrase = ( keyphrase ) => {
	SearchMetadataFields.keyphrase = keyphrase;
	return {
		type: SET_SEARCH_METADATA_KEYPHRASE,
		keyphrase,
	};
};