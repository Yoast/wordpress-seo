/* global YoastSEO: true, tinyMCE, wpseoPostScraperL10n, YoastShortcodePlugin, YoastReplaceVarPlugin, console, require */

var isUndefined = require( 'lodash/isUndefined' );

var getTitlePlaceholder = require( './analysis/getTitlePlaceholder' );
var getDescriptionPlaceholder = require( './analysis/getDescriptionPlaceholder' );
var getIndicatorForScore = require( './analysis/getIndicatorForScore' );
var TabManager = require( './analysis/tabManager' );

var removeMarks = require( 'yoastseo/js/markers/removeMarks' );
var tmceHelper = require( './wp-seo-tinymce' );

var tinyMCEDecorator = require( './decorator/tinyMCE' ).tinyMCEDecorator;
var publishBox = require( './ui/publishBox' );

var updateTrafficLight = require( './ui/trafficLight' ).update;
var updateAdminBar = require( './ui/adminBar' ).update;

var getTranslations = require( './analysis/getTranslations' );
var isKeywordAnalysisActive = require( './analysis/isKeywordAnalysisActive' );
var isContentAnalysisActive = require( './analysis/isContentAnalysisActive' );
var snippetPreviewHelpers = require( './analysis/snippetPreview' );

(function( $ ) {
	'use strict';

	var snippetContainer;
	var SnippetPreview = require( 'yoastseo' ).SnippetPreview;

	var App = require( 'yoastseo' ).App;

	var UsedKeywords = require( './analysis/usedKeywords' );

	var currentKeyword = '';

	var titleElement;

	var leavePostNameUntouched = false;

	var app, snippetPreview;

	var decorator = null;

	var tabManager;

	/**
	 * The HTML 'id' attribute for the TinyMCE editor.
	 * @type {string}
	 */
	var tmceId = 'content';

	/**
	 * Show warning in console when the unsupported CkEditor is used
	 */
	var PostScraper = function() {
		if ( typeof CKEDITOR === 'object' ) {
			console.warn( 'YoastSEO currently doesn\'t support ckEditor. The content analysis currently only works with the HTML editor or TinyMCE.' );
		}
	};

	/**
	 * Get data from input fields and store them in an analyzerData object. This object will be used to fill
	 * the analyzer and the snippet preview.
	 */
	PostScraper.prototype.getData = function() {
		return {
			keyword: this.getKeyword(),
			meta: this.getMeta(),
			text: this.getText(),
			title: this.getTitle(),
			url: this.getUrl(),
			excerpt: this.getExcerpt(),
			snippetTitle: this.getSnippetTitle(),
			snippetMeta: this.getSnippetMeta(),
			snippetCite: this.getSnippetCite(),
			primaryCategory: this.getPrimaryCategory(),
			searchUrl: this.getSearchUrl(),
			postUrl: this.getPostUrl(),
			permalink: this.getPermalink()
		};
	};

	PostScraper.prototype.getKeyword = function() {
		var val = document.getElementById( 'yoast_wpseo_focuskw_text_input' ) && document.getElementById( 'yoast_wpseo_focuskw_text_input' ).value || '';
		currentKeyword = val;

		return val;
	};

	PostScraper.prototype.getMeta = function() {
		return document.getElementById( 'yoast_wpseo_metadesc' ) && document.getElementById( 'yoast_wpseo_metadesc' ).value || '';
	};

	PostScraper.prototype.getText = function() {
		return removeMarks( tmceHelper.getContentTinyMce( tmceId ) );
	};

	PostScraper.prototype.getTitle = function() {
		return document.getElementById( 'title' ) && document.getElementById( 'title' ).value || '';
	};

	PostScraper.prototype.getUrl = function() {
		var url = '';

		var newPostSlug = $( '#new-post-slug' );
		if ( 0 < newPostSlug.length ) {
			url = newPostSlug.val();
		}
		else if ( document.getElementById( 'editable-post-name-full' ) !== null ) {
			url = document.getElementById( 'editable-post-name-full' ).textContent;
		}

		return url;
	};

	PostScraper.prototype.getExcerpt = function() {
		var val = '';

		if ( document.getElementById( 'excerpt' ) !== null ) {
			val = document.getElementById( 'excerpt' ) && document.getElementById( 'excerpt' ).value || '';
		}

		return val;
	};

	PostScraper.prototype.getSnippetTitle = function() {
		return document.getElementById( 'yoast_wpseo_title' ) && document.getElementById( 'yoast_wpseo_title' ).value || '';
	};

	PostScraper.prototype.getSnippetMeta = function() {
		return document.getElementById( 'yoast_wpseo_metadesc' ) && document.getElementById( 'yoast_wpseo_metadesc' ).value || '';
	};

	PostScraper.prototype.getSnippetCite = function() {
		return this.getUrl();
	};

	PostScraper.prototype.getPrimaryCategory = function() {
		var val = '';
		var categoryBase = $( '#category-all' ).find( 'ul.categorychecklist' );

		// If only one is visible than that item is the primary category.
		var checked = categoryBase.find( 'li input:checked' );

		if ( checked.length === 1 ) {
			val = this.getCategoryName( checked.parent() );

			return val;
		}

		var primaryTerm = categoryBase.find( '.wpseo-primary-term > label' );

		if ( primaryTerm.length ) {
			val = this.getCategoryName( primaryTerm );

			return val;
		}

		return val;
	};

	PostScraper.prototype.getSearchUrl = function() {
		return wpseoPostScraperL10n.search_url;
	};

	PostScraper.prototype.getPostUrl = function() {
		return wpseoPostScraperL10n.post_edit_url;
	};

	PostScraper.prototype.getPermalink = function() {
		var url = this.getUrl();

		return wpseoPostScraperL10n.base_url + url;
	};

	/**
	 * Get the category name from the list item.
	 * @param {jQuery Object} li Item which contains the category
	 * @returns {String} Name of the category
     */
	PostScraper.prototype.getCategoryName = function( li ) {
		var clone = li.clone();
		clone.children().remove();
		return $.trim(clone.text());
	};

	/**
	 * When the snippet is updated, update the (hidden) fields on the page.
	 * @param {Object} value
	 * @param {String} type
	 */
	PostScraper.prototype.setDataFromSnippet = function( value, type ) {
		switch ( type ) {
			case 'snippet_meta':
				document.getElementById( 'yoast_wpseo_metadesc' ).value = value;
				break;
			case 'snippet_cite':

				/*
				 * WordPress leaves the post name empty to signify that it should be generated from the title once the
				 * post is saved. So when we receive an auto generated slug from WordPress we should be
				 * able to not save this to the UI. This conditional makes that possible.
				 */
				if ( leavePostNameUntouched ) {
					leavePostNameUntouched = false;
					return;
				}

				document.getElementById( 'post_name' ).value = value;
				if (
					document.getElementById( 'editable-post-name' ) !== null &&
					document.getElementById( 'editable-post-name-full' ) !== null ) {
					document.getElementById( 'editable-post-name' ).textContent = value;
					document.getElementById( 'editable-post-name-full' ).textContent = value;
				}
				break;
			case 'snippet_title':
				document.getElementById( 'yoast_wpseo_title' ).value = value;
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
	PostScraper.prototype.saveSnippetData = function( data ) {
		this.setDataFromSnippet( data.title, 'snippet_title' );
		this.setDataFromSnippet( data.urlPath, 'snippet_cite' );
		this.setDataFromSnippet( data.metaDesc, 'snippet_meta' );
	};

	/**
	 * Calls the event binders.
	 */
	PostScraper.prototype.bindElementEvents = function( app ) {
		this.inputElementEventBinder( app );
		this.changeElementEventBinder( app );
	};

	/**
	 * Binds the reanalyze timer on change of dom element.
     */
	PostScraper.prototype.changeElementEventBinder = function( app ) {
		var elems = [ '#yoast-wpseo-primary-category', '.categorychecklist input[name="post_category[]"]' ];
		for( var i = 0; i < elems.length; i++ ) {
			$( elems[i] ).on('change', app.analyzeTimer.bind( app ) );
		}
	};

	/**
	 * Binds the renewData function on the change of input elements.
	 */
	PostScraper.prototype.inputElementEventBinder = function( app ) {
		var elems = [ 'excerpt', 'content', 'yoast_wpseo_focuskw_text_input', 'title' ];
		for ( var i = 0; i < elems.length; i++ ) {
			var elem = document.getElementById( elems[ i ] );
			if ( elem !== null ) {
				document.getElementById( elems[ i ] ).addEventListener( 'input', app.analyzeTimer.bind( app ) );
			}
		}

		tmceHelper.tinyMceEventBinder(app, tmceId);

		document.getElementById( 'yoast_wpseo_focuskw_text_input' ).addEventListener( 'blur', this.resetQueue );
	};

	/**
	 * Resets the current queue if focus keyword is changed and not empty.
	 */
	PostScraper.prototype.resetQueue = function() {
		if ( app.rawData.keyword !== '' ) {
			app.runAnalyzer( this.rawData );
		}
	};

	/**
	 * Saves the score to the linkdex.
	 * Outputs the score in the overall target.
	 *
	 * @param {string} score
	 */
	PostScraper.prototype.saveScores = function( score ) {
		var indicator = getIndicatorForScore( score );

		// If multi keyword isn't available we need to update the first tab (content).
		if ( isKeywordAnalysisActive() && ! YoastSEO.multiKeyword ) {
			tabManager.updateKeywordTab( score, currentKeyword );
			publishBox.updateScore( 'content', indicator.className );

			// Updates the input with the currentKeyword value.
			$( '#yoast_wpseo_focuskw' ).val( currentKeyword );
		}

		if ( isKeywordAnalysisActive() && tabManager.isMainKeyword( currentKeyword ) ) {
			document.getElementById( 'yoast_wpseo_linkdex' ).value = score;

			if ( '' === currentKeyword ) {
				indicator.className = 'na';
				indicator.screenReaderText = app.i18n.dgettext( 'js-text-analysis', 'Enter a focus keyword to calculate the SEO score' );
				indicator.fullText = app.i18n.dgettext( 'js-text-analysis', 'Content optimization: Enter a focus keyword to calculate the SEO score' );
			}



			tabManager.updateKeywordTab( score, currentKeyword );


			updateTrafficLight( indicator );
			updateAdminBar( indicator );

			publishBox.updateScore( 'keyword', indicator.className );
		}


		jQuery( window ).trigger( 'YoastSEO:numericScore', score );
	};

	/**
	 * Saves the content score to a hidden field.
	 *
	 * @param {number} score
	 */
	PostScraper.prototype.saveContentScore = function( score ) {
		tabManager.updateContentTab( score );
		var indicator = getIndicatorForScore( score );
		publishBox.updateScore( 'content', indicator.className );

		$( '#yoast_wpseo_content_score' ).val( score );
	};

	/**
	 * Initializes keyword tab with the correct template if multi keyword isn't available.
	 */
	PostScraper.prototype.initKeywordTabTemplate = function () {
		// If multi keyword is available we don't have to initialize this as multi keyword does this for us.
		if ( YoastSEO.multiKeyword ) {
			return;
		}

		var keyword = $( '#yoast_wpseo_focuskw' ).val();
		$( '#yoast_wpseo_focuskw_text_input' ).val( keyword );
	};

	/**
	 * Retrieves either a generated slug or the page title as slug for the preview.
	 * @param {Object} response The AJAX response object.
	 * @returns {String}
	 */
	function getUrlPathFromResponse( response ) {
		if ( response.responseText === '' ) {
			return titleElement.val();
		}
		// Added divs to the response text, otherwise jQuery won't parse to HTML, but an array.
		return jQuery( '<div>' + response.responseText + '</div>' )
			.find( '#editable-post-name-full' )
			.text();
	}

	/**
	 * Binds to the WordPress jQuery function to put the permalink on the page.
	 * If the response matches with permalink string, the snippet can be rendered.
	 */
	jQuery( document ).on( 'ajaxComplete', function( ev, response, ajaxOptions ) {
		var ajax_end_point = '/admin-ajax.php';
		if ( ajax_end_point !== ajaxOptions.url.substr( 0 - ajax_end_point.length ) ) {
			return;
		}

		if ( 'string' === typeof ajaxOptions.data && -1 !== ajaxOptions.data.indexOf( 'action=sample-permalink' ) ) {
			/*
			 * WordPress do not update post name for auto-generated slug, so we should leave this field untouched.
			 */
			leavePostNameUntouched = true;

			app.snippetPreview.setUrlPath( getUrlPathFromResponse( response ) );
		}
	} );

	/**
	 * Initializes the snippet preview.
	 *
	 * @param {PostScraper} postScraper
	 * @returns {SnippetPreview}
	 */
	function initSnippetPreview( postScraper ) {
		return snippetPreviewHelpers.create( snippetContainer, {
			title: postScraper.getSnippetTitle(),
			urlPath: postScraper.getSnippetCite(),
			metaDesc: postScraper.getSnippetMeta()
		}, postScraper.saveSnippetData.bind( postScraper ) );
	}
	/**
	 * Determines if markers should be shown.
	 *
	 * @returns {boolean}
	 */
	function displayMarkers() {
		return wpseoPostScraperL10n.show_markers === '1';
	}

	/**
	 * Returns the marker callback method for the assessor.
	 *
	 * @returns {*|bool}
	 */
	function getMarker() {
		// Only add markers when tinyMCE is loaded and show_markers is enabled (can be disabled by a WordPress hook).
		if ( ! tmceHelper.isTinyMCEAvailable( tmceId ) || ! displayMarkers() ) {
			return false;
		}

		if ( decorator === null ) {
			decorator = tinyMCEDecorator( tinyMCE.get( tmceId ) );
		}

		return function( paper, marks ) {
			decorator( paper, marks );
		};
	}

	function initializeKeywordAnalysis( app, postScraper, publishBox ) {
		var savedKeywordScore = $( '#yoast_wpseo_linkdex' ).val();
		var usedKeywords = new UsedKeywords( '#yoast_wpseo_focuskw_text_input', 'get_focus_keyword_usage', wpseoPostScraperL10n, app );

		usedKeywords.init();
		postScraper.initKeywordTabTemplate();

		var indicator = getIndicatorForScore( savedKeywordScore );

		updateTrafficLight( indicator );
		updateAdminBar( indicator );

		publishBox.updateScore( 'keyword', indicator.className );
	}

	function initializeContentAnalysis( publishBox ) {
		var savedContentScore = $( '#yoast_wpseo_content_score' ).val();

		var indicator = getIndicatorForScore( savedContentScore );

		updateAdminBar( indicator );

		publishBox.updateScore( 'content', indicator.className );
	}

	function keywordElementSubmitHandler() {
		if ( isKeywordAnalysisActive() && ! YoastSEO.multiKeyword ) {
			/*
			 * Hitting the enter on the focus keyword input field will trigger a form submit. Because of delay in
			 * copying focus keyword to the hidden field, the focus keyword won't be saved properly. By adding a
			 * onsubmit event that is copying the focus keyword, this should be solved.
			 */
			$( '#post' ).on( 'submit', function() {
				var hiddenKeyword       = $( '#yoast_wpseo_focuskw' );
				var hiddenKeywordValue  = hiddenKeyword.val();
				var visibleKeywordValue = tabManager.getKeywordTab().getKeywordFromElement();

				if ( hiddenKeywordValue !== visibleKeywordValue ) {
					hiddenKeyword.val( visibleKeywordValue );
				}
			} );
		}
	}

	function retrieveTargets() {
		var targets = {};

		if ( isKeywordAnalysisActive() ) {
			targets.output = 'wpseo-pageanalysis';
		}

		if ( isContentAnalysisActive() ) {
			targets.contentOutput = 'yoast-seo-content-analysis';
		}

		return targets;
	}

	jQuery( document ).ready( function() {
		snippetContainer = $( '#wpseosnippet' );

		var postScraper = new PostScraper();
		publishBox.initalise();

		tabManager = new TabManager( {
			strings: wpseoPostScraperL10n,
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive()
		} );

		tabManager.init();

		var args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [tmceId, 'yoast_wpseo_focuskw_text_input', 'yoast_wpseo_metadesc', 'excerpt', 'editable-post-name', 'editable-post-name-full'],
			targets: {
				output: ''
			},
			callbacks: {
				getData: postScraper.getData.bind( postScraper ),
				bindElementEvents: postScraper.bindElementEvents.bind( postScraper ),
				saveScores: postScraper.saveScores.bind( postScraper ),
				saveContentScore: postScraper.saveContentScore.bind( postScraper ),
				saveSnippetData: postScraper.saveSnippetData.bind( postScraper )
			},
			locale: wpseoPostScraperL10n.locale,
			marker: getMarker(),
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive()
		};

		titleElement = $( '#title' );

		snippetPreview = initSnippetPreview( postScraper );

		args.snippetPreview = snippetPreview;
		args.targets = retrieveTargets();

		var translations = getTranslations();
		if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
			args.translations = translations;
		}

		app = new App( args );

		window.YoastSEO = {};
		window.YoastSEO.app = app;

		tmceHelper.wpTextViewOnInitCheck();

		// Init Plugins.
		YoastSEO.wp = {};
		YoastSEO.wp.replaceVarsPlugin = new YoastReplaceVarPlugin( app );
		YoastSEO.wp.shortcodePlugin = new YoastShortcodePlugin( app );

		window.YoastSEO.wp._tabManager = tabManager;

		if ( isKeywordAnalysisActive() ) {
			initializeKeywordAnalysis( app, postScraper, publishBox );
			tabManager.getKeywordTab().activate();
		}

		if ( isContentAnalysisActive() ) {
			initializeContentAnalysis( publishBox );
		}

		if ( ! isKeywordAnalysisActive() && isContentAnalysisActive() ) {
			tabManager.getContentTab().activate();
		}

		jQuery( window ).trigger( 'YoastSEO:ready' );

		// Backwards compatibility.
		YoastSEO.analyzerArgs = args;

		keywordElementSubmitHandler();

		if ( ! isKeywordAnalysisActive() && ! isContentAnalysisActive() ) {
			snippetPreviewHelpers.isolate( snippetContainer );
		}
	} );
}( jQuery ));
