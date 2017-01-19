/* global YoastSEO: true, wpseoTermScraperL10n, YoastReplaceVarPlugin, console, require */

var isUndefined = require( "lodash/isUndefined" );

var getIndicatorForScore = require( "./analysis/getIndicatorForScore" );
var TabManager = require( "./analysis/tabManager" );

var updateTrafficLight = require( "./ui/trafficLight" ).update;
var updateAdminBar = require( "./ui/adminBar" ).update;

var getTranslations = require( "./analysis/getTranslations" );
var isKeywordAnalysisActive = require( "./analysis/isKeywordAnalysisActive" );
var isContentAnalysisActive = require( "./analysis/isContentAnalysisActive" );
var snippetPreviewHelpers = require( "./analysis/snippetPreview" );

var App = require( "yoastseo" ).App;
var TaxonomyAssessor = require( "./assessors/taxonomyAssessor" );
var UsedKeywords = require( "./analysis/usedKeywords" );

import TermDataCollector from "./analysis/TermDataCollector";
import { termsTmceId as tmceId } from "./wp-seo-tinymce";

window.yoastHideMarkers = true;

( function( $ ) {
	"use strict";

	var snippetContainer;

	var app, snippetPreview;

	var termSlugInput;

	var tabManager;

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

		// Populate the editor textarea with the original content,
		document.getElementById( "description" ).value = textNode;

		// Make the description textarea label plain text removing the label tag.
		descriptionLabel.replaceWith( descriptionLabel.html() );
	};

	/**
	 * Initializes the snippet preview.
	 *
	 * @param {TermDataCollector} termScraper
	 * @returns {SnippetPreview}
	 */
	function initSnippetPreview( termScraper ) {
		return snippetPreviewHelpers.create( snippetContainer, {
			title: termScraper.getSnippetTitle(),
			urlPath: termScraper.getSnippetCite(),
			metaDesc: termScraper.getSnippetMeta(),
		}, termScraper.saveSnippetData.bind( termScraper ) );
	}

	/**
	 * Function to handle when the user updates the term slug
	 *
	 * @returns {void}
	 */
	function updatedTermSlug() {
		snippetPreview.setUrlPath( termSlugInput.val() );
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
			targets.output = "wpseo_analysis";
		}

		if ( isContentAnalysisActive() ) {
			targets.contentOutput = "yoast-seo-content-analysis";
		}

		return targets;
	}

	/**
	 * Initializes keyword analysis.
	 *
	 * @param {App} app The App object.
	 * @param {TermDataCollector} termScraper The post scraper object.
	 *
	 * @returns {void}
	 */
	function initializeKeywordAnalysis( app, termScraper ) {
		var savedKeywordScore = $( "#hidden_wpseo_linkdex" ).val();
		var usedKeywords = new UsedKeywords( "#wpseo_focuskw", "get_term_keyword_usage", wpseoTermScraperL10n, app );

		usedKeywords.init();
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

	jQuery( document ).ready( function() {
		var args, termScraper, translations;

		snippetContainer = $( "#wpseosnippet" );

		insertTinyMCE();

		$( "#wpseo_analysis" ).after( '<div id="yoast-seo-content-analysis"></div>' );

		tabManager = new TabManager( {
			strings: wpseoTermScraperL10n,
			focusKeywordField: "#wpseo_focuskw",
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive(),
		} );

		tabManager.init();

		termScraper = new TermDataCollector( { tabManager } );
		snippetPreview = initSnippetPreview( termScraper );

		args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [ tmceId, "yoast_wpseo_focuskw", "yoast_wpseo_metadesc", "excerpt", "editable-post-name", "editable-post-name-full" ],
			targets: retrieveTargets(),
			callbacks: {
				getData: termScraper.getData.bind( termScraper ),
			},
			locale: wpseoTermScraperL10n.contentLocale,
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive(),
			snippetPreview: snippetPreview,
		};

		if ( isKeywordAnalysisActive() ) {
			args.callbacks.saveScores = termScraper.saveScores.bind( termScraper );
		}

		if ( isContentAnalysisActive() ) {
			args.callbacks.saveContentScore = termScraper.saveContentScore.bind( termScraper );
		}

		translations = getTranslations();
		if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
			args.translations = translations;
		}

		app = new App( args );

		if ( isKeywordAnalysisActive() ) {
			app.seoAssessor = new TaxonomyAssessor( app.i18n );
			app.seoAssessorPresenter.assessor = app.seoAssessor;
		}

		window.YoastSEO = {};
		window.YoastSEO.app = app;

		termScraper.initKeywordTabTemplate();

		// Init Plugins.
		YoastSEO.wp = {};
		YoastSEO.wp.replaceVarsPlugin = new YoastReplaceVarPlugin( app );

		// For backwards compatibility.
		YoastSEO.analyzerArgs = args;

		initTermSlugWatcher();
		termScraper.bindElementEvents( app );

		if ( isKeywordAnalysisActive() ) {
			initializeKeywordAnalysis( app, termScraper );
			tabManager.getKeywordTab().activate();
		} else if ( isContentAnalysisActive() ) {
			tabManager.getContentTab().activate();
		} else {
			snippetPreviewHelpers.isolate( snippetContainer );
		}

		if ( isContentAnalysisActive() ) {
			initializeContentAnalysis();
		}

		jQuery( window ).trigger( "YoastSEO:ready" );
	} );
}( jQuery ) );
