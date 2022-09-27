import { get } from "lodash";
import SearchMetadataFields from "../../../helpers/fields/SearchMetadataFields";
import { actions } from "@yoast/externals/redux";

const { UPDATE_DATA, LOAD_SNIPPET_EDITOR_DATA } = actions;

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
		let titleToBeSaved = data.title;
		// Test whether this is actually the template, which we don't want to save.
		if ( data.title === get( window, "wpseoScriptData.metabox.title_template", "" ) ) {
			titleToBeSaved = "";
		}

		SearchMetadataFields.title = titleToBeSaved;
	}
	if ( data.hasOwnProperty( "description" ) ) {
		let metaDescToBeSaved = data.description;
		// Test whether this is actually the template, which we don't want to save.
		if ( data.description === get( window, "wpseoScriptData.metabox.metadesc_template", "" ) ) {
			metaDescToBeSaved = "";
		}
		SearchMetadataFields.description = metaDescToBeSaved;
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
	const titleTemplate = get( window, "wpseoScriptData.metabox.title_template", "" );
	const descriptionTemplate = get( window, "wpseoScriptData.metabox.metadesc_template", "" );

	return {
		type: LOAD_SNIPPET_EDITOR_DATA,
		data: {
			title: SearchMetadataFields.title || titleTemplate,
			description: SearchMetadataFields.description || descriptionTemplate,
			slug: SearchMetadataFields.slug,
		},
		templates: {
			title: titleTemplate,
			description: descriptionTemplate,
		},
	};
};
