import { ASYNC_STATUS } from "@yoast/admin-ui-toolkit/constants";
import { get, head, reduce } from "lodash";
import { getScoreForIcon } from "../helpers";
import { applyReplacevars } from "../helpers/apply-replacevars";

/**
 * Returns general messages.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The general messages.
 */
export function getNotifications( state ) {
	return get( state, "notifications", [] );
}

/**
 * Returns the options object.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The options object.
 */
export function getOptions( state ) {
	return get( state, "options", {} );
}

/**
 * Returns the option in state for option path.
 *
 * @param {Object} state The state.
 * @param {string} optionPath Path in state to the option you need.
 *
 * @returns {Object} The option.
 */
export function getOption( state, optionPath ) {
	return get( state, `options.${ optionPath }` );
}

/**
 * Returns the settings object.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The settings object.
 */
export function getSettings( state ) {
	return get( state, "settings", {} );
}

/**
 * Returns the setting in state for setting path.
 *
 * @param {Object} state The state.
 * @param {string} settingPath Path in state to the setting you need.
 *
 * @returns {Object} The setting.
 */
export function getSetting( state, settingPath ) {
	return get( state, `settings.${ settingPath }` );
}

/**
 * Returns the list data in state for data path.
 *
 * @param {Object} state The state.
 * @param {string} dataPath Optional path in state to get data from.
 *
 * @returns {Object} The data.
 */
export function getListData( state, dataPath = "" ) {
	if ( dataPath ) {
		return get( state, `list.data.${ dataPath }` );
	}
	return get( state, "list.data" );
}

/**
 * Returns the original detail data in state for data path.
 *
 * @param {Object} state The state.
 * @param {string} dataPath Optional path in state to get data from.
 *
 * @returns {Object} The original data before changing.
 */
export function getOriginalData( state, dataPath = "" ) {
	return get( state, `detail.original${ dataPath && `.${ dataPath }` }` );
}

/**
 * Returns the detail data in state for data path.
 *
 * @param {Object} state The state.
 * @param {string} dataPath Optional path in state to get data from.
 *
 * @returns {Object} The data.
 */
export function getData( state, dataPath = "" ) {
	return get( state, `detail.data${ dataPath && `.${ dataPath }` }` );
}

/**
 * Returns the detail metadata in state for data path.
 *
 * @param {Object} state The state.
 * @param {string} dataPath Optional path in state to get data from.
 *
 * @returns {Object} The data.
 */
export function getMetadata( state, dataPath = "" ) {
	return get( state, `detail.metadata${ dataPath && `.${ dataPath }` }` );
}

/**
 * Returns the query object.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The query object.
 */
export function getQuery( state ) {
	return get( state, "list.query", {} );
}

/**
 * Returns the query data for given path.
 *
 * @param {Object} state The state.
 * @param {Object} dataPath Optional path in state to get data from.
 * @param {*} fallback Fallback value when nothing is found at path in state.
 *
 * @returns {Object} The query data object.
 */
export function getQueryData( state, dataPath = "", fallback = "" ) {
	return get( state, `list.query.data${ dataPath && `.${ dataPath }` }`, fallback );
}

/**
 * Get the status of the save async action.
 * @param {Object} state The current state.
 * @param {Object} dataPath Optional path in state to get data from.
 * @returns {string} Status of the save async action.
 */
export const getSaveStatus = ( state, dataPath = "status" ) => get( state, `detail.save.${ dataPath }`, ASYNC_STATUS.idle );

/**
 * Get the status of the save async action.
 * @param {Object} state The current state.
 * @returns {string} Status of the save async action.
 */
export const getDetailStatus = ( state ) => get( state, "detail.get.status", ASYNC_STATUS.idle );

/**
 * Get a save error.
 * @param {Object} state The current state.
 * @param {string} path The path in state to get error for.
 * @returns {string[]} Possibly empty array of error messages.
 */
export const getDetailError = ( state ) => get( state, "detail.get.error", "" );

/**
 * Returns the SEO title or a fallback.
 *
 * @param {Object} state The state.
 * @param {string} contentTypeKey The content type key.
 *
 * @returns {string} The SEO title or a fallback.
 */
export function getSeoTitleOrFallback( state, contentTypeKey ) {
	return getData( state, "seo.title" ) ||
		getSetting( state, `contentTypes.${ contentTypeKey }.templates.seo.single.title` ) ||
		getData( state, "fallbacks.seo.title" ) ||
		getData( state, "title" ) ||
		"";
}

/**
 * Returns the meta description or a fallback.
 *
 * @param {Object} state The state.
 * @param {string} contentTypeKey The content type key.
 *
 * @returns {string} The meta description or a fallback.
 */
export function getSeoDescriptionOrFallback( state, contentTypeKey ) {
	return getData( state, "seo.description" ) ||
		getSetting( state, `contentTypes.${ contentTypeKey }.templates.seo.single.description` ) ||
		getData( state, "fallbacks.seo.description" ) ||
		"";
}

/**
 * Returns the SEO title or a fallback.
 *
 * @param {Object} state The state.
 * @param {string} contentTypeKey The content type key.
 * @param {number} index Index of the item in the list.
 *
 * @returns {string} The SEO title or a fallback.
 */
export function getListSeoTitleOrFallback( state, contentTypeKey, index ) {
	return getListData( state, `items.${ index }.seo.title` ) ||
		getSetting( state, `contentTypes.${ contentTypeKey }.templates.seo.single.title` ) ||
		getListData( state, `items.${ index }.fallbacks.seo.title` ) ||
		getListData( state, `items.${ index }.title` ) ||
		"";
}

/**
 * Returns the meta description or a fallback.
 *
 * @param {Object} state The state.
 * @param {string} contentTypeKey The content type key.
 * @param {number} index Index of the item in the list.
 *
 * @returns {string} The meta description or a fallback.
 */
export function getListSeoDescriptionOrFallback( state, contentTypeKey, index ) {
	return getListData( state, `items.${ index }.seo.description` ) ||
		getSetting( state, `contentTypes.${ contentTypeKey }.templates.seo.single.description` ) ||
		getListData( state, `items.${ index }.fallbacks.seo.description` ) ||
		"";
}

/**
 * Returns the processed list data in state for data path.
 *
 * Processed means applying replacevars over the SEO title and description.
 * And the SEO data using fallbacks if the original data is empty.
 *
 * @param {Object} state The state.
 * @param {string} scope The content type scope for fallbacks and replacevars.
 *
 * @returns {Object} The data.
 */
export function getProcessedListData( state, scope = "" ) {
	const data = getListData( state );

	// Apply SEO fallbacks and replacevars to items.
	return {
		...data,
		items: data.items.map( ( item, index ) => ( {
			...item,
			seo: applyReplacevars(
				{ scope: `list.${ scope }` },
				{
					title: getListSeoTitleOrFallback( state, scope, index ),
					description: getListSeoDescriptionOrFallback( state, scope, index ),
				},
				[ index ],
			),
		} ) ),
	};
}

/**
 * Returns the analysis data.
 *
 * @param {Object} state The state.
 * @param {string} scope The content type scope.
 *
 * @returns {Object} The analysis data.
 */
export function getAnalysisData( state, scope ) {
	const data = getData( state );
	let text = data.description;

	data.images.forEach( image => {
		text += `<img src=${ image.url } alt=${ image.alt ?? "" }>`;
	} );

	return {
		text,
		keyphrase: data.keyphrases.focus,
		synonyms: data.keyphrases.synonyms.focus,
		seo: applyReplacevars( { scope }, {
			title: getSeoTitleOrFallback( state, scope ),
			description: getSeoDescriptionOrFallback( state, scope ),
		} ),
		url: data.slug,
		isCornerstone: data.isCornerstone,
		locale: getOption( state, "locale" ),
		permalink: getMetadata( state, "previewUrl" ),
	};
}

/**
 * Gets the readability analysis results for the focus keyphrase.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The readability analysis results.
 */
export function getReadabilityResults( state ) {
	return get( state, "detail.analysis.focus.readability", {} );
}

/**
 * Gets the SEO analysis results for the focus keyphrase.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The SEO analysis results.
 */
export function getSeoResults( state ) {
	return get( state, "detail.analysis.focus.seo", {} );
}

/**
 * Gets the readability analysis score for the focus keyphrase.
 *
 * @param {Object} state The state.
 *
 * @returns {number} The readability analysis score.
 */
export function getReadabilityScore( state ) {
	return getScoreForIcon( get( state, "detail.data.scores.readability", null ) );
}

/**
 * Gets the SEO analysis score for the focus keyphrase.
 *
 * @param {Object} state The state.
 *
 * @returns {number} The SEO analysis score.
 */
export function getSeoScore( state ) {
	return getScoreForIcon( get( state, "detail.data.scores.seo", null ) );
}

/**
 * Gets the marker ID.
 *
 * @param {Object} state The state.
 *
 * @returns {string|null} The marker ID or null.
 */
export function getMarkerId( state ) {
	return get( state, "detail.analysis.marker.id", null );
}

/**
 * Gets the active mark.
 *
 * @param {Object} state The state.
 *
 * @returns {Object[]} The marks.
 */
export function getMarks( state ) {
	return get( state, "detail.analysis.marker.marks", [] );
}

/**
 * Gets the related keyphrases.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The related keyphrases.
 */
export function getRelatedKeyphrases( state ) {
	return get( state, "detail.data.keyphrases.related", {} );
}

/**
 * Gets the synonyms.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The synonyms.
 */
export function getSynonyms( state ) {
	return get( state, "detail.data.keyphrases.synonyms", {} );
}

/**
 * Gets all the related keyphrases data: key, keyphrase, synonyms, results and score.
 *
 * @param {Object} state The state.
 *
 * @returns {Object[]} All the related keyphrases data.
 */
export function getAllRelatedKeyphrasesData( state ) {
	const keyphrases = getRelatedKeyphrases( state );
	const synonyms = getSynonyms( state );
	const results = get( state, "detail.analysis.related", {} );

	return reduce( keyphrases, ( result, keyphrase, key ) => {
		if ( key && keyphrase ) {
			result.push( {
				key,
				keyphrase: keyphrase,
				synonyms: synonyms[ key ] ?? "",
				results: results[ key ]?.results ?? {},
				score: getScoreForIcon( results[ key ]?.score ),
			} );
		}

		return result;
	}, [] );
}

/**
 * Gets the first available related keyphrase key.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The first available related keyphrase key, or an empty string.
 */
export function getFirstAvailableRelatedKeyphraseKey( state ) {
	return head( get( state, "detail.analysis.related.availableKeys", [] ) ) ?? "";
}

/**
 * Gets the related keyphrases with their synonyms.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The related keyphrases with their synonyms.
 */
export function getRelatedKeyphrasesWithSynonyms( state ) {
	const keyphrases = getRelatedKeyphrases( state );
	const synonyms = getSynonyms( state );

	return reduce( keyphrases, ( result, keyphrase, key ) => {
		result[ key ] = {
			// Called keyword for the analysis worker.
			keyword: keyphrase,
			synonyms: synonyms[ key ] ?? "",
		};

		return result;
	}, {} );
}

/**
 * Returns the analysis data for the related keyphrases.
 *
 * @param {Object} state The state.
 * @param {string} scope The content type scope.
 *
 * @returns {Object} The analysis data.
 */
export function getRelatedKeyphrasesAnalysisData( state, scope ) {
	return {
		...getAnalysisData( state, scope ),
		relatedKeyphrases: getRelatedKeyphrasesWithSynonyms( state ),
	};
}

/**
 * Returns the keyphrase forms from the morphology research state.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The keyphrase forms.
 */
export function getKeyphraseWordForms( state ) {
	return get( state, "detail.analysis.research.morphology.keyphraseForms", [] ).flat();
}
