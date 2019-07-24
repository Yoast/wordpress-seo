import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";

import measureTextLength from "../helpers/measureTextLength";
import getContentLocale from "./getContentLocale";

import { Paper } from "yoastseo";

/**
 * Retrieves the data needed for the analyses.
 *
 * We use the following data sources:
 * 1. Redux Store.
 * 2. Custom data callbacks.
 * 3. Pluggable modifications.
 *
 * @param {Edit}               edit               The edit instance.
 * @param {Object}             store              The redux store.
 * @param {CustomAnalysisData} customAnalysisData The custom analysis data.
 * @param {Pluggable}          pluggable          The Pluggable.
 *
 * @returns {Paper} The paper data used for the analyses.
 */
export default function collectAnalysisData( edit, store, customAnalysisData, pluggable ) {
	const storeData = cloneDeep( store.getState() );
	merge( storeData, customAnalysisData.getData() );
	const editData = edit.getData().getData();

	// Make a data structure for the paper data.
	const data = {
		text: editData.content,
		keyword: storeData.focusKeyword,
		synonyms: storeData.synonyms,
		/*
		 * The analysis data is provided by the snippet editor. The snippet editor transforms the title and the
		 * description on change only. Therefore, we have to use the original data when the analysis data isn't
		 * available. This data is transformed by the replacevar plugin via pluggable.
		 */
		description: storeData.analysisData.snippet.description || storeData.snippetEditor.data.description,
		title: storeData.analysisData.snippet.title || storeData.snippetEditor.data.title,
		url: storeData.snippetEditor.data.slug,
		permalink: storeData.settings.snippetEditor.baseUrl + storeData.snippetEditor.data.slug,
	};

	// Modify the data through pluggable.
	if ( pluggable.loaded ) {
		data.title = pluggable._applyModifications( "data_page_title", data.title );
		data.title = pluggable._applyModifications( "title", data.title );
		data.description = pluggable._applyModifications( "data_meta_desc", data.description );
		data.text = pluggable._applyModifications( "content", data.text );
	}

	data.titleLength = measureTextLength( data.title );
	data.locale = getContentLocale();

	return Paper.parse( data );
}
