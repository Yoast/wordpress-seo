/* global YoastSEO: true, wpseoScriptData */

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
import Edit from "./edit";
import YoastReplaceVarPlugin from "../analysis/plugins/replacevar-plugin";
import YoastShortcodePlugin from "../analysis/plugins/shortcode-plugin";
import YoastMarkdownPlugin from "../analysis/plugins/markdown-plugin";
import * as tinyMCEHelper from "../lib/tinymce";
import CompatibilityHelper from "../compatibility/compatibilityHelper";
import Pluggable from "../lib/Pluggable";
import requestWordsToHighlight from "../analysis/requestWordsToHighlight.js";

// UI dependencies.
import * as publishBox from "../ui/publishBox";
import { update as updateTrafficLight } from "../ui/trafficLight";
import { update as updateAdminBar } from "../ui/adminBar";

// Analysis dependencies.
import { createAnalysisWorker, getAnalysisConfiguration } from "../analysis/worker";
import refreshAnalysis, { initializationDone } from "../analysis/refreshAnalysis";
import collectAnalysisData from "../analysis/collectAnalysisData";
import PostDataCollector from "../analysis/PostDataCollector";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import getTranslations from "../analysis/getTranslations";
import isKeywordAnalysisActive from "../analysis/isKeywordAnalysisActive";
import isContentAnalysisActive from "../analysis/isContentAnalysisActive";
import snippetEditorHelpers from "../analysis/snippetEditor";
import CustomAnalysisData from "../analysis/CustomAnalysisData";
import getApplyMarks from "../analysis/getApplyMarks";
import { refreshDelay } from "../analysis/constants";
import handleWorkerError from "../analysis/handleWorkerError";

// Redux dependencies.
import { setFocusKeyword } from "../redux/actions/focusKeyword";
import { setMarkerStatus } from "../redux/actions/markerButtons";
import { updateData } from "../redux/actions/snippetEditor";
import { setWordPressSeoL10n, setYoastComponentsL10n } from "../helpers/i18n";
import { setCornerstoneContent } from "../redux/actions/cornerstoneContent";
import { refreshSnippetEditor } from "../redux/actions/snippetEditor.js";

// Helper dependencies.
import {
	registerReactComponent,
	renderClassicEditorMetabox,
} from "../helpers/classicEditor";
import isGutenbergDataAvailable from "../helpers/isGutenbergDataAvailable";

setYoastComponentsL10n();
setWordPressSeoL10n();

// Plugin class prototypes (not the instances) are being used by other plugins from the window.
window.YoastReplaceVarPlugin = YoastReplaceVarPlugin;
window.YoastShortcodePlugin = YoastShortcodePlugin;

/**
 * @summary Initializes the post scraper script.
 * @param {object} $ jQuery
 * @returns {void}
 */
export default function initPostScraper( $ ) {
	/* eslint-disable-next-line */
	"use strict";
	if ( typeof wpseoScriptData === "undefined" ) {
		return;
	}

	let metaboxContainer;
	let titleElement;
	let app;
	let postDataCollector;
	const customAnalysisData = new CustomAnalysisData();

	let editStore;
	let edit;

	/**
	 * Retrieves either a generated slug or the page title as slug for the preview.
	 *
	 * @param {Object} response The AJAX response object.
	 *
	 * @returns {String} The url path.
	 */
	function getUrlPathFromResponse( response ) {
		if ( response.responseText === "" ) {
			return titleElement.val();
		}
		// Added divs to the response text, otherwise jQuery won't parse to HTML, but an array.
		return jQuery( "<div>" + response.responseText + "</div>" )
			.find( "#editable-post-name-full" )
			.text();
	}

	/**
	 * Binds to the WordPress jQuery function to put the permalink on the page.
	 * If the response matches with permalink string, the snippet can be rendered.
	 */
	jQuery( document ).on( "ajaxComplete", function( ev, response, ajaxOptions ) {
		const ajaxEndPoint = "/admin-ajax.php";
		if ( ajaxEndPoint !== ajaxOptions.url.substr( 0 - ajaxEndPoint.length ) ) {
			return;
		}

		if ( "string" === typeof ajaxOptions.data && -1 !== ajaxOptions.data.indexOf( "action=sample-permalink" ) ) {
			/*
			 * WordPress do not update post name for auto-generated slug, so we should leave this field untouched.
			 */
			postDataCollector.leavePostNameUntouched = true;


			const snippetEditorData = {
				slug: getUrlPathFromResponse( response ),
			};

			editStore.dispatch( updateData( snippetEditorData ) );
		}
	} );

	/**
	 * Determines if markers should be shown.
	 *
	 * @returns {boolean} True when markers should be shown.
	 */
	function displayMarkers() {
		return ! isGutenbergDataAvailable() && wpseoScriptData.metabox.show_markers === "1";
	}

	/**
	 * Updates the store to indicate if the markers should be hidden.
	 *
	 * @param {Object} store The store.
	 *
	 * @returns {void}
	 */
	function updateMarkerStatus( store ) {
		// Only add markers when tinyMCE is loaded and show_markers is enabled (can be disabled by a WordPress hook).
		// Only check for the tinyMCE object because the actual editor isn't loaded at this moment yet.
		if ( typeof window.tinyMCE === "undefined" || ! displayMarkers() ) {
			store.dispatch( setMarkerStatus( "hidden" ) );
		}
	}

	/**
	 * Initializes keyword analysis.
	 *
	 * @param {Object} publishBox             The publish box object.
	 *
	 * @returns {void}
	 */
	function initializeKeywordAnalysis( publishBox ) {
		const savedKeywordScore = $( "#yoast_wpseo_linkdex" ).val();

		const indicator = getIndicatorForScore( savedKeywordScore );

		updateTrafficLight( indicator );
		updateAdminBar( indicator );

		publishBox.updateScore( "keyword", indicator.className );
	}

	/**
	 * Initializes content analysis
	 *
	 * @param {Object} publishBox The publish box object.
	 *
	 * @returns {void}
	 */
	function initializeContentAnalysis( publishBox ) {
		const savedContentScore = $( "#yoast_wpseo_content_score" ).val();

		const indicator = getIndicatorForScore( savedContentScore );

		updateAdminBar( indicator );

		publishBox.updateScore( "content", indicator.className );
	}

	/**
	 * Retrieves the target to be passed to the App.
	 *
	 * @returns {Object} The targets object for the App.
	 */
	function retrieveTargets() {
		const targets = {};

		if ( isKeywordAnalysisActive() ) {
			targets.output = "does-not-really-exist-but-it-needs-something";
		}

		if ( isContentAnalysisActive() ) {
			targets.contentOutput = "also-does-not-really-exist-but-it-needs-something";
		}

		return targets;
	}

	/**
	 * Initializes post data collector.
	 *
	 * @param {Object} data The data.
	 *
	 * @returns {PostDataCollector} The initialized post data collector.
	 */
	function initializePostDataCollector( data ) {
		const postDataCollector = new PostDataCollector( {
			data,
			store: editStore,
		} );

		/*
		 * Initially any change on the slug needs to be persisted as post name.
		 *
		 * This value will change whenever an AJAX call is being detected that
		 * populates the slug with a generated value based on the Title (or ID if no title is set).
		 *
		 * See bind event on "ajaxComplete" in this file.
		 */
		postDataCollector.leavePostNameUntouched = false;

		return postDataCollector;
	}

	/**
	 * Returns the arguments necessary to initialize the app.
	 *
	 * @param {Object} store The store.
	 *
	 * @returns {Object} The arguments to initialize the app
	 */
	function getAppArgs( store ) {
		updateMarkerStatus( store );
		const args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [
				tinyMCEHelper.tmceId,
				"yoast_wpseo_focuskw_text_input",
				"yoast_wpseo_metadesc",
				"excerpt",
				"editable-post-name",
				"editable-post-name-full",
			],
			targets: retrieveTargets(),
			callbacks: {
				getData: postDataCollector.getData.bind( postDataCollector ),
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

			args.callbacks.saveScores = postDataCollector.saveScores.bind( postDataCollector );
			args.callbacks.updatedKeywordsResults = function( results ) {
				const keyword = store.getState().focusKeyword;

				store.dispatch( setSeoResultsForKeyword( keyword, results ) );
				store.dispatch( refreshSnippetEditor() );
			};
		}

		if ( isContentAnalysisActive() ) {
			args.callbacks.saveContentScore = postDataCollector.saveContentScore.bind( postDataCollector );
			args.callbacks.updatedContentResults = function( results ) {
				store.dispatch( setReadabilityResults( results ) );
				store.dispatch( refreshSnippetEditor() );
			};
		}

		titleElement = $( "#title" );

		const translations = getTranslations();
		if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
			args.translations = translations;
		}
		return args;
	}

	/**
	 * Exposes globals necessary for functionality of plugins integrating.
	 *
	 * @param {YoastReplaceVarPlugin} replaceVarsPlugin The replace vars plugin to expose.
	 * @param {YoastShortcodePlugin} shortcodePlugin The shortcode plugin to expose.
	 *
	 * @returns {void}
	 */
	function exposeGlobals( replaceVarsPlugin, shortcodePlugin ) {
		// Init Plugins.
		window.YoastSEO.wp = {};
		window.YoastSEO.wp.replaceVarsPlugin = replaceVarsPlugin;
		window.YoastSEO.wp.shortcodePlugin = shortcodePlugin;

		window.YoastSEO.wp._tinyMCEHelper = tinyMCEHelper;
	}

	/**
	 * Activates the correct analysis and tab based on which analyses are enabled.
	 *
	 * @returns {void}
	 */
	function activateEnabledAnalysis() {
		if ( isKeywordAnalysisActive() ) {
			initializeKeywordAnalysis( publishBox );
		}

		if ( isContentAnalysisActive() ) {
			initializeContentAnalysis( publishBox );
		}
	}

	/**
	 * Overwrites YoastSEO.js' app renderers.
	 *
	 * @param {Object} app YoastSEO.js app.
	 *
	 * @returns {void}
	 */
	function disableYoastSEORenderers( app ) {
		if ( ! isUndefined( app.seoAssessorPresenter ) ) {
			app.seoAssessorPresenter.render = function() {};
		}
		if ( ! isUndefined( app.contentAssessorPresenter ) ) {
			app.contentAssessorPresenter.render = function() {};
			app.contentAssessorPresenter.renderIndividualRatings = function() {};
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
		const editArgs = {
			onRefreshRequest: () => {},
			snippetEditorBaseUrl: wpseoScriptData.metabox.base_url,
			snippetEditorDate: wpseoScriptData.metabox.metaDescriptionDate,
			replaceVars: wpseoScriptData.analysis.plugins.replaceVars.replace_vars,
			recommendedReplaceVars: wpseoScriptData.analysis.plugins.replaceVars.recommended_replace_vars,
		};
		edit = new Edit( editArgs );

		editStore =  edit.getStore();
		const data = edit.getData();

		const blockEditorDataModule = window.wp.data.select( "core/block-editor" );

		metaboxContainer = $( "#wpseo_meta" );

		tinyMCEHelper.setStore( editStore );
		tinyMCEHelper.wpTextViewOnInitCheck();
		handlePageBuilderCompatibility();

		// Avoid error when snippet metabox is not rendered.
		if ( metaboxContainer.length === 0 ) {
			return;
		}

		postDataCollector = initializePostDataCollector( data );
		publishBox.initialize();

		const appArgs = getAppArgs( editStore );
		app = new App( appArgs );

		edit.initializeAnnotations();

		// Expose globals.
		window.YoastSEO = {};
		window.YoastSEO.app = app;
		window.YoastSEO.store = editStore;
		window.YoastSEO.analysis = {};
		window.YoastSEO.analysis.worker = createAnalysisWorker();
		window.YoastSEO.analysis.collectData = () => collectAnalysisData(
			edit,
			YoastSEO.store,
			customAnalysisData,
			YoastSEO.app.pluggable,
			blockEditorDataModule
		);
		window.YoastSEO.analysis.applyMarks = ( paper, marks ) => getApplyMarks( YoastSEO.store )( paper, marks );

		// YoastSEO.app overwrites.
		YoastSEO.app.refresh = debounce( () => refreshAnalysis(
			YoastSEO.analysis.worker,
			YoastSEO.analysis.collectData,
			YoastSEO.analysis.applyMarks,
			YoastSEO.store,
			postDataCollector,
		), refreshDelay );
		YoastSEO.app.registerCustomDataCallback = customAnalysisData.register;
		YoastSEO.app.pluggable = new Pluggable( YoastSEO.app.refresh );
		YoastSEO.app.registerPlugin = YoastSEO.app.pluggable._registerPlugin;
		YoastSEO.app.pluginReady = YoastSEO.app.pluggable._ready;
		YoastSEO.app.pluginReloaded = YoastSEO.app.pluggable._reloaded;
		YoastSEO.app.registerModification = YoastSEO.app.pluggable._registerModification;
		YoastSEO.app.registerAssessment = ( name, assessment, pluginName ) => {
			if ( ! isUndefined( YoastSEO.app.seoAssessor ) ) {
				return YoastSEO.app.pluggable._registerAssessment( YoastSEO.app.defaultSeoAssessor, name, assessment, pluginName ) &&
					YoastSEO.app.pluggable._registerAssessment( YoastSEO.app.cornerStoneSeoAssessor, name, assessment, pluginName );
			}
		};
		YoastSEO.app.changeAssessorOptions = function( assessorOptions ) {
			YoastSEO.analysis.worker.initialize( assessorOptions ).catch( handleWorkerError );
			YoastSEO.app.refresh();
		};

		edit.initializeUsedKeywords( YoastSEO.app.refresh, "get_focus_keyword_usage" );

		editStore.subscribe( handleStoreChange.bind( null, editStore, YoastSEO.app.refresh ) );

		const replaceVarsPlugin = new YoastReplaceVarPlugin( app, editStore );
		const shortcodePlugin = new YoastShortcodePlugin( {
			registerPlugin: YoastSEO.app.registerPlugin,
			registerModification: YoastSEO.app.registerModification,
			pluginReady: YoastSEO.app.pluginReady,
			pluginReloaded: YoastSEO.app.pluginReloaded,
		} );

		if ( wpseoScriptData.metabox.markdownEnabled ) {
			const markdownPlugin = new YoastMarkdownPlugin( YoastSEO.app.registerPlugin, YoastSEO.app.registerModification );
			markdownPlugin.register();
		}

		exposeGlobals( replaceVarsPlugin, shortcodePlugin );

		activateEnabledAnalysis();

		YoastSEO._registerReactComponent = registerReactComponent;

		// Initialize the analysis worker.
		YoastSEO.analysis.worker.initialize( getAnalysisConfiguration() )
			.then( () => {
				jQuery( window ).trigger( "YoastSEO:ready" );
			} )
			.catch( handleWorkerError );

		// Backwards compatibility.
		YoastSEO.analyzerArgs = appArgs;

		postDataCollector.bindElementEvents( debounce( () => refreshAnalysis(
			YoastSEO.analysis.worker,
			YoastSEO.analysis.collectData,
			YoastSEO.analysis.applyMarks,
			YoastSEO.store,
			postDataCollector,
		), refreshDelay ) );

		// Hack needed to make sure Publish box and traffic light are still updated.
		disableYoastSEORenderers( app );
		const originalInitAssessorPresenters = app.initAssessorPresenters.bind( app );
		app.initAssessorPresenters = function() {
			originalInitAssessorPresenters();
			disableYoastSEORenderers( app );
		};

		// Set refresh function. data.setRefresh is only defined when Gutenberg is available.
		if ( data.setRefresh ) {
			data.setRefresh( app.refresh );
		}

		// Initialize the snippet editor data.
		let snippetEditorData = snippetEditorHelpers.getDataFromCollector( postDataCollector );
		const snippetEditorTemplates = snippetEditorHelpers.getTemplatesFromL10n( wpseoScriptData.metabox );
		snippetEditorData = snippetEditorHelpers.getDataWithTemplates( snippetEditorData, snippetEditorTemplates );

		// Set the initial snippet editor data.
		editStore.dispatch( updateData( snippetEditorData ) );
		// This used to be a checkbox, then became a hidden input. For consistency, we set the value to '1'.
		editStore.dispatch( setCornerstoneContent( document.getElementById( "yoast_wpseo_is_cornerstone" ).value === "1" ) );

		// Save the keyword, in order to compare it to store changes.
		let focusKeyword = editStore.getState().focusKeyword;
		requestWordsToHighlight( YoastSEO.analysis.worker.runResearch, YoastSEO.store, focusKeyword );
		const refreshAfterFocusKeywordChange = debounce( () => {
			app.refresh();
		}, 50 );

		let previousCornerstoneValue = null;
		editStore.subscribe( () => {
			// Verify whether the focusKeyword changed. If so, trigger refresh:
			const newFocusKeyword = editStore.getState().focusKeyword;

			if ( focusKeyword !== newFocusKeyword ) {
				focusKeyword = newFocusKeyword;
				requestWordsToHighlight( YoastSEO.analysis.worker.runResearch, YoastSEO.store, focusKeyword );

				$( "#yoast_wpseo_focuskw" ).val( focusKeyword );
				refreshAfterFocusKeywordChange();
			}

			const data = snippetEditorHelpers.getDataFromStore( editStore );
			const dataWithoutTemplates = snippetEditorHelpers.getDataWithoutTemplates( data, snippetEditorTemplates );


			if ( snippetEditorData.title !== data.title ) {
				postDataCollector.setDataFromSnippet( dataWithoutTemplates.title, "snippet_title" );
			}

			if ( snippetEditorData.slug !== data.slug ) {
				postDataCollector.setDataFromSnippet( dataWithoutTemplates.slug, "snippet_cite" );
			}

			if ( snippetEditorData.description !== data.description ) {
				postDataCollector.setDataFromSnippet( dataWithoutTemplates.description, "snippet_meta" );
			}

			const currentState = editStore.getState();

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

		if ( isGutenbergDataAvailable() ) {
			let editorMode = getEditorMode();

			toggleMarkers( editorMode, editStore );

			subscribe( () => {
				const currentEditorMode = getEditorMode();

				if ( currentEditorMode === editorMode ) {
					return;
				}

				editorMode = currentEditorMode;
				toggleMarkers( editorMode, editStore );
			} );
		}

		if ( ! isGutenbergDataAvailable() ) {
			renderClassicEditorMetabox( editStore );
		}

		initializationDone();
		YoastSEO.app.refresh();
	}

	jQuery( document ).ready( initializePostAnalysis );
}
