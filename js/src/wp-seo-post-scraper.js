/* global YoastSEO: true, tinyMCE, wpseoPostScraperL10n, YoastShortcodePlugin, YoastReplaceVarPlugin, console, require */

import PostDataCollector from "./analysis/PostDataCollector";
import { tmceId } from "./wp-seo-tinymce";

var isUndefined = require( "lodash/isUndefined" );

var getIndicatorForScore = require( "./analysis/getIndicatorForScore" );
var TabManager = require( "./analysis/tabManager" );

var tmceHelper = require( "./wp-seo-tinymce" );

var tinyMCEDecorator = require( "./decorator/tinyMCE" ).tinyMCEDecorator;
var publishBox = require( "./ui/publishBox" );

var updateTrafficLight = require( "./ui/trafficLight" ).update;
var updateAdminBar = require( "./ui/adminBar" ).update;

var getTranslations = require( "./analysis/getTranslations" );
var isKeywordAnalysisActive = require( "./analysis/isKeywordAnalysisActive" );
var isContentAnalysisActive = require( "./analysis/isContentAnalysisActive" );
var snippetPreviewHelpers = require( "./analysis/snippetPreview" );

var App = require( "yoastseo" ).App;
var UsedKeywords = require( "./analysis/usedKeywords" );

( function( $ ) {
	"use strict";

	var snippetContainer;

	var titleElement;

	var app, snippetPreview;

	var decorator = null;

	var tabManager, postDataCollector;

	/**
	 * Retrieves either a generated slug or the page title as slug for the preview.
	 * @param {Object} response The AJAX response object.
	 * @returns {String}
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
		var ajax_end_point = "/admin-ajax.php";
		if ( ajax_end_point !== ajaxOptions.url.substr( 0 - ajax_end_point.length ) ) {
			return;
		}

		if ( "string" === typeof ajaxOptions.data && -1 !== ajaxOptions.data.indexOf( "action=sample-permalink" ) ) {
			/*
			 * WordPress do not update post name for auto-generated slug, so we should leave this field untouched.
			 */
			postDataCollector.leavePostNameUntouched = true;

			app.snippetPreview.setUrlPath( getUrlPathFromResponse( response ) );
		}
	} );

	/**
	 * Initializes the snippet preview.
	 *
	 * @param {PostDataCollector} postScraper
	 * @returns {SnippetPreview}
	 */
	function initSnippetPreview( postScraper ) {
		return snippetPreviewHelpers.create( snippetContainer, {
			title: postScraper.getSnippetTitle(),
			urlPath: postScraper.getSnippetCite(),
			metaDesc: postScraper.getSnippetMeta(),
		}, postScraper.saveSnippetData.bind( postScraper ) );
	}
	/**
	 * Determines if markers should be shown.
	 *
	 * @returns {boolean}
	 */
	function displayMarkers() {
		return wpseoPostScraperL10n.show_markers === "1";
	}

	/**
	 * Returns the marker callback method for the assessor.
	 *
	 * @returns {*|bool}
	 */
	function getMarker() {
		// Only add markers when tinyMCE is loaded and show_markers is enabled (can be disabled by a WordPress hook).
		// Only check for the tinyMCE object because the actual editor isn't loaded at this moment yet.
		if ( typeof tinyMCE === "undefined" || ! displayMarkers() ) {
			return false;
		}

		return function( paper, marks ) {
			if ( tmceHelper.isTinyMCEAvailable( tmceId ) ) {
				if ( null === decorator ) {
					decorator = tinyMCEDecorator( tinyMCE.get( tmceId ) );
				}

				decorator( paper, marks );
			}
		};
	}

	/**
	 * Initializes keyword analysis.
	 *
	 * @param {App} app The App object.
	 * @param {PostDataCollector} postScraper The post scraper object.
	 * @param {Object} publishBox The publish box object.
	 *
	 * @returns {void}
	 */
	function initializeKeywordAnalysis( app, postScraper, publishBox ) {
		var savedKeywordScore = $( "#yoast_wpseo_linkdex" ).val();
		var usedKeywords = new UsedKeywords( "#yoast_wpseo_focuskw_text_input", "get_focus_keyword_usage", wpseoPostScraperL10n, app );

		usedKeywords.init();
		postScraper.initKeywordTabTemplate();

		var indicator = getIndicatorForScore( savedKeywordScore );

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
		var savedContentScore = $( "#yoast_wpseo_content_score" ).val();

		var indicator = getIndicatorForScore( savedContentScore );

		updateAdminBar( indicator );

		publishBox.updateScore( "content", indicator.className );
	}

	/**
	 * Makes sure the hidden focus keyword field is filled with the correct keyword.
	 *
	 * @returns {void}
	 */
	function keywordElementSubmitHandler() {
		if ( isKeywordAnalysisActive() && ! YoastSEO.multiKeyword ) {
			/*
			 * Hitting the enter on the focus keyword input field will trigger a form submit. Because of delay in
			 * copying focus keyword to the hidden field, the focus keyword won't be saved properly. By adding a
			 * onsubmit event that is copying the focus keyword, this should be solved.
			 */
			$( "#post" ).on( "submit", function() {
				var hiddenKeyword       = $( "#yoast_wpseo_focuskw" );
				var hiddenKeywordValue  = hiddenKeyword.val();
				var visibleKeywordValue = tabManager.getKeywordTab().getKeywordFromElement();

				if ( hiddenKeywordValue !== visibleKeywordValue ) {
					hiddenKeyword.val( visibleKeywordValue );
				}
			} );
		}
	}

	/**
	 * Retrieves the target to be passed to the App.
	 *
	 * @returns {Object} The targets object for the App.
	 */
	function retrieveTargets() {
		var targets = {};

		if ( isKeywordAnalysisActive() ) {
			targets.output = "wpseo-pageanalysis";
		}

		if ( isContentAnalysisActive() ) {
			targets.contentOutput = "yoast-seo-content-analysis";
		}

		return targets;
	}

	/**
	 * Hides the add keyword button.
	 *
	 * @returns {void}
	 */
	function hideAddKeywordButton() {
		$( ".wpseo-tab-add-keyword" ).hide();
	}

	/**
	 * Initializes tab manager.
	 *
	 * @returns {TabManager} The initialized tab manager.
	 */
	function initializeTabManager() {
		let tabManager = new TabManager( {
			strings: wpseoPostScraperL10n,
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive(),
		} );
		tabManager.init();

		return tabManager;
	}

	/**
	 * Initializes post data collector.
	 *
	 * @returns {PostDataCollector} The initialized post data collector.
	 */
	function initializePostDataCollector() {
		let postDataCollector = new PostDataCollector( {
			tabManager,
		} );
		postDataCollector.leavePostNameUntouched = false;

		return postDataCollector;
	}

	/**
	 * Returns the arguments necessary to initialize the app.
	 *
	 * @returns {Object} The arguments to initialize the app
	 */
	function getAppArgs() {
		var args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [
				tmceId,
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
			locale: wpseoPostScraperL10n.contentLocale,
			marker: getMarker(),
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive(),
			snippetPreview: snippetPreview,
		};

		if ( isKeywordAnalysisActive() ) {
			args.callbacks.saveScores = postDataCollector.saveScores.bind( postDataCollector );
		}

		if ( isContentAnalysisActive() ) {
			args.callbacks.saveContentScore = postDataCollector.saveContentScore.bind( postDataCollector );
		}

		titleElement = $( "#title" );

		var translations = getTranslations();
		if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
			args.translations = translations;
		}
		return args;
	}

	/**
	 * Exposes globals necessary for functionality of plugins integrating.
	 *
	 * @param {App} app The app to expose globally.
	 * @param {TabManager} tabManager The tab manager to expose globally.
	 * @param {YoastReplaceVarPlugin} replaceVarsPlugin The replace vars plugin to expose.
	 * @param {YoastShortcodePlugin} shortcodePlugin The shortcode plugin to expose.
	 * @returns {void}
	 */
	function exposeGlobals( app, tabManager, replaceVarsPlugin, shortcodePlugin ) {
		window.YoastSEO = {};
		window.YoastSEO.app = app;

		// Init Plugins.
		YoastSEO.wp = {};
		YoastSEO.wp.replaceVarsPlugin = replaceVarsPlugin;
		YoastSEO.wp.shortcodePlugin = shortcodePlugin;

		window.YoastSEO.wp._tabManager = tabManager;
	}

	/**
	 * Activates the correct analysis and tab based on which analyses are enabled.
	 *
	 * @param {TabManager} tabManager The tab manager to use to activate tabs.
	 * @returns {void}
	 */
	function activateEnabledAnalysis( tabManager ) {
		if ( isKeywordAnalysisActive() ) {
			initializeKeywordAnalysis( app, postDataCollector, publishBox );
			tabManager.getKeywordTab().activate();
		} else {
			hideAddKeywordButton();
		}

		if ( isContentAnalysisActive() ) {
			initializeContentAnalysis( publishBox );
		}

		if ( ! isKeywordAnalysisActive() && isContentAnalysisActive() ) {
			tabManager.getContentTab().activate();
		}
	}

	/**
	 * Initializes analysis for the post edit screen.
	 *
	 * @returns {void}
	 */
	function initializePostAnalysis() {
		snippetContainer = $( "#wpseosnippet" );

		tabManager = initializeTabManager();
		postDataCollector = initializePostDataCollector();
		publishBox.initalise();
		snippetPreview = initSnippetPreview( postDataCollector );

		let appArgs = getAppArgs();
		app = new App( appArgs );

		postDataCollector.app = app;

		let replaceVarsPlugin = new YoastReplaceVarPlugin( app );
		let shortcodePlugin = new YoastShortcodePlugin( app );

		exposeGlobals( app, tabManager, replaceVarsPlugin, shortcodePlugin );

		tmceHelper.wpTextViewOnInitCheck();

		activateEnabledAnalysis( tabManager );

		jQuery( window ).trigger( "YoastSEO:ready" );

		// Backwards compatibility.
		YoastSEO.analyzerArgs = appArgs;

		keywordElementSubmitHandler();
		postDataCollector.bindElementEvents( app );

		if ( ! isKeywordAnalysisActive() && ! isContentAnalysisActive() ) {
			snippetPreviewHelpers.isolate( snippetContainer );
		}
	}

	jQuery( document ).ready( initializePostAnalysis );
}( jQuery ) );
