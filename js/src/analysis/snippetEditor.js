import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";

/**
 * Gets the snippet editor data from a data collector.
 *
 * @param {PostDataCollector|TermDataCollector} collector The collector to get the data from.
 *
 * @returns {Object} The snippet editor data object.
 */
function getDataFromCollector( collector ) {
	return {
		title: collector.getSnippetTitle(),
		slug: collector.getSnippetCite(),
		description: collector.getSnippetMeta(),
	};
}

/**
 * Gets the snippet editor data from a data collector.
 *
 * @param {Object} store The redux store to get the data from.
 *
 * @returns {Object} The snippet editor data object.
 */
function getDataFromStore( store ) {
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
function getTemplatesFromL10n( l10nObject ) {
	const templates = {};

	if ( isUndefined( l10nObject ) ) {
		return templates;
	}

	templates.title = l10nObject.title_template;
	if ( isEmpty( templates.title ) ) {
		templates.title = "%%title%% - %%sitename%%";
	}

	const description = l10nObject.metadesc_template;
	if ( ! isEmpty( description ) ) {
		templates.description = description;
	}

	return templates;
}

export default {
	getDataFromCollector,
	getDataFromStore,
	getTemplatesFromL10n,
};
