/* global wpseoScriptData */
import { debounce } from "lodash";
import { select, subscribe } from "@wordpress/data";
import { actions } from "@yoast/externals/redux";
import {
	getDataFromCollector,
	getDataFromStore,
	getDataWithoutTemplates,
	getDataWithTemplates,
	getTemplatesFromL10n,
} from "../../analysis/snippetEditor";
import isKeywordAnalysisActive from "../../analysis/isKeywordAnalysisActive";
import requestWordsToHighlight from "../../analysis/requestWordsToHighlight.js";
import AnalysisFields from "../../helpers/fields/AnalysisFields";
import { isRestMetaActive } from "../../helpers/fields/rest-meta";

const { updateData, setCornerstoneContent, setFocusKeyword } = actions;

/**
 * Initializes the snippet editor data and sets up the store subscriber that keeps the
 * snippet editor and PostDataCollector in sync with the store.
 *
 * @param {Object} store             The Yoast SEO Redux store.
 * @param {Object} postDataCollector The PostDataCollector instance.
 * @param {Object} app               The YoastSEO app instance.
 *
 * @returns {void}
 */
export function initializeSnippetEditorSync( store, postDataCollector, app ) {
	let snippetEditorData = getDataFromCollector( postDataCollector );
	const snippetEditorTemplates = getTemplatesFromL10n( wpseoScriptData.metabox );
	snippetEditorData = getDataWithTemplates( snippetEditorData, snippetEditorTemplates );

	store.dispatch( updateData( snippetEditorData ) );

	if ( isRestMetaActive() && ! select( "core/editor" ).getEditedPostAttribute( "meta" ) ) {
		// In REST meta mode the entity meta hasn't loaded yet, so title, description,
		// keyphrase, and cornerstone all return empty/false values. A single subscriber
		// re-dispatches all four once core/editor makes the meta available.
		const unsubscribeMetaReady = subscribe( () => {
			if ( ! select( "core/editor" ).getEditedPostAttribute( "meta" ) ) {
				return;
			}
			unsubscribeMetaReady();
			const freshData = getDataFromCollector( postDataCollector );
			const freshDataWithTemplates = getDataWithTemplates( freshData, snippetEditorTemplates );
			store.dispatch( updateData( {
				title: freshDataWithTemplates.title,
				description: freshDataWithTemplates.description,
			} ) );
			store.dispatch( setCornerstoneContent( AnalysisFields.isCornerstone ) );
			if ( isKeywordAnalysisActive() ) {
				store.dispatch( setFocusKeyword( AnalysisFields.keyphrase ) );
			}
		}, "core/editor" );
	} else {
		store.dispatch( setCornerstoneContent( AnalysisFields.isCornerstone ) );
	}

	let focusKeyword = store.getState().focusKeyword;
	requestWordsToHighlight( window.YoastSEO.analysis.worker.runResearch, store, focusKeyword );
	const refreshAfterFocusKeywordChange = debounce( () => {
		app.refresh();
	}, 50 );

	let previousCornerstoneValue = null;
	store.subscribe( () => {
		const newFocusKeyword = store.getState().focusKeyword;

		if ( focusKeyword !== newFocusKeyword ) {
			focusKeyword = newFocusKeyword;
			requestWordsToHighlight( window.YoastSEO.analysis.worker.runResearch, store, focusKeyword );

			AnalysisFields.keyphrase = focusKeyword;
			refreshAfterFocusKeywordChange();
		}

		const data = getDataFromStore( store );
		const dataWithoutTemplates = getDataWithoutTemplates( data, snippetEditorTemplates );

		if ( snippetEditorData.title !== data.title ) {
			postDataCollector.setDataFromSnippet( dataWithoutTemplates.title, "snippet_title" );
		}

		if ( snippetEditorData.slug !== data.slug ) {
			postDataCollector.setDataFromSnippet( dataWithoutTemplates.slug, "snippet_cite" );
		}

		if ( snippetEditorData.description !== data.description ) {
			postDataCollector.setDataFromSnippet( dataWithoutTemplates.description, "snippet_meta" );
		}

		const currentState = store.getState();

		if ( previousCornerstoneValue !== currentState.isCornerstone ) {
			previousCornerstoneValue = currentState.isCornerstone;
			AnalysisFields.isCornerstone = currentState.isCornerstone;

			app.changeAssessorOptions( {
				useCornerstone: currentState.isCornerstone,
			} );
		}

		snippetEditorData.title = data.title;
		snippetEditorData.slug = data.slug;
		snippetEditorData.description = data.description;
	} );
}
