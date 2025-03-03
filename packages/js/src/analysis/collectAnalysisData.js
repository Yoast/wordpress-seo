import { applyFilters } from "@wordpress/hooks";
import {
	cloneDeep,
	merge,
	get,
} from "lodash";
import { serialize } from "@wordpress/blocks";

import measureTextWidth from "../helpers/measureTextWidth";
import getContentLocale from "./getContentLocale";
import getWritingDirection from "./getWritingDirection";

import { Paper } from "yoastseo";

/* eslint-disable complexity */
/**
 * Maps the Gutenberg blocks to a format that can be used in the analysis.
 *
 * @param {object[]} blocks The Gutenberg blocks.
 * @returns {object[]} The mapped Gutenberg blocks.
 */
export const mapGutenbergBlocks = ( blocks ) => {
	blocks = blocks.filter( block => block.isValid );
	blocks = blocks.map( block => {
		const serializedBlock = serialize( [ block ], { isInnerBlocks: false } );
		block.blockLength = serializedBlock && serializedBlock.length;
		if ( block.innerBlocks ) {
			block.innerBlocks = mapGutenbergBlocks( block.innerBlocks );
		}
		return block;
	} );
	return blocks;
};

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
		blocks = blockEditorDataModule.getBlocks() || [];
		/*
		* We need to clone the blocks to prevent the original blocks from being modified.
		* This is necessary because otherwise, invalid blocks will be removed from the editor.
		* We are using JSON.parse and JSON.stringify to clone the blocks over lodash.cloneDeep or structuredClone for the following reasons:
		* - lodash.cloneDeep cannot handle private members of classes from the blocks.
		* - structuredClone failed in cloning invalid blocks.
		* - Both methods will result in the analysis failing because the blocks are not cloned correctly.
		*
		* We are aware of the performance implications of using JSON.parse and JSON.stringify.
		* However, considering the reasons we've mentioned above regarding the other methods, and we're running this once and not recursively,
		* we consider the performance impact to be negligible.
		* */
		blocks = JSON.parse( JSON.stringify( blocks ) );
		blocks = mapGutenbergBlocks( blocks );
	}

	// Make a data structure for the paper data.
	const data = {
		text: editData.content,
		textTitle: editData.title,
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

	const filteredSEOTitle = storeData.analysisData.snippet.filteredSEOTitle;
	// When measuring the SEO title width, we exclude the separator and the site title from the calculation.
	data.titleWidth = measureTextWidth( filteredSEOTitle || storeData.snippetEditor.data.title );
	data.locale = getContentLocale();
	data.writingDirection = getWritingDirection();
	data.shortcodes = window.wpseoScriptData.analysis.plugins.shortcodes
		? window.wpseoScriptData.analysis.plugins.shortcodes.wpseo_shortcode_tags
		: [];
	data.isFrontPage = get( window, "wpseoScriptData.isFrontPage", "0" ) === "1";

	return Paper.parse( applyFilters( "yoast.analysis.data", data ) );
}
