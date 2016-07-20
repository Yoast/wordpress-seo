/* global YoastSEO: true, wpseoTermScraperL10n, YoastReplaceVarPlugin, console, require */

var isUndefined = require( 'lodash/isUndefined' );

var getIndicatorForScore = require( './analysis/getIndicatorForScore' );
var TabManager = require( './analysis/tabManager' );
var tmceHelper = require( './wp-seo-tinymce' );

var updateTrafficLight = require( './ui/trafficLight' ).update;
var updateAdminBar = require( './ui/adminBar' ).update;

var getTranslations = require( './analysis/getTranslations' );
var isKeywordAnalysisActive = require( './analysis/isKeywordAnalysisActive' );
var isContentAnalysisActive = require( './analysis/isContentAnalysisActive' );
var snippetPreviewHelpers = require( './analysis/snippetPreview' );

window.yoastHideMarkers = true;

(function( $ ) {
	'use strict';

	var snippetContainer;
	var App = require( 'yoastseo' ).App;

	var TaxonomyAssessor = require( './assessors/taxonomyAssessor' );
	var UsedKeywords = require( './analysis/usedKeywords' );

	var app, snippetPreview;

	var termSlugInput;

	var tabManager;

	/**
	 * The HTML 'id' attribute for the TinyMCE editor.
	 * @type {String}
	 */
	var tmceId = 'description';

	var TermScraper = function() {
		if ( typeof CKEDITOR === 'object' ) {
			console.warn( 'YoastSEO currently doesn\'t support ckEditor. The content analysis currently only works with the HTML editor or TinyMCE.' );
		}
	};

	/**
	 * Returns data fetched from input fields.
	 * @returns {{keyword: *, meta: *, text: *, pageTitle: *, title: *, url: *, baseUrl: *, snippetTitle: *, snippetMeta: *, snippetCite: *}}
	 */
	TermScraper.prototype.getData = function() {
		return {
			title: this.getTitle(),
			keyword: isKeywordAnalysisActive() ? this.getKeyword() : '',
			text: this.getText(),
			meta: this.getMeta(),
			url: this.getUrl(),
			permalink: this.getPermalink(),
			snippetCite: this.getSnippetCite(),
			snippetTitle: this.getSnippetTitle(),
			snippetMeta: this.getSnippetMeta(),
			name: this.getName(),
			baseUrl: this.getBaseUrl(),
			pageTitle: this.getPageTitle()
		};
	};

	/**
	 * Returns the title from the DOM.
	 *
	 * @returns {string} The title.
	 */
	TermScraper.prototype.getTitle = function() {
		return document.getElementById( 'hidden_wpseo_title' ).value;
	};

	/**
	 * Returns the keyword from the DOM.
	 *
	 * @returns {string} The keyword.
	 */
	TermScraper.prototype.getKeyword = function() {
		var elem, val;

		elem = document.getElementById( 'wpseo_focuskw' );
		val = elem.value;
		if ( val === '' ) {
			val = document.getElementById( 'name' ).value;
			elem.placeholder = val;
		}

		return val;
	};

	/**
	 * Returns the text from the DOM.
	 *
	 * @returns {string} The text.
	 */
	TermScraper.prototype.getText = function() {
		return tmceHelper.getContentTinyMce( tmceId );
	};

	/**
	 * Returns the meta description from the DOM.
	 *
	 * @returns {string} The meta.
	 */
	TermScraper.prototype.getMeta = function() {
		var  val = '';

		var elem = document.getElementById( 'hidden_wpseo_desc' );
		if ( elem !== null ) {
			val = elem.value;
		}

		return val;
	};

	/**
	 * Returns the url from the DOM.
	 *
	 * @returns {string} The url.
	 */
	TermScraper.prototype.getUrl = function() {
		return document.getElementById( 'slug' ).value;
	};

	/**
	 * Returns the permalink from the DOM.
	 *
	 * @returns {string} The permalink.
	 */
	TermScraper.prototype.getPermalink = function() {
		var url = this.getUrl();

		return this.getBaseUrl() + url + '/';
	};

	/**
	 * Returns the snippet cite from the DOM.
	 *
	 * @returns {string} The snippet cite.
	 */
	TermScraper.prototype.getSnippetCite = function() {
		return this.getUrl();
	};

	/**
	 * Returns the snippet title from the DOM.
	 *
	 * @returns {string} The snippet title.
	 */
	TermScraper.prototype.getSnippetTitle = function() {
		return document.getElementById( 'hidden_wpseo_title' ).value;
	};

	/**
	 * Returns the snippet meta from the DOM.
	 *
	 * @returns {string} The snippet meta.
	 */
	TermScraper.prototype.getSnippetMeta = function() {
		var val = '';

		var elem = document.getElementById( 'hidden_wpseo_desc' );
		if ( elem !== null ) {
			val = elem.value;
		}

		return val;
	};

	/**
	 * Returns the name from the DOM.
	 *
	 * @returns {string} The name.
	 */
	TermScraper.prototype.getName = function() {
		return document.getElementById( 'name' ).value;
	};

	/**
	 * Returns the base url from the DOM.
	 *
	 * @returns {string} The base url.
	 */
	TermScraper.prototype.getBaseUrl = function() {
		return wpseoTermScraperL10n.base_url;
	};

	/**
	 * Returns the page title from the DOM.
	 *
	 * @returns {string} The page title.
	 */
	TermScraper.prototype.getPageTitle = function() {
		return document.getElementById( 'hidden_wpseo_title' ).value;
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
	 * The data passed from the snippet editor.
	 *
	 * @param {Object} data
	 * @param {string} data.title
	 * @param {string} data.urlPath
	 * @param {string} data.metaDesc
	 */
	TermScraper.prototype.saveSnippetData = function( data ) {
		this.setDataFromSnippet( data.title, 'snippet_title' );
		this.setDataFromSnippet( data.urlPath, 'snippet_cite' );
		this.setDataFromSnippet( data.metaDesc, 'snippet_meta' );
	};

	/**
	 * binds elements
	 */
	TermScraper.prototype.bindElementEvents = function( app ) {
		this.inputElementEventBinder( app );
	};

	/**
	 * binds the renewData function on the change of inputelements.
	 */
	TermScraper.prototype.inputElementEventBinder = function( app ) {
		var elems = [ 'name', tmceId, 'slug', 'wpseo_focuskw' ];
		for ( var i = 0; i < elems.length; i++ ) {
			var elem = document.getElementById( elems[ i ] );
			if ( elem !== null ) {
				document.getElementById( elems[ i ] ).addEventListener( 'input', app.refresh.bind( app ) );
			}
		}
		tmceHelper.tinyMceEventBinder( app, tmceId );
	};

	/**
	 * Creates SVG for the overall score.
	 *
	 * @param {number} score Score to save.
	 */
	TermScraper.prototype.saveScores = function( score ) {
		var indicator = getIndicatorForScore( score );
		var keyword = this.getKeyword();

		document.getElementById( 'hidden_wpseo_linkdex' ).value = score;
		jQuery( window ).trigger( 'YoastSEO:numericScore', score );

		tabManager.updateKeywordTab( score, keyword );

		updateTrafficLight( indicator );
		updateAdminBar( indicator );
	};
	/**
	 * Saves the content score to a hidden field.
	 *
	 * @param {number} score The score calculated by the content assessor.
	 */
	TermScraper.prototype.saveContentScore = function( score ) {
		var indicator = getIndicatorForScore( score );

		tabManager.updateContentTab( score );

		if ( ! isKeywordAnalysisActive() ) {
			updateTrafficLight( indicator );
			updateAdminBar( indicator );
		}

		$( '#hidden_wpseo_content_score' ).val( score );
	};

	/**
	 * Initializes keyword tab with the correct template.
	 */
	TermScraper.prototype.initKeywordTabTemplate = function() {
		// Remove default functionality to prevent scrolling to top.
		$( '.wpseo-metabox-tabs' ).on( 'click', '.wpseo_tablink', function( ev ) {
			ev.preventDefault();
		});
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
	 * Initializes the snippet preview.
	 *
	 * @param {TermScraper} termScraper
	 * @returns {SnippetPreview}
	 */
	function initSnippetPreview( termScraper ) {
		return snippetPreviewHelpers.create( snippetContainer, {
			title: termScraper.getSnippetTitle(),
			urlPath: termScraper.getSnippetCite(),
			metaDesc: termScraper.getSnippetMeta()
		}, termScraper.saveSnippetData.bind( termScraper ) );
	}

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

	/**
	 * Retrieves the target to be passed to the App.
	 *
	 * @returns {Object} The targets object for the App.
	 */
	function retrieveTargets() {
		var targets = {};

		if ( isKeywordAnalysisActive() ) {
			targets.output = 'wpseo_analysis';
		}

		if ( isContentAnalysisActive() ) {
			targets.contentOutput = 'yoast-seo-content-analysis';
		}

		return targets;
	}

	/**
	 * Initializes keyword analysis.
	 *
	 * @param {App} app The App object.
	 * @param {TermScraper} termScraper The post scraper object.
	 */
	function initializeKeywordAnalysis( app, termScraper ) {
		var savedKeywordScore = $( '#hidden_wpseo_linkdex' ).val();
		var usedKeywords = new UsedKeywords( '#wpseo_focuskw', 'get_term_keyword_usage', wpseoTermScraperL10n, app );

		usedKeywords.init();
		termScraper.initKeywordTabTemplate();

		var indicator = getIndicatorForScore( savedKeywordScore );

		updateTrafficLight( indicator );
		updateAdminBar( indicator );
	}

	/**
	 * Initializes content analysis
	 */
	function initializeContentAnalysis() {
		var savedContentScore = $( '#hidden_wpseo_content_score' ).val();

		var indicator = getIndicatorForScore( savedContentScore );

		updateTrafficLight( indicator );
		updateAdminBar( indicator );
	}

	jQuery( document ).ready(function() {
		var args, termScraper, translations;

		snippetContainer = $( '#wpseo_snippet' );

		insertTinyMCE();

		$( '#wpseo_analysis' ).after( '<div id="yoast-seo-content-analysis"></div>' );

		tabManager = new TabManager({
			strings: wpseoTermScraperL10n,
			focusKeywordField: '#wpseo_focuskw',
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive()
		});

		tabManager.init();

		termScraper = new TermScraper();
		snippetPreview = initSnippetPreview( termScraper );

		args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [ tmceId, 'yoast_wpseo_focuskw', 'yoast_wpseo_metadesc', 'excerpt', 'editable-post-name', 'editable-post-name-full' ],
			targets: retrieveTargets(),
			callbacks: {
				getData: termScraper.getData.bind( termScraper )
			},
			locale: wpseoTermScraperL10n.locale,
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive(),
			snippetPreview: snippetPreview
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

		jQuery( window ).trigger( 'YoastSEO:ready' );
	} );
}( jQuery ));
