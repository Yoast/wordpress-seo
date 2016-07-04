/* global YoastSEO: true, wpseoTermScraperL10n, YoastReplaceVarPlugin, console, require */

var getTitlePlaceholder = require( './analysis/getTitlePlaceholder' );
var getDescriptionPlaceholder = require( './analysis/getDescriptionPlaceholder' );
var getIndicatorForScore = require( './analysis/getIndicatorForScore' );
var TabManager = require( './analysis/tabManager' );
var tmceHelper = require( './wp-seo-tinymce' );
var Scraper = require( './wp-seo-scraper' );

var updateTrafficLight = require( './ui/trafficLight' ).update;
var updateAdminBar = require( './ui/adminBar' ).update;

(function( $ ) {
	'use strict';

	var App = require( 'yoastseo' ).App;
	var SnippetPreview = require( 'yoastseo' ).SnippetPreview;

	var TaxonomyAssessor = require( './assessors/taxonomyAssessor' );
	var UsedKeywords = require( './analysis/usedKeywords' );

	var app, snippetPreview;


	var termSlugInput;
	var currentKeyword = '';
	var tabManager;

	/**
	 * The HTML 'id' attribute for the TinyMCE editor.
	 * @type {String}
	 */
	var tmceId = 'description';

	/**
	 *
	 * @param {Scraper} scraper
	 * @constructor
	 */
	var TermScraper = function() {
		this.scraper = new Scraper();
		this.scraper.init( wpseoTermScraperL10n, '#hidden_wpseo_linkdex', '#wpseo_focuskw' );
	};

	/**
	 * Returns data fetched from input fields.
	 * @returns {{keyword: *, meta: *, text: *, pageTitle: *, title: *, url: *, baseUrl: *, snippetTitle: *, snippetMeta: *, snippetCite: *}}
	 */
	TermScraper.prototype.getData = function() {
		var url = this.getDataFromInput( 'url' );

		return {
			title:          this.getDataFromInput( 'title' ),
			keyword:        this.getDataFromInput( 'keyword' ),
			text:           this.getDataFromInput( 'text' ),
			meta:           this.getDataFromInput( 'meta' ),
			url:            url,
			permalink:      this.getDataFromInput( 'baseUrl' ) + url + '/',

			snippetCite:    this.getDataFromInput( 'cite' ),
			snippetTitle:   this.getDataFromInput( 'title' ),
			snippetMeta:    this.getDataFromInput( 'snippetMeta' ),

			name:           this.getDataFromInput( 'name' ),
			baseUrl:        this.getDataFromInput( 'baseUrl' ),
			pageTitle:      this.getDataFromInput( 'pageTitle' )
		};
	};

	/**
	 * Gets the data from a input fields in the term editor page.
	 * @param {String} inputType The input type for the field to get the data from.
	 */
	TermScraper.prototype.getDataFromInput = function( inputType ) {
		var val = '';
		var elem;
		switch( inputType ) {
			case 'keyword':
				elem = document.getElementById( 'wpseo_focuskw' );
				val = elem.value;
				if ( val === '' ) {
					val = document.getElementById( 'name' ).value;
					elem.placeholder = val;
				}

				currentKeyword = val;

				break;
			case 'name':
				val = document.getElementById( 'name' ).value;
				break;
			case 'meta':
				elem = document.getElementById( 'hidden_wpseo_desc' );
				if ( elem !== null ) {
					val = elem.value;
				}
				break;
			case 'snippetMeta':
				elem = document.getElementById( 'hidden_wpseo_desc' );
				if ( elem !== null ) {
					val = elem.value;
				}
				break;
			case 'text':
				val = tmceHelper.getContentTinyMce( tmceId );
				break;
			case 'pageTitle':
				val = document.getElementById( 'hidden_wpseo_title' ).value;
				break;
			case 'title':
				val = document.getElementById( 'hidden_wpseo_title' ).value;
				break;
			case 'url':
			case 'cite':
				val = document.getElementById( 'slug' ).value;
				break;
			case 'baseUrl':
				val = wpseoTermScraperL10n.base_url;
				break;
		}
		return val;
	};

	/**
	 * When the snippet is updated, update the (hidden) fields on the page.
	 * @param {Object} value Value for the data to set.
	 * @param {String} type The field(type) that the data is set for.
	 */
	TermScraper.prototype.setDataFromSnippet = function( value, type ) {
		switch ( type ) {
			case 'snippet_meta':
				document.getElementById( 'hidden_wpseo_desc' ).value = value;
				break;
			case 'snippet_cite':
				document.getElementById( 'slug' ).value = value;
				break;
			case 'snippet_title':
				document.getElementById( 'hidden_wpseo_title' ).value = value;
				break;
			default:
				break;
		}
	};

	/**
	 * binds elements
	 */
	TermScraper.prototype.bindElementEvents = function( app ) {
		this.scraper.inputElementEventBinder( app );
	};

	/**
	 * Creates SVG for the overall score.
	 *
	 * @param {number} score Score to save.
	 */
	TermScraper.prototype.saveScores = function( score ) {

		var indicator = this.scraper.getIndicator( score );

		this.scraper.saveScores( score );
		this.scraper.updateLinkdex( score );
		this.scraper.updateInterfaceIndicators( indicator )

		jQuery( window ).trigger( 'YoastSEO:numericScore', score );
	};

	/**
	 * Get the editor created via wp_editor() and append it to the term-description-wrap
	 * table cell. This way we can use the wp tinyMCE editor on the description field.
	 */
	var insertTinyMCE = function() {
		// Get the table cell that contains the description textarea.
		var descriptionTd = jQuery( '.term-description-wrap' ).find( 'td' );

		// Get the textNode from the original textarea.
		var textNode = descriptionTd.find( 'textarea' ).val();

		// Get the editor container.
		var newEditor = document.getElementById( 'wp-description-wrap' );

		// Get the description help text below the textarea.
		var text = descriptionTd.find( 'p' );

		// Empty the TD with the old description textarea.
		descriptionTd.html( '' );

		/*
		 * The editor is printed out via PHP as child of the form and initially
		 * hidden with a child `>` CSS selector. We now move the editor and the
		 * help text in a new position so the previous CSS rule won't apply any
		 * longer and the editor will be visible.
		 */
		descriptionTd.append( newEditor ).append( text );

		// Populate the editor textarea with the original content,
		document.getElementById( 'description' ).value = textNode;
	};

	/**
	 * Saves the content score to a hidden field.
	 *
	 * @param {number} score The score calculated by the content assessor.
	 */
	TermScraper.prototype.saveContentScore = function( score ) {
		tabManager.updateContentTab( score );

		$( '#hidden_wpseo_content_score' ).val( score );
	};

	/**
	 * Function to handle when the user updates the term slug
	 */
	function updatedTermSlug() {
		snippetPreview.setUrlPath( termSlugInput.val() );
	}

	/**
	 * Adds a watcher on the term slug input field
	 */
	function initTermSlugWatcher() {
		termSlugInput = $( '#slug' );
		termSlugInput.on( 'change', updatedTermSlug );
	}

	jQuery( document ).ready(function() {
		var args, termScraper, translations;

		var savedKeywordScore = $( '#hidden_wpseo_linkdex' ).val();

		insertTinyMCE();

		$( '#wpseo_analysis' ).after( '<div id="yoast-seo-content-analysis"></div>' );

		tabManager = new TabManager({
			strings: wpseoTermScraperL10n,
			focusKeywordField: '#wpseo_focuskw',
			contentAnalysisActive: wpseoTermScraperL10n.contentAnalysisActive
		});

		tabManager.init();

		termScraper = new TermScraper();

		args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [ tmceId, 'yoast_wpseo_focuskw' ],
			targets: {
				output: ''
			},
			callbacks: {
				getData: termScraper.getData.bind( termScraper ),
				bindElementEvents: this.scraper.bindElementEvents.bind( termScraper, [ 'name', tmceId, 'slug', 'wpseo_focuskw' ] ),
				saveScores: termScraper.saveScores.bind( termScraper ),
				saveContentScore: this.scraper.saveContentScore.bind( '#hidden_wpseo_content_score', termScraper ),
				saveSnippetData: this.scraper.saveSnippetData.bind( termScraper )
			},
			locale: wpseoTermScraperL10n.locale
		};

		// Determine whether or not the content analysis should be executed.
		if ( wpseoTermScraperL10n.contentAnalysisActive === '1' ) {
			args.targets.contentOutput = 'yoast-seo-content-analysis';
		}

		args.targets = this.scraper.retrieveTargets();
		args.targets.snippet = 'wpseo_snippet';
		args.translations = this.scraper.retrieveTranslations( wpseoTermScraperL10n );

		snippetPreview = this.scraper.initSnippetPreview( termScraper.getData(), {
			target: args.targets.snippet,
			base_url: wpseoTermScraperL10n.base_url,
			saveSnippetData: this.scraper.saveSnippetData.bind( termScraper ),
			metaDescriptionDate: wpseoTermScraperL10n.metaDescriptionDate
		} );

		args.snippetPreview = snippetPreview;

		app = new App( args );

		app.assessor = new TaxonomyAssessor( app.i18n );

		window.YoastSEO = {};
		window.YoastSEO.app = app;

		this.scraper.initKeywordTabTemplate();

		// Init Plugins.
		YoastSEO.wp = {};
		YoastSEO.wp.replaceVarsPlugin = new YoastReplaceVarPlugin( app );

		var usedKeywords = new UsedKeywords( '#wpseo_focuskw', 'get_term_keyword_usage', wpseoTermScraperL10n, app );
		usedKeywords.init();

		// For backwards compatibility.
		YoastSEO.analyzerArgs = args;

		initTermSlugWatcher();

		var indicator = getIndicatorForScore( savedKeywordScore );
		updateTrafficLight( indicator );
		updateAdminBar( indicator );

		tabManager.getKeywordTab().activate();

		jQuery( window ).trigger( 'YoastSEO:ready' );
	} );
}( jQuery ));
