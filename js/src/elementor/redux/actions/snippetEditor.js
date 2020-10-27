import { get } from "lodash";
import SearchMetadataFields from "../../../helpers/fields/SearchMetadataFields";
import { UPDATE_DATA, LOAD_SNIPPET_EDITOR_DATA } from "../../../redux/actions";

/**
 * Updates the data of the snippet editor.
 *
 * @param {Object} data               The snippet editor data.
 * @param {string} [data.title]       The title in the snippet editor.
 * @param {string} [data.slug]        The slug in the snippet editor.
 * @param {string} [data.description] The description in the snippet editor.
 *
 * @returns {Object} An action for redux.
 */
export function updateData( data ) {
	/*
	 * Update the appropriate field.
	 * Using a truthy check (e.g. `data.title`) does not work, as it would be false when the string is empty.
	 */
	if ( data.hasOwnProperty( "title" ) ) {
		SearchMetadataFields.title = data.title;
	}
	if ( data.hasOwnProperty( "description" ) ) {
		SearchMetadataFields.description = data.description;
	}
	if ( data.hasOwnProperty( "slug" ) ) {
		SearchMetadataFields.slug = data.slug;
	}

	return {
		type: UPDATE_DATA,
		data,
	};
}

/**
 * Loads the snippet editor data.
 *
 * @returns {Object} The load cornerstone content action.
 */
export const loadSnippetEditorData = () => {
	return {
		type: LOAD_SNIPPET_EDITOR_DATA,
		data: {
			title: SearchMetadataFields.title,
			description: SearchMetadataFields.description,
			slug: SearchMetadataFields.slug,
		},
		templates: {
			title: get( window, "wpseoScriptData.metabox.title_template", "" ),
			description: get( window, "wpseoScriptData.metabox.metadesc_template", "" ),
		},
		isLoading: false,
	};
};
