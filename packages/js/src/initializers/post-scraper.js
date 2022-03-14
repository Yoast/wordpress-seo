/* global wpseoScriptData */

// External dependencies.
import { App } from "yoastseo";
import {
	isUndefined,
	debounce,
} from "lodash-es";
import { isShallowEqualObjects } from "@wordpress/is-shallow-equal";
import { select, subscribe } from "@wordpress/data";

// Internal dependencies.
import YoastReplaceVarPlugin from "../analysis/plugins/replacevar-plugin";
import YoastReusableBlocksPlugin from "../analysis/plugins/reusable-blocks-plugin";
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
import initializeUsedKeywords from "./used-keywords-assessment";

// Redux dependencies.
import { actions } from "@yoast/externals/redux";

// Helper dependencies.
import isBlockEditor from "../helpers/isBlockEditor";

const {
	setFocusKeyword,
	setMarkerStatus,
	updateData,
	setCornerstoneContent,
	refreshSnippetEditor,
	setReadabilityResults,
	setSeoResultsForKeyword,
} = actions;

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
	let metaboxContainer;
	let titleElement;
	let app;
	let postDataCollector;
	const customAnalysisData = new CustomAnalysisData();


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

			store.dispatch( updateData( snippetEditorData ) );
		}
	} );

	/**
	 * Determines if markers should be shown.
	 *
	 * @returns {boolean} True when markers should be shown.
	 */
	function displayMarkers() {
		return ! isBlockEditor() && wpseoScriptData.metabox.show_markers === "1";
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
			store.dispatch( setMarkerStatus( "disabled" ) );
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
			store: store,
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
			// eslint-disable-next-line new-cap
			researcher: new window.yoast.Researcher.default(),
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
		metaboxContainer = $( "#wpseo_meta" );

		tinyMCEHelper.setStore( store );
		tinyMCEHelper.wpTextViewOnInitCheck();
		handlePageBuilderCompatibility();

		// Avoid error when snippet metabox is not rendered.
		if ( metaboxContainer.length === 0 ) {
			return;
		}

		postDataCollector = initializePostDataCollector( editorData );
		publishBox.initialize();

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
		window.YoastSEO.analysis.applyMarks = ( paper, marks ) => getApplyMarks()( paper, marks );

		// YoastSEO.app overwrites.
		window.YoastSEO.app.refresh = debounce( () => refreshAnalysis(
			window.YoastSEO.analysis.worker,
			window.YoastSEO.analysis.collectData,
			window.YoastSEO.analysis.applyMarks,
			store,
			postDataCollector
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
		window.YoastSEO.wp.shortcodePlugin = new YoastShortcodePlugin( {
			registerPlugin: app.registerPlugin,
			registerModification: app.registerModification,
			pluginReady: app.pluginReady,
			pluginReloaded: app.pluginReloaded,
		} );

		if ( isBlockEditor() ) {
			const reusableBlocksPlugin = new YoastReusableBlocksPlugin( app.registerPlugin, app.registerModification, window.YoastSEO.app.refresh );
			reusableBlocksPlugin.register();
		}

		if ( wpseoScriptData.metabox.markdownEnabled ) {
			const markdownPlugin = new YoastMarkdownPlugin( app.registerPlugin, app.registerModification );
			markdownPlugin.register();
		}

		window.YoastSEO.wp._tinyMCEHelper = tinyMCEHelper;
		activateEnabledAnalysis();

		// Initialize the analysis worker.
		window.YoastSEO.analysis.worker.initialize( getAnalysisConfiguration() )
			.then( () => {
				jQuery( window ).trigger( "YoastSEO:ready" );
			} )
			.catch( handleWorkerError );


		postDataCollector.bindElementEvents( debounce( () => refreshAnalysis(
			window.YoastSEO.analysis.worker,
			window.YoastSEO.analysis.collectData,
			window.YoastSEO.analysis.applyMarks,
			store,
			postDataCollector
		), refreshDelay ) );

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
		let snippetEditorData = snippetEditorHelpers.getDataFromCollector( postDataCollector );
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
				document.getElementById( "yoast_wpseo_is_cornerstone" ).value = currentState.isCornerstone;

				app.changeAssessorOptions( {
					useCornerstone: currentState.isCornerstone,
				} );
			}

			snippetEditorData.title = data.title;
			snippetEditorData.slug = data.slug;
			snippetEditorData.description = data.description;
		} );

		if ( isBlockEditor() ) {
			let editorMode = getEditorMode();

			toggleMarkers( editorMode, store );

			subscribe( () => {
				const currentEditorMode = getEditorMode();

				if ( currentEditorMode === editorMode ) {
					return;
				}

				editorMode = currentEditorMode;
				toggleMarkers( editorMode, store );
			} );
		}

		initializationDone();
		window.YoastSEO.app.refresh();
	}

	initializePostAnalysis();
}
