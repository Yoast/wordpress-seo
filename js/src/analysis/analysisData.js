/* global YoastSEO */

import merge from "lodash/merge";

import measureTextWidth from "../helpers/measureTextWidth";

/**
 * Retrieves the data needed for the analyses.
 *
 * We use the following data sources:
 * 1. Redux Store.
 * 2. Custom data callbacks.
 * 3. Pluggable modifications.
 *
 * @param {Object}             store              The redux store.
 * @param {CustomAnalysisData} customAnalysisData The custom analysis data.
 * @param {Pluggable}          pluggable          The Pluggable.
 *
 * @returns {Object} The paper data used for the analyses.
 */
export default function getAnalysisData( store, customAnalysisData, pluggable ) {
	let rawData = store.getState();
	rawData = merge( rawData, customAnalysisData.getData() );

	// Make a data structure for the paper data.
	const data = {
		text: rawData.text,
		keyword: rawData.keyword,
		synonyms: rawData.synonyms,
		description: rawData.analysisData.snippet.description,
		title: rawData.analysisData.snippet.title,
		url: rawData.snippetEditor.data.slug,
		permalink: rawData.settings.snippetEditor.baseUrl + rawData.snippetEditor.data.slug,
	};

	// Modify the data through pluggable.
	if ( pluggable.loaded ) {
		data.title = pluggable._applyModifications( "data_page_title", data.title );
		data.description = pluggable._applyModifications( "data_meta_desc", data.description );
	}

	data.titleWidth = measureTextWidth( data.title );
	// TODO: change this to getContentLocale after PR #10605 gets merged.
	data.locale = YoastSEO.app.config.locale;

	return data;
}
