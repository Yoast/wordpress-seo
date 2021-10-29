/* global wpseoScriptData */

// External dependencies.
import { App, TaxonomyAssessor } from "yoastseo";
import {
	setReadabilityResults,
	setSeoResultsForKeyword,
} from "yoast-components";
import { isShallowEqualObjects } from "@wordpress/is-shallow-equal";
import {
	isUndefined,
	debounce,
} from "lodash-es";

// Internal dependencies.
import { termsTmceId } from "../lib/tinymce";
import Pluggable from "../lib/Pluggable";
import requestWordsToHighlight from "../analysis/requestWordsToHighlight.js";
import YoastReplaceVarPlugin from "../analysis/plugins/replacevar-plugin";

// UI dependencies.
import { update as updateTrafficLight } from "../ui/trafficLight";
import { update as updateAdminBar } from "../ui/adminBar";

// Analysis dependencies.
import { createAnalysisWorker, getAnalysisConfiguration } from "../analysis/worker";
import refreshAnalysis, { initializationDone } from "../analysis/refreshAnalysis";
import collectAnalysisData from "../analysis/collectAnalysisData";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import getTranslations from "../analysis/getTranslations";
import isKeywordAnalysisActive from "../analysis/isKeywordAnalysisActive";
import isContentAnalysisActive from "../analysis/isContentAnalysisActive";
import snippetEditorHelpers from "../analysis/snippetEditor";
import TermDataCollector from "../analysis/TermDataCollector";
import CustomAnalysisData from "../analysis/CustomAnalysisData";
import getApplyMarks from "../analysis/getApplyMarks";
import { refreshDelay } from "../analysis/constants";
import handleWorkerError from "../analysis/handleWorkerError";

// Redux dependencies.
import { refreshSnippetEditor, updateData } from "../redux/actions/snippetEditor";
import { setWordPressSeoL10n, setYoastComponentsL10n } from "../helpers/i18n";
import { setFocusKeyword } from "../redux/actions/focusKeyword";
import { setCornerstoneContent } from "../redux/actions/cornerstoneContent";
import { setMarkerStatus } from "../redux/actions/markerButtons";
import initializeUsedKeywords from "./used-keywords-assessment";

setYoastComponentsL10n();
setWordPressSeoL10n();

window.yoastHideMarkers = true;

// Plugin class prototypes (not the instances) are being used by other plugins from the window.
window.YoastReplaceVarPlugin = YoastReplaceVarPlugin;

/**
 * @summary Initializes the term scraper script.
 *
 * @param {object} $ jQuery
 * @param {object} store The Yoast editor store.
 * @param {object} editorData The editor data.
 *
 * @returns {void}
 */
export default function initTermScraper( $, store, editorData ) {
	var app;

	var termSlugInput;

	const customAnalysisData = new CustomAnalysisData();

	/**
	 * Get the editor created via wp_editor() and append it to the term-description-wrap
	 * table cell. This way we can use the wp tinyMCE editor on the description field.
	 *
	 * @returns {void}
	 */
	var insertTinyMCE = function() {
		// Get the table cell that contains the description textarea.
		var descriptionTd = jQuery( ".term-description-wrap" ).find( "td" );

		// Get the description textarea label.
		var descriptionLabel = jQuery( ".term-description-wrap" ).find( "label" );

		// Get the textNode from the original textarea.
		var textNode = descriptionTd.find( "textarea" ).val();

		// Get the editor container.
		var newEditor = document.getElementById( "wp-description-wrap" );

		// Get the description help text below the textarea.
		var text = descriptionTd.find( "p" );

		// Empty the TD with the old description textarea.
		descriptionTd.html( "" );

		/*
		 * The editor is printed out via PHP as child of the form and initially
		 * hidden with a child `>` CSS selector. We now move the editor and the
		 * help text in a new position so the previous CSS rule won't apply any
		 * longer and the editor will be visible.
		 */
		descriptionTd.append( newEditor ).append( text );

		// Populate the editor textarea with the original content.
		document.getElementById( "description" ).value = textNode;

		// Make the description textarea label plain text removing the label tag.
		descriptionLabel.replaceWith( descriptionLabel.html() );
	};

	/**
	 * Function to handle when the user updates the term slug
	 *
	 * @returns {void}
	 */
	function updatedTermSlug() {
		const snippetEditorData = {
			slug: termSlugInput.val(),
		};

		window.YoastSEO.store.dispatch( updateData( snippetEditorData ) );
	}

	/**
	 * Adds a watcher on the term slug input field
	 *
	 * @returns {void}
	 */
	function initTermSlugWatcher() {
		termSlugInput = $( "#slug" );
		termSlugInput.on( "change", updatedTermSlug );
	}

	/**
	 * Retrieves the target to be passed to the App.
	 *
	 * @returns {Object} The targets object for the App.
	 */
	function retrieveTargets() {
		var targets = {};

		if ( isKeywordAnalysisActive() ) {
			targets.output = "does-not-really-exist-but-it-needs-something";
		}

		if ( isContentAnalysisActive() ) {
			targets.contentOutput = "also-does-not-really-exist-but-it-needs-something";
		}

		return targets;
	}

	/**
	 * Initializes keyword analysis.
	 *
	 * @param {TermDataCollector} termScraper The post scraper object.
	 *
	 * @returns {void}
	 */
	function initializeKeywordAnalysis( termScraper ) {
		var savedKeywordScore = $( "#hidden_wpseo_linkdex" ).val();

		termScraper.initKeywordTabTemplate();

		var indicator = getIndicatorForScore( savedKeywordScore );

		updateTrafficLight( indicator );
		updateAdminBar( indicator );
	}

	/**
	 * Initializes content analysis
	 *
	 * @returns {void}
	 */
	function initializeContentAnalysis() {
		var savedContentScore = $( "#hidden_wpseo_content_score" ).val();

		var indicator = getIndicatorForScore( savedContentScore );

		updateTrafficLight( indicator );
		updateAdminBar( indicator );
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
	 * Initializes cornerstone content analysis.
	 *
	 * @param {Object} yoastSeoApp YoastSEO.js app.
	 *
	 * @returns {void}
	 */
	function initializeCornerstoneContentAnalysis( yoastSeoApp ) {
		const cornerstoneField = document.getElementById( "hidden_wpseo_is_cornerstone" );

		// This used to be a checkbox, then became a hidden input. For consistency, we set the value to '1'.
		let isCornerstone = cornerstoneField.value === "1";
		store.dispatch( setCornerstoneContent( isCornerstone ) );
		yoastSeoApp.changeAssessorOptions( {
			useCornerstone: isCornerstone,
		} );

		store.subscribe( () => {
			const state = store.getState();

			if ( state.isCornerstone !== isCornerstone ) {
				isCornerstone = state.isCornerstone;
				cornerstoneField.value = isCornerstone ? "1" : "0";

				yoastSeoApp.changeAssessorOptions( {
					useCornerstone: isCornerstone,
				} );
			}
		} );
	}

	/**
	 * Initializes analysis for the term edit screen.
	 *
	 * @returns {void}
	 */
	function initializeTermAnalysis() {
		var args, termScraper, translations;

		insertTinyMCE();

		termScraper = new TermDataCollector( { store } );

		args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [ termsTmceId, "yoast_wpseo_focuskw", "yoast_wpseo_metadesc", "excerpt", "editable-post-name", "editable-post-name-full" ],
			targets: retrieveTargets(),
			callbacks: {
				getData: termScraper.getData.bind( termScraper ),
			},
			locale: wpseoScriptData.metabox.contentLocale,
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive(),
			hasSnippetPreview: false,
			debouncedRefresh: false,
			// eslint-disable-next-line new-cap
			researcher: new window.yoast.Researcher.default(),
		};

		if ( isKeywordAnalysisActive() ) {
			store.dispatch( setFocusKeyword( termScraper.getKeyword() ) );

			args.callbacks.saveScores = termScraper.saveScores.bind( termScraper );
			args.callbacks.updatedKeywordsResults = function( results ) {
				const keyword = store.getState().focusKeyword;
				store.dispatch( setSeoResultsForKeyword( keyword, results ) );
				store.dispatch( refreshSnippetEditor() );
			};
		}

		if ( isContentAnalysisActive() ) {
			// Hide marker buttons.
			store.dispatch( setMarkerStatus( "hidden" ) );

			args.callbacks.saveContentScore = termScraper.saveContentScore.bind( termScraper );
			args.callbacks.updatedContentResults = function( results ) {
				store.dispatch( setReadabilityResults( results ) );
				store.dispatch( refreshSnippetEditor() );
			};
		}

		translations = getTranslations();
		if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
			args.translations = translations;
		}

		app = new App( args );

		// Expose globals.
		window.YoastSEO = window.YoastSEO || {};
		window.YoastSEO.app = app;
		window.YoastSEO.store = store;
		window.YoastSEO.analysis = {};
		window.YoastSEO.analysis.worker = createAnalysisWorker();
		window.YoastSEO.analysis.collectData = () => collectAnalysisData(
			editorData,
			window.YoastSEO.store,
			customAnalysisData,
			window.YoastSEO.app.pluggable
		);
		window.YoastSEO.analysis.applyMarks = ( paper, result ) => getApplyMarks()( paper, result );

		// YoastSEO.app overwrites.
		window.YoastSEO.app.refresh = debounce( () => refreshAnalysis(
			window.YoastSEO.analysis.worker,
			window.YoastSEO.analysis.collectData,
			window.YoastSEO.analysis.applyMarks,
			window.YoastSEO.store,
			termScraper
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

		initializeUsedKeywords( app.refresh, "get_term_keyword_usage", store );
		store.subscribe( handleStoreChange.bind( null, store, app.refresh ) );

		if ( isKeywordAnalysisActive() ) {
			app.seoAssessor = new TaxonomyAssessor( app.i18n, app.config.researcher );
			app.seoAssessorPresenter.assessor = app.seoAssessor;
		}

		termScraper.initKeywordTabTemplate();

		// Init Plugins.
		window.YoastSEO.wp = {};
		window.YoastSEO.wp.replaceVarsPlugin = new YoastReplaceVarPlugin( app, store );

		// For backwards compatibility.
		window.YoastSEO.analyzerArgs = args;

		initTermSlugWatcher();
		termScraper.bindElementEvents( debounce( () => refreshAnalysis(
			window.YoastSEO.analysis.worker,
			window.YoastSEO.analysis.collectData,
			window.YoastSEO.analysis.applyMarks,
			window.YoastSEO.store,
			termScraper
		), refreshDelay ) );

		if ( isKeywordAnalysisActive() ) {
			initializeKeywordAnalysis( termScraper );
		}

		if ( isContentAnalysisActive() ) {
			initializeContentAnalysis();
		}

		// Initialize the analysis worker.
		window.YoastSEO.analysis.worker.initialize( getAnalysisConfiguration( { useTaxonomy: true } ) )
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

		// Initialize the snippet editor data.
		let snippetEditorData = snippetEditorHelpers.getDataFromCollector( termScraper );
		initializeCornerstoneContentAnalysis( app );
		const snippetEditorTemplates = snippetEditorHelpers.getTemplatesFromL10n( wpseoScriptData.metabox );
		snippetEditorData = snippetEditorHelpers.getDataWithTemplates( snippetEditorData, snippetEditorTemplates );

		// Set the initial snippet editor data.
		store.dispatch( updateData( snippetEditorData ) );

		let focusKeyword = store.getState().focusKeyword;
		requestWordsToHighlight( window.YoastSEO.analysis.worker.runResearch, window.YoastSEO.store, focusKeyword );

		const refreshAfterFocusKeywordChange = debounce( () => {
			app.refresh();
		}, 50 );

		// Subscribe to the store to save the snippet editor data.
		store.subscribe( () => {
			// Verify whether the focusKeyword changed. If so, trigger refresh:
			const newFocusKeyword = store.getState().focusKeyword;

			if ( focusKeyword !== newFocusKeyword ) {
				focusKeyword = newFocusKeyword;

				requestWordsToHighlight( window.YoastSEO.analysis.worker.runResearch, window.YoastSEO.store, focusKeyword );

				document.getElementById( "hidden_wpseo_focuskw" ).value = focusKeyword;
				refreshAfterFocusKeywordChange();
			}

			const data = snippetEditorHelpers.getDataFromStore( store );
			const dataWithoutTemplates = snippetEditorHelpers.getDataWithoutTemplates( data, snippetEditorTemplates );

			if ( snippetEditorData.title !== data.title ) {
				termScraper.setDataFromSnippet( dataWithoutTemplates.title, "snippet_title" );
			}

			if ( snippetEditorData.slug !== data.slug ) {
				termScraper.setDataFromSnippet( dataWithoutTemplates.slug, "snippet_cite" );
			}

			if ( snippetEditorData.description !== data.description ) {
				termScraper.setDataFromSnippet( dataWithoutTemplates.description, "snippet_meta" );
			}

			snippetEditorData.title = data.title;
			snippetEditorData.slug = data.slug;
			snippetEditorData.description = data.description;
		} );

		initializationDone();
		window.YoastSEO.app.refresh();
	}

	initializeTermAnalysis();
}
