/* global YoastSEO: true, tinyMCE, wpseoPostScraperL10n, YoastShortcodePlugin, YoastReplaceVarPlugin, console, require */

var getTitlePlaceholder = require( './analysis/getTitlePlaceholder' );
var getDescriptionPlaceholder = require( './analysis/getDescriptionPlaceholder' );

(function( $ ) {
	'use strict';

	var SnippetPreview = require( 'yoastseo' ).SnippetPreview;
	var App = require( 'yoastseo' ).App;

	var scoreToRating = require( 'yoastseo' ).helpers.scoreToRating;

	var UsedKeywords = require( './analysis/usedKeywords' );

	var currentKeyword = '';

	var titleElement;
	var leavePostNameEmpty = false;

	var app, snippetPreview;

	var mainKeywordTab;
	var KeywordTab = require( './analysis/keywordTab' );

	/**
	 * wordpress scraper to gather inputfields.
	 * @constructor
	 */
	var PostScraper = function() {
		if ( typeof CKEDITOR === 'object' ) {
			console.warn( 'YoastSEO currently doesn\'t support ckEditor. The content analysis currently only works with the HTML editor or TinyMCE.' );
		}
	};

	/**
	 * Get data from inputfields and store them in an analyzerData object. This object will be used to fill
	 * the analyzer and the snippetpreview
	 */
	PostScraper.prototype.getData = function() {
		return {
			keyword: this.getDataFromInput( 'keyword' ),
			meta: this.getDataFromInput( 'meta' ),
			text: this.getDataFromInput( 'text' ),
			title: this.getDataFromInput( 'title' ),
			url: this.getDataFromInput( 'url' ),
			excerpt: this.getDataFromInput( 'excerpt' ),
			snippetTitle: this.getDataFromInput( 'snippetTitle' ),
			snippetMeta: this.getDataFromInput( 'snippetMeta' ),
			snippetCite: this.getDataFromInput( 'cite' ),
			primaryCategory: this.getDataFromInput( 'primaryCategory' ),
			searchUrl: wpseoPostScraperL10n.search_url,
			postUrl: wpseoPostScraperL10n.post_edit_url
		};
	};

	/**
	 * gets the values from the given input. Returns this value
	 * @param {String} inputType
	 * @returns {String}
	 */
	PostScraper.prototype.getDataFromInput = function( inputType ) {
		var newPostSlug, val = '';
		switch ( inputType ) {
			case 'text':
			case 'content':
				val = this.getContentTinyMCE();
				break;
			case 'cite':
			case 'url':
				newPostSlug = $( '#new-post-slug' );
				if ( 0 < newPostSlug.length ) {
					val = newPostSlug.val();
				}
				else if ( document.getElementById( 'editable-post-name-full' ) !== null ) {
					val = document.getElementById( 'editable-post-name-full' ).textContent;
				}
				break;
			case 'meta':
				val = document.getElementById( 'yoast_wpseo_metadesc' ) && document.getElementById( 'yoast_wpseo_metadesc' ).value || '';
				break;
			case 'snippetMeta':
				val = document.getElementById( 'yoast_wpseo_metadesc' ) && document.getElementById( 'yoast_wpseo_metadesc' ).value || '';
				break;
			case 'keyword':
				val = document.getElementById( 'yoast_wpseo_focuskw_text_input' ) && document.getElementById( 'yoast_wpseo_focuskw_text_input' ).value || '';
				currentKeyword = val;
				break;
			case 'title':
				val = document.getElementById( 'title' ) && document.getElementById( 'title' ).value || '';
				break;
			case 'snippetTitle':
				val = document.getElementById( 'yoast_wpseo_title' ) && document.getElementById( 'yoast_wpseo_title' ).value || '';
				break;
			case 'excerpt':
				if ( document.getElementById( 'excerpt' ) !== null ) {
					val = document.getElementById( 'excerpt' ) && document.getElementById( 'excerpt' ).value || '';
				}
				break;
			case 'primaryCategory':
				var categoryBase = $( '#category-all' ).find( 'ul.categorychecklist' );

				// If only one is visible than that item is the primary category.
				var checked = categoryBase.find( 'li input:checked' );
				if ( checked.length === 1 ) {
					val = this.getCategoryName( checked.parent() );
					break;
				}

				var primaryTerm = categoryBase.find( '.wpseo-primary-term > label' );
				if ( primaryTerm.length ) {
					val = this.getCategoryName( primaryTerm );
					break;
				}
				break;
			default:
				break;
		}
		return val;
	};

	/**
	 * Get the category name from the list item
	 * @param {jQuery Object} li Item which contains the category
	 * @returns {String} Name of the category
     */
	PostScraper.prototype.getCategoryName = function( li ) {
		var clone = li.clone();
		clone.children().remove();
		return $.trim(clone.text());
	};

	/**
	 * When the snippet is updated, update the (hidden) fields on the page
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
				 * post is saved. So in some cases when we receive an auto generated slug from WordPress we should be
				 * able to not save this to the UI. This conditional makes that possible.
				 */
				if ( leavePostNameEmpty ) {
					leavePostNameEmpty = false;
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
	 * Returns the value of the contentfield. If tinyMCE isn't initialized, or has no editors
	 * or is hidden it gets it's contents from getTinyMCEElementContent.
	 * @returns {String}
	 */
	PostScraper.prototype.getContentTinyMCE = function() {
		if (this.isTinyMCEAvailable() ) {
			return tinyMCE.get( 'content' ).getContent();
		}
		return this.getTinyMCEElementContent();
	};

	/**
	 * Returns whether or not TinyMCE is available.
	 * @returns {boolean}
	 */
	PostScraper.prototype.isTinyMCEAvailable = function() {
		if ( typeof tinyMCE === 'undefined' ||
			typeof tinyMCE.editors === 'undefined' ||
			tinyMCE.editors.length === 0 ||
			tinyMCE.get( 'content' ) === null ||
			tinyMCE.get( 'content' ).isHidden() ) {
			return false;
		}

		return true;
	};

	/**
	 * Gets content from the contentfield.
	 *
	 * @returns {String}
	 */
	PostScraper.prototype.getTinyMCEElementContent = function() {
		return document.getElementById( 'content' ) && document.getElementById( 'content' ).value || '';
	};

	/**
	 * Calls the eventbinders.
	 */
	PostScraper.prototype.bindElementEvents = function( app ) {
		this.inputElementEventBinder( app );
		this.changeElementEventBinder( app );
		document.getElementById( 'yoast_wpseo_focuskw_text_input' ).addEventListener( 'keydown', app.snippetPreview.disableEnter );
	};

	/**
	 * binds the reanalyze timer on change of dom element.
     */
	PostScraper.prototype.changeElementEventBinder = function( app ) {
		var elems = [ '#yoast-wpseo-primary-category', '.categorychecklist input[name="post_category[]"]' ];
		for( var i = 0; i < elems.length; i++ ) {
			$( elems[i] ).on('change', app.analyzeTimer.bind( app ) );
		}
	};

	/**
	 * binds the renewData function on the change of inputelements.
	 */
	PostScraper.prototype.inputElementEventBinder = function( app ) {
		var elems = [ 'excerpt', 'content', 'yoast_wpseo_focuskw_text_input', 'title' ];
		for ( var i = 0; i < elems.length; i++ ) {
			var elem = document.getElementById( elems[ i ] );
			if ( elem !== null ) {
				document.getElementById( elems[ i ] ).addEventListener( 'input', app.analyzeTimer.bind( app ) );
			}
		}

		if( typeof tinyMCE !== 'undefined' && typeof tinyMCE.on === 'function' ) {
			//binds the input, change, cut and paste event to tinyMCE. All events are needed, because sometimes tinyMCE doesn'
			//trigger them, or takes up to ten seconds to fire an event.
			var events = [ 'input', 'change', 'cut', 'paste' ];
			tinyMCE.on( 'addEditor', function( e ) {
				for ( var i = 0; i < events.length; i++ ) {
					e.editor.on( events[i], app.analyzeTimer.bind( app ) );
				}
			});
		}
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
	 * @param {AssessorPresenter} assessorPresenter
	 */
	PostScraper.prototype.saveScores = function( score, assessorPresenter ) {
		var indicator = assessorPresenter.getIndicator( scoreToRating( score / 10 ) );

		if ( this.isMainKeyword( currentKeyword ) ) {
			document.getElementById( 'yoast_wpseo_linkdex' ).value = score;

			if ( '' === currentKeyword ) {
				indicator.className = 'na';
			}

			$( '.yst-traffic-light' )
				.attr( 'class', 'yst-traffic-light ' + indicator.className )
				.attr( 'alt', indicator.screenReaderText );
		}

		// If multi keyword isn't available we need to update the first tab (content)
		if ( ! YoastSEO.multiKeyword ) {
			mainKeywordTab.update( indicator.className, currentKeyword );

			// Updates the input with the currentKeyword value
			$( '#yoast_wpseo_focuskw' ).val( currentKeyword );
		}

		jQuery( window ).trigger( 'YoastSEO:numericScore', score );
	};

	/**
	 * Returns whether or not the keyword is the main keyword
	 *
	 * @param {string} keyword The keyword to check
	 *
	 * @returns {boolean}
	 */
	PostScraper.prototype.isMainKeyword = function( keyword ) {
		var firstTab, mainKeyword;

		firstTab = $( '.wpseo_keyword_tab' )
			.first()
			.find( '.wpseo_tablink' );

		mainKeyword = firstTab.data( 'keyword' );

		return keyword === mainKeyword;
	};

	/**
	 * Initializes keyword tab with the correct template if multi keyword isn't available
	 */
	PostScraper.prototype.initKeywordTabTemplate = function() {
		var keyword, score;

		// If multi keyword is available we don't have to initialize this as multi keyword does this for us.
		if ( YoastSEO.multiKeyword ) {
			return;
		}

		// Remove default functionality to prevent scrolling to top.
		$( '.wpseo-metabox-tabs' ).on( 'click', '.wpseo_tablink', function( ev ) {
			ev.preventDefault();
		});

		keyword = $( '#yoast_wpseo_focuskw' ).val();
		score   = $( '#yoast_wpseo_linkdex' ).val();

		$( '#yoast_wpseo_focuskw_text_input' ).val( keyword );

		// Updates
		mainKeywordTab.update( score, keyword );
	};

	/**
	 * Returns whether or not the current post has a title
	 *
	 * @returns {boolean}
	 */
	function postHasTitle() {
		return '' !== titleElement.val();
	}

	/**
	 * Retrieves either a generated slug or the page title as slug for the preview
	 * @param {Object} response The AJAX response object
	 * @returns {string}
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
	 * binds to the WordPress jQuery function to put the permalink on the page.
	 * If the response matches with permalinkstring, the snippet can be rerendered.
	 */
	jQuery( document ).on( 'ajaxComplete', function( ev, response, ajaxOptions ) {
		var ajax_end_point = '/admin-ajax.php';
		if ( ajax_end_point !== ajaxOptions.url.substr( 0 - ajax_end_point.length ) ) {
			return;
		}

		if ( 'string' === typeof ajaxOptions.data && -1 !== ajaxOptions.data.indexOf( 'action=sample-permalink' ) ) {
			/*
			 * If the post has no title, WordPress wants to auto generate the slug once the title is set, so we need to
			 * keep the post name empty.
			 */
			if ( ! postHasTitle() ) {
				leavePostNameEmpty = true;
			}
			app.snippetPreview.setUrlPath( getUrlPathFromResponse( response ) );
		}
	} );

	/**
	 * Initializes the snippet preview
	 *
	 * @param {PostScraper} postScraper
	 * @returns {YoastSEO.SnippetPreview}
	 */
	function initSnippetPreview( postScraper ) {
		var data = postScraper.getData();

		var titlePlaceholder = getTitlePlaceholder();
		var descriptionPlaceholder = getDescriptionPlaceholder();

		var snippetPreviewArgs = {
			targetElement: document.getElementById( 'wpseosnippet' ),
			placeholder: {
				title: titlePlaceholder,
				urlPath: ''
			},
			defaultValue: {
				title: titlePlaceholder
			},
			baseURL: wpseoPostScraperL10n.base_url,
			callbacks: {
				saveSnippetData: postScraper.saveSnippetData.bind( postScraper )
			},
			metaDescriptionDate: wpseoPostScraperL10n.metaDescriptionDate,
			data: {
				title: data.snippetTitle,
				urlPath: data.snippetCite,
				metaDesc: data.snippetMeta
			}
		};

		if ( descriptionPlaceholder !== '' ) {
			snippetPreviewArgs.placeholder.metaDesc = descriptionPlaceholder;
			snippetPreviewArgs.defaultValue.metaDesc = descriptionPlaceholder;
		}

		return new SnippetPreview( snippetPreviewArgs );
	}

	jQuery( document ).ready(function() {
		var translations;

		// Initialize an instance of the keywordword tab.
		mainKeywordTab = new KeywordTab(
			{
				prefix: wpseoPostScraperL10n.contentTab
			}
		);
		mainKeywordTab.setElement( $('.wpseo_keyword_tab') );

		var postScraper = new PostScraper();

		var args = {

			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: ['content', 'yoast_wpseo_focuskw_text_input', 'yoast_wpseo_metadesc', 'excerpt', 'editable-post-name', 'editable-post-name-full'],
			targets: {
				output: 'wpseo-pageanalysis'
			},
			callbacks: {
				getData: postScraper.getData.bind( postScraper ),
				bindElementEvents: postScraper.bindElementEvents.bind( postScraper ),
				saveScores: postScraper.saveScores.bind( postScraper ),
				saveSnippetData: postScraper.saveSnippetData.bind( postScraper )
			},
			locale: wpseoPostScraperL10n.locale
		};

		titleElement = $( '#title' );

		translations = wpseoPostScraperL10n.translations;

		if ( typeof translations !== 'undefined' && typeof translations.domain !== 'undefined' ) {
			translations.domain = 'js-text-analysis';
			translations.locale_data['js-text-analysis'] = translations.locale_data['wordpress-seo'];

			delete( translations.locale_data['wordpress-seo'] );

			args.translations = translations;
		}

		snippetPreview = initSnippetPreview( postScraper );
		args.snippetPreview = snippetPreview;

		app = new App( args );
		window.YoastSEO = {};
		window.YoastSEO.app = app;

		// Init Plugins
		YoastSEO.wp = {};
		YoastSEO.wp.replaceVarsPlugin = new YoastReplaceVarPlugin( app );
		YoastSEO.wp.shortcodePlugin = new YoastShortcodePlugin( app );

		var usedKeywords = new UsedKeywords( '#yoast_wpseo_focuskw_text_input', 'get_focus_keyword_usage', wpseoPostScraperL10n, app );
		usedKeywords.init();

		postScraper.initKeywordTabTemplate();

		jQuery( window ).trigger( 'YoastSEO:ready' );

		// Backwards compatibility.
		YoastSEO.analyzerArgs = args;
	} );
}( jQuery ));
