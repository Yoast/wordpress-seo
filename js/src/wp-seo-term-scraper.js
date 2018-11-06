/* global YoastSEO: true, wpseoReplaceVarsL10n, wpseoTermScraperL10n, YoastReplaceVarPlugin, console, require */

// External dependencies.
import { App, TaxonomyAssessor } from "yoastseo";
import {
	setReadabilityResults,
	setSeoResultsForKeyword,
} from "yoast-components";
import isUndefined from "lodash/isUndefined";
import isShallowEqualObjects from "@wordpress/is-shallow-equal/objects";
import debounce from "lodash/debounce";

// Internal dependencies.
import Edit from "./edit";
import { termsTmceId } from "./wp-seo-tinymce";
import Pluggable from "./Pluggable";

// UI dependencies.
import { update as updateTrafficLight } from "./ui/trafficLight";
import { update as updateAdminBar } from "./ui/adminBar";

// Analysis dependencies.
import { createAnalysisWorker, getAnalysisConfiguration } from "./analysis/worker";
import refreshAnalysis, { initializationDone } from "./analysis/refreshAnalysis";
import collectAnalysisData from "./analysis/collectAnalysisData";
import getIndicatorForScore from "./analysis/getIndicatorForScore";
import getTranslations from "./analysis/getTranslations";
import isKeywordAnalysisActive from "./analysis/isKeywordAnalysisActive";
import isContentAnalysisActive from "./analysis/isContentAnalysisActive";
import snippetEditorHelpers from "./analysis/snippetEditor";
import TermDataCollector from "./analysis/TermDataCollector";
import CustomAnalysisData from "./analysis/CustomAnalysisData";
import getApplyMarks from "./analysis/getApplyMarks";
import { refreshDelay } from "./analysis/constants";

// Redux dependencies.
import { refreshSnippetEditor, updateData } from "./redux/actions/snippetEditor";
import { setWordPressSeoL10n, setYoastComponentsL10n } from "./helpers/i18n";
import { setFocusKeyword } from "./redux/actions/focusKeyword";
import { setMarkerStatus } from "./redux/actions/markerButtons";

// Helper dependencies.
import isGutenbergDataAvailable from "./helpers/isGutenbergDataAvailable";
import {
	registerReactComponent,
	renderClassicEditorMetabox,
} from "./helpers/classicEditor";

setYoastComponentsL10n();
setWordPressSeoL10n();

window.yoastHideMarkers = true;

( function( $, window ) {
	var app;

	var termSlugInput;

	let edit;
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

		YoastSEO.store.dispatch( updateData( snippetEditorData ) );
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
	 * Rerun the analysis when the title or metadescription in the snippet changes.
	 *
	 * @param {Object} store The store.
	 * @param {Object} app The YoastSEO app.
	 *
	 * @returns {void}
	 */
	function handleStoreChange( store, app ) {
		const previousAnalysisData = currentAnalysisData || "";
		currentAnalysisData = store.getState().analysisData.snippet;

		const isDirty = ! isShallowEqualObjects( previousAnalysisData, currentAnalysisData );
		if ( isDirty ) {
			app.refresh();
		}
	}

	/**
	 * Initializes analysis for the term edit screen.
	 *
	 * @returns {void}
	 */
	function initializeTermAnalysis() {
		var args, termScraper, translations;

		const editArgs = {
			snippetEditorBaseUrl: wpseoTermScraperL10n.base_url,
			replaceVars: wpseoReplaceVarsL10n.replace_vars,
			recommendedReplaceVars: wpseoReplaceVarsL10n.recommended_replace_vars,
			classicEditorDataSettings: {
				tinyMceId: termsTmceId,
			},
		};

		edit = new Edit( editArgs );

		const store = edit.getStore();

		insertTinyMCE();

		termScraper = new TermDataCollector( { store } );

		store.dispatch( setMarkerStatus( "hidden" ) );

		args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [ termsTmceId, "yoast_wpseo_focuskw", "yoast_wpseo_metadesc", "excerpt", "editable-post-name", "editable-post-name-full" ],
			targets: retrieveTargets(),
			callbacks: {
				getData: termScraper.getData.bind( termScraper ),
			},
			locale: wpseoTermScraperL10n.contentLocale,
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive(),
			hasSnippetPreview: false,
			debouncedRefresh: false,
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
		window.YoastSEO = {};
		window.YoastSEO.app = app;
		window.YoastSEO.store = store;
		window.YoastSEO.analysis = {};
		window.YoastSEO.analysis.worker = createAnalysisWorker();
		window.YoastSEO.analysis.collectData = () => collectAnalysisData( edit, YoastSEO.store, customAnalysisData, YoastSEO.app.pluggable );
		window.YoastSEO.analysis.applyMarks = ( paper, result ) => getApplyMarks( YoastSEO.store )( paper, result );

		// YoastSEO.app overwrites.
		YoastSEO.app.refresh = debounce( () => refreshAnalysis(
			YoastSEO.analysis.worker,
			YoastSEO.analysis.collectData,
			YoastSEO.analysis.applyMarks,
			YoastSEO.store,
			termScraper
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
			YoastSEO.analysis.worker.initialize( assessorOptions );
			YoastSEO.app.refresh();
		};

		edit.initializeUsedKeywords( app, "get_term_keyword_usage" );

		store.subscribe( handleStoreChange.bind( null, store, app ) );

		if ( isKeywordAnalysisActive() ) {
			app.seoAssessor = new TaxonomyAssessor( app.i18n );
			app.seoAssessorPresenter.assessor = app.seoAssessor;
		}

		termScraper.initKeywordTabTemplate();

		// Init Plugins.
		YoastSEO.wp = {};
		YoastSEO.wp.replaceVarsPlugin = new YoastReplaceVarPlugin( app );

		// For backwards compatibility.
		YoastSEO.analyzerArgs = args;

		YoastSEO._registerReactComponent = registerReactComponent;

		initTermSlugWatcher();
		termScraper.bindElementEvents( app );

		if ( isKeywordAnalysisActive() ) {
			initializeKeywordAnalysis( termScraper );
		}

		if ( isContentAnalysisActive() ) {
			initializeContentAnalysis();
		}

		// Initialize the analysis worker.
		YoastSEO.analysis.worker.initialize( getAnalysisConfiguration( { useTaxonomy: true } ) )
			.then( () => {
				jQuery( window ).trigger( "YoastSEO:ready" );
			} )
			.catch( error => console.warn( error ) );

		// Hack needed to make sure Publish box and traffic light are still updated.
		disableYoastSEORenderers( app );
		const originalInitAssessorPresenters = app.initAssessorPresenters.bind( app );
		app.initAssessorPresenters = function() {
			originalInitAssessorPresenters();
			disableYoastSEORenderers( app );
		};

		// Initialize the snippet editor data.
		let snippetEditorData = snippetEditorHelpers.getDataFromCollector( termScraper );
		const snippetEditorTemplates = snippetEditorHelpers.getTemplatesFromL10n( wpseoTermScraperL10n );
		snippetEditorData = snippetEditorHelpers.getDataWithTemplates( snippetEditorData, snippetEditorTemplates );

		// Set the initial snippet editor data.
		store.dispatch( updateData( snippetEditorData ) );

		let focusKeyword;

		const refreshAfterFocusKeywordChange = debounce( () => {
			app.refresh();
		}, 50 );

		// Subscribe to the store to save the snippet editor data.
		store.subscribe( () => {
			// Verify whether the focusKeyword changed. If so, trigger refresh:
			const newFocusKeyword = store.getState().focusKeyword;

			if ( focusKeyword !== newFocusKeyword ) {
				focusKeyword = newFocusKeyword;

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

		if ( ! isGutenbergDataAvailable() ) {
			renderClassicEditorMetabox( store );
		}

		initializationDone();
		YoastSEO.app.refresh();
	}

	jQuery( document ).ready( initializeTermAnalysis );
}( jQuery, window ) );
