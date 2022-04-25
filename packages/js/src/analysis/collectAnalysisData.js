import {
	cloneDeep,
	merge,
} from "lodash-es";

import measureTextWidth from "../helpers/measureTextWidth";
import getContentLocale from "./getContentLocale";

import { Paper } from "yoastseo";

/**
 * Filters the WordPress block editor block data to use for the analysis.
 *
 * @param {Object} block The block from which we need to get the relevant data.
 *
 * @returns {Object} The block, with irrelevant data removed.
 */
function filterBlockData( block ) {
	const filteredBlock = {};

	// Main data of the block (content, but also heading level etc.)
	filteredBlock.attributes = {};

	// Heading level, HTML-content and image alt text.
	const attributeNames = [ "level", "content", "alt" ];
	attributeNames.forEach( name => {
		if ( block.attributes[ name ] ) {
			filteredBlock.attributes[ name ] = block.attributes[ name ];
		}
	} );

	// Type of block, e.g. "core/paragraph"
	filteredBlock.name = block.name;
	filteredBlock.clientId = block.clientId;

	// Recurse on inner blocks.
	filteredBlock.innerBlocks = block.innerBlocks.map( innerBlock => filterBlockData( innerBlock ) );

	return filteredBlock;
}

/**
 * Retrieves the data needed for the analyses.
 *
 * We use the following data sources:
 * 1. Redux Store.
 * 2. Custom data callbacks.
 * 3. Pluggable modifications.
 * 4. The WordPress block-editor Redux store.
 *
 * @param {Object}             editorData             The editorData instance.
 * @param {Object}             store                  The redux store.
 * @param {CustomAnalysisData} customAnalysisData     The custom analysis data.
 * @param {Pluggable}          pluggable              The Pluggable.
 * @param {Object}            [blockEditorDataModule] The WordPress block editor data module. E.g. `window.wp.data.select("core/block-editor")`
 *
 * @returns {Paper} The paper data used for the analyses.
 */
export default function collectAnalysisData( editorData, store, customAnalysisData, pluggable, blockEditorDataModule ) {
	const storeData = cloneDeep( store.getState() );
	merge( storeData, customAnalysisData.getData() );
	const editData = editorData.getData();

	// Retrieve the block editor blocks from WordPress and filter on useful information.
	let blocks = null;
	if ( blockEditorDataModule ) {
		blocks = blockEditorDataModule.getBlocks();
		blocks = blocks.map( block => filterBlockData( block ) );
	}

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
		slug: storeData.snippetEditor.data.slug,
		permalink: storeData.settings.snippetEditor.baseUrl + storeData.snippetEditor.data.slug,
		wpBlocks: blocks,
		date: storeData.settings.snippetEditor.date,
	};

	// Modify the data through pluggable.
	if ( pluggable.loaded ) {
		data.title = pluggable._applyModifications( "data_page_title", data.title );
		data.title = pluggable._applyModifications( "title", data.title );
		data.description = pluggable._applyModifications( "data_meta_desc", data.description );
		data.text = pluggable._applyModifications( "content", data.text );
		data.wpBlocks = pluggable._applyModifications( "wpBlocks", data.wpBlocks );
	}

	data.titleWidth = measureTextWidth( data.title );
	data.locale = getContentLocale();

	return Paper.parse( data );
}
