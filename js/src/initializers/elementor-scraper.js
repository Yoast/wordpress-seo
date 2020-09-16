/* global wpseoScriptData */

// External dependencies.
import { App } from "yoastseo";
import {
	isUndefined,
	debounce,
} from "lodash-es";
import {
	setReadabilityResults,
	setSeoResultsForKeyword,
} from "yoast-components";
import { isShallowEqualObjects } from "@wordpress/is-shallow-equal";
import { select, subscribe } from "@wordpress/data";

// Internal dependencies.
import YoastReplaceVarPlugin from "../analysis/plugins/replacevar-plugin";
import YoastShortcodePlugin from "../analysis/plugins/shortcode-plugin";
import YoastMarkdownPlugin from "../analysis/plugins/markdown-plugin";
import * as tinyMCEHelper from "../lib/tinymce";
import CompatibilityHelper from "../compatibility/compatibilityHelper";
import Pluggable from "../lib/Pluggable";
import requestWordsToHighlight from "../analysis/requestWordsToHighlight.js";

// Analysis dependencies.
import { createAnalysisWorker, getAnalysisConfiguration } from "../analysis/worker";
import refreshAnalysis, { initializationDone } from "../analysis/refreshAnalysis";
import collectAnalysisData from "../analysis/collectAnalysisData";
import getTranslations from "../analysis/getTranslations";
import isKeywordAnalysisActive from "../analysis/isKeywordAnalysisActive";
import isContentAnalysisActive from "../analysis/isContentAnalysisActive";
import snippetEditorHelpers from "../analysis/snippetEditor";
import CustomAnalysisData from "../analysis/CustomAnalysisData";
import getApplyMarks from "../analysis/getApplyMarks";
import { refreshDelay } from "../analysis/constants";
import handleWorkerError from "../analysis/handleWorkerError";
import initializeUsedKeywords from "./used-keywords-assessment";

// Redux dependencies.
import { setFocusKeyword } from "../redux/actions/focusKeyword";
import { setMarkerStatus } from "../redux/actions/markerButtons";
import { updateData } from "../redux/actions/snippetEditor";
import { setWordPressSeoL10n, setYoastComponentsL10n } from "../helpers/i18n";
import { setCornerstoneContent } from "../redux/actions/cornerstoneContent";
import { refreshSnippetEditor } from "../redux/actions/snippetEditor.js";

setYoastComponentsL10n();
setWordPressSeoL10n();

// Plugin class prototypes (not the instances) are being used by other plugins from the window.
window.YoastReplaceVarPlugin = YoastReplaceVarPlugin;
window.YoastShortcodePlugin = YoastShortcodePlugin;

/**
 * @summary Initializes the post scraper script.
 *
 * @param {object} $ jQuery
 * @param {object} store The Yoast editor store.
 * @param {object} editorData The editor data.
 *
 * @returns {void}
 */
export default function initPostScraper( $, store, editorData ) {
	if ( typeof wpseoScriptData === "undefined" ) {
		return;
	}
	let app;
	const customAnalysisData = new CustomAnalysisData();

	/**
	 * Returns the arguments necessary to initialize the app.
	 *
	 * @param {Object} store The store.
	 *
	 * @returns {Object} The arguments to initialize the app
	 */
	function getAppArgs( store ) {
		const args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [
//				"yoast_wpseo_focuskw",
//				"yoast_wpseo_metadesc",
			],
			targets: {
				output: "does-not-really-exist-but-it-needs-something",
				contentOutput: "also-does-not-really-exist-but-it-needs-something",
			},
			callbacks: {
				getData: editorData.getData,
			},
			locale: wpseoScriptData.metabox.contentLocale,
			marker: getApplyMarks( store ),
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive(),
			hasSnippetPreview: false,
			debouncedRefresh: false,
		};

		if ( isKeywordAnalysisActive() ) {
			store.dispatch( setFocusKeyword( $( "#yoast_wpseo_focuskw" ).val() ) );

			args.callbacks.saveScores = () => {};
			args.callbacks.updatedKeywordsResults = function( results ) {
				const keyword = store.getState().focusKeyword;

				store.dispatch( setSeoResultsForKeyword( keyword, results ) );
				store.dispatch( refreshSnippetEditor() );
			};
		}

		if ( isContentAnalysisActive() ) {
			args.callbacks.saveContentScore = () => {};
			args.callbacks.updatedContentResults = function( results ) {
				store.dispatch( setReadabilityResults( results ) );
				store.dispatch( refreshSnippetEditor() );
			};
		}

		const translations = getTranslations();
		if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
			args.translations = translations;
		}
		return args;
	}

	/**
	 * Overwrites YoastSEO.js' app renderers.
	 *
	 * @param {Object} yoastSeoApp YoastSEO.js app.
	 *
	 * @returns {void}
	 */
	function disableYoastSEORenderers( yoastSeoApp ) {
		if ( ! isUndefined( yoastSeoApp.seoAssessorPresenter ) ) {
			yoastSeoApp.seoAssessorPresenter.render = function() {};
		}
		if ( ! isUndefined( yoastSeoApp.contentAssessorPresenter ) ) {
			yoastSeoApp.contentAssessorPresenter.render = function() {};
			yoastSeoApp.contentAssessorPresenter.renderIndividualRatings = function() {};
		}
	}

	let currentAnalysisData;

	/**
	 * Rerun the analysis when the title or meta description in the snippet changes.
	 *
	 * @param {Object}   store            The store.
	 * @param {Function} _refreshAnalysis Function that triggers a refresh of the analysis.
	 *
	 * @returns {void}
	 */
	function handleStoreChange( store, _refreshAnalysis ) {
		const previousAnalysisData = currentAnalysisData || "";
		currentAnalysisData = store.getState().analysisData.snippet;

		const isDirty = ! isShallowEqualObjects( previousAnalysisData, currentAnalysisData );
		if ( isDirty ) {
			_refreshAnalysis();
		}
	}

	/**
	 * Handles page builder compatibility, regarding the marker buttons.
	 *
	 * @returns {void}
	 */
	function handlePageBuilderCompatibility() {
		const compatibilityHelper = new CompatibilityHelper();

		if ( compatibilityHelper.isClassicEditorHidden() ) {
			tinyMCEHelper.disableMarkerButtons();
		}

		if ( compatibilityHelper.vcActive ) {
			tinyMCEHelper.disableMarkerButtons();
		} else {
			compatibilityHelper.listen( {
				classicEditorHidden: () => {
					tinyMCEHelper.disableMarkerButtons();
				},
				classicEditorShown: () => {
					if ( ! tinyMCEHelper.isTextViewActive() ) {
						tinyMCEHelper.enableMarkerButtons();
					}
				},
			} );
		}
	}

	/**
	 * Toggles the markers status in the state, based on the editor mode.
	 *
	 * @param {string} editorMode The editor mode.
	 * @param {Object} store      The store to update.
	 *
	 * @returns {void}
	 */
	function toggleMarkers( editorMode, store ) {
		if ( editorMode === "visual" ) {
			store.dispatch( setMarkerStatus( "enabled" ) );

			return;
		}

		store.dispatch( setMarkerStatus( "disabled" ) );
	}

	/**
	 * Gets the current editor mode from the state.
	 *
	 * @returns {string} The current editor mode.
	 */
	function getEditorMode() {
		return select( "core/edit-post" ).getEditorMode();
	}

	/**
	 * Initializes analysis for the post edit screen.
	 *
	 * @returns {void}
	 */
	function initializePostAnalysis() {
		tinyMCEHelper.setStore( store );
		tinyMCEHelper.wpTextViewOnInitCheck();
		handlePageBuilderCompatibility();

		const appArgs = getAppArgs( store );
		app = new App( appArgs );

		// Content analysis
		window.YoastSEO = window.YoastSEO || {};
		window.YoastSEO.app = app;
		window.YoastSEO.store = store;
		window.YoastSEO.analysis = {};
		window.YoastSEO.analysis.worker = createAnalysisWorker();
		window.YoastSEO.analysis.collectData = () => collectAnalysisData(
			editorData,
			store,
			customAnalysisData,
			app.pluggable,
			select( "core/block-editor" )
		);
		window.YoastSEO.analysis.applyMarks = ( paper, marks ) => getApplyMarks( store )( paper, marks );

		// YoastSEO.app overwrites.
		window.YoastSEO.app.refresh = debounce( () => refreshAnalysis(
			window.YoastSEO.analysis.worker,
			window.YoastSEO.analysis.collectData,
			window.YoastSEO.analysis.applyMarks,
			store,
			editorData,
		), refreshDelay );
		window.YoastSEO.app.registerCustomDataCallback = customAnalysisData.register;
		window.YoastSEO.app.pluggable = new Pluggable( window.YoastSEO.app.refresh );
		window.YoastSEO.app.registerPlugin = window.YoastSEO.app.pluggable._registerPlugin;
		window.YoastSEO.app.pluginReady = window.YoastSEO.app.pluggable._ready;
		window.YoastSEO.app.pluginReloaded = window.YoastSEO.app.pluggable._reloaded;
		window.YoastSEO.app.registerModification = window.YoastSEO.app.pluggable._registerModification;
		window.YoastSEO.app.registerAssessment = ( name, assessment, pluginName ) => {
			if ( ! isUndefined( app.seoAssessor ) ) {
				return window.YoastSEO.app.pluggable._registerAssessment( app.defaultSeoAssessor, name, assessment, pluginName ) &&
					window.YoastSEO.app.pluggable._registerAssessment( app.cornerStoneSeoAssessor, name, assessment, pluginName );
			}
		};
		window.YoastSEO.app.changeAssessorOptions = function( assessorOptions ) {
			window.YoastSEO.analysis.worker.initialize( assessorOptions ).catch( handleWorkerError );
			window.YoastSEO.app.refresh();
		};

		initializeUsedKeywords( app.refresh, "get_focus_keyword_usage", store );
		store.subscribe( handleStoreChange.bind( null, store, app.refresh ) );

		// Backwards compatibility.
		window.YoastSEO.analyzerArgs = appArgs;

		// Analysis plugins
		window.YoastSEO.wp = {};
		window.YoastSEO.wp.replaceVarsPlugin = new YoastReplaceVarPlugin( app, store );
//		window.YoastSEO.wp.shortcodePlugin = new YoastShortcodePlugin( {
//			registerPlugin: app.registerPlugin,
//			registerModification: app.registerModification,
//			pluginReady: app.pluginReady,
//			pluginReloaded: app.pluginReloaded,
//		} );

		if ( wpseoScriptData.metabox.markdownEnabled ) {
			const markdownPlugin = new YoastMarkdownPlugin( app.registerPlugin, app.registerModification );
			markdownPlugin.register();
		}

		window.YoastSEO.wp._tinyMCEHelper = tinyMCEHelper;

		// Initialize the analysis worker.
		window.YoastSEO.analysis.worker.initialize( getAnalysisConfiguration() )
			.then( () => {
				jQuery( window ).trigger( "YoastSEO:ready" );
			} )
			.catch( handleWorkerError );

		// Hack needed to make sure Publish box and traffic light are still updated.
		disableYoastSEORenderers( app );
		const originalInitAssessorPresenters = app.initAssessorPresenters.bind( app );
		app.initAssessorPresenters = function() {
			originalInitAssessorPresenters();
			disableYoastSEORenderers( app );
		};

		// Set refresh function. data.setRefresh is only defined when Gutenberg is available.
		if ( editorData.setRefresh ) {
			editorData.setRefresh( app.refresh );
		}

		// Initialize the snippet editor data.
		let snippetEditorData = snippetEditorHelpers.getDataFromCollector( editorData );
		const snippetEditorTemplates = snippetEditorHelpers.getTemplatesFromL10n( wpseoScriptData.metabox );
		snippetEditorData = snippetEditorHelpers.getDataWithTemplates( snippetEditorData, snippetEditorTemplates );

		// Set the initial snippet editor data.
		store.dispatch( updateData( snippetEditorData ) );
		// This used to be a checkbox, then became a hidden input. For consistency, we set the value to '1'.
		store.dispatch( setCornerstoneContent( document.getElementById( "yoast_wpseo_is_cornerstone" ).value === "1" ) );

		// Save the keyword, in order to compare it to store changes.
		let focusKeyword = store.getState().focusKeyword;
		requestWordsToHighlight( window.YoastSEO.analysis.worker.runResearch, store, focusKeyword );
		const refreshAfterFocusKeywordChange = debounce( () => {
			app.refresh();
		}, 50 );

		let previousCornerstoneValue = null;
		store.subscribe( () => {
			// Verify whether the focusKeyword changed. If so, trigger refresh:
			const newFocusKeyword = store.getState().focusKeyword;

			if ( focusKeyword !== newFocusKeyword ) {
				focusKeyword = newFocusKeyword;
				requestWordsToHighlight( window.YoastSEO.analysis.worker.runResearch, store, focusKeyword );

				$( "#yoast_wpseo_focuskw" ).val( focusKeyword );
				refreshAfterFocusKeywordChange();
			}

			const data = snippetEditorHelpers.getDataFromStore( store );
			const dataWithoutTemplates = snippetEditorHelpers.getDataWithoutTemplates( data, snippetEditorTemplates );


			if ( snippetEditorData.title !== data.title ) {
				editorData.setDataFromSnippet( dataWithoutTemplates.title, "snippet_title" );
			}

			if ( snippetEditorData.slug !== data.slug ) {
				editorData.setDataFromSnippet( dataWithoutTemplates.slug, "snippet_cite" );
			}

			if ( snippetEditorData.description !== data.description ) {
				editorData.setDataFromSnippet( dataWithoutTemplates.description, "snippet_meta" );
			}

			const currentState = store.getState();

			if ( previousCornerstoneValue !== currentState.isCornerstone ) {
				previousCornerstoneValue = currentState.isCornerstone;
				document.getElementById( "yoast_wpseo_is_cornerstone" ).value = currentState.isCornerstone;

				app.changeAssessorOptions( {
					useCornerstone: currentState.isCornerstone,
				} );
			}

			snippetEditorData.title = data.title;
			snippetEditorData.slug = data.slug;
			snippetEditorData.description = data.description;
		} );

		initializationDone();
		window.YoastSEO.app.refresh();
	}

	initializePostAnalysis();
}
