import {
	isUndefined,
	has,
	forEach,
	isEmpty,
} from "lodash";

/**
 * Gets the snippet editor data from the redux store.
 *
 * @param {Object} store The redux store to get the data from.
 *
 * @returns {Object} The snippet editor data object.
 */
export function getDataFromStore( store ) {
	const state = store.getState();
	const data = state.snippetEditor.data;

	return {
		title: data.title,
		slug: data.slug,
		description: data.description,
	};
}

/**
 * Gets the templates from the localization object.
 *
 * @param {Object} l10nObject The localization object.
 *
 * @returns {Object} The templates object.
 */
export function getTemplatesFromL10n( l10nObject ) {
	const templates = {};

	if ( isUndefined( l10nObject ) ) {
		return templates;
	}

	templates.title = l10nObject.title_template;

	const description = l10nObject.metadesc_template;
	if ( ! isEmpty( description ) ) {
		templates.description = description;
	}

	return templates;
}

/**
 * Add templates to the snippet editor data.
 *
 * @param {Object} data      The data object.
 * @param {Object} templates The templates object.
 *
 * @returns {Object} A copy of the data with the templates applied.
 */
export function getDataWithTemplates( data, templates ) {
	const dataWithTemplates = { ...data };

	forEach( templates, ( template, key ) => {
		if ( has( data, key ) && data[ key ] === "" ) {
			dataWithTemplates[ key ] = template;
		}
	} );

	return dataWithTemplates;
}

/**
 * Remove the templates from the snippet editor data.
 *
 * @param {Object} data      The data object.
 * @param {Object} templates The templates object.

 * @returns {Object} A copy of the data without the templates.
 */
export function getDataWithoutTemplates( data, templates ) {
	const dataWithoutTemplates = { ...data };

	forEach( templates, ( template, key ) => {
		if ( ! has( data, key ) ) {
			return;
		}

		// Trim spaces from the beginning and end of the data to make a fair comparison with the template.
		const trimmedData = data[ key ].trim();

		if ( trimmedData === template ) {
			dataWithoutTemplates[ key ] = "";
		}
	} );

	return dataWithoutTemplates;
}
