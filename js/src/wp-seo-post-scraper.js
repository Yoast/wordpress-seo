/* global YoastSEO: true, tinyMCE, wpseoPostScraperL10n, YoastShortcodePlugin, YoastReplaceVarPlugin, console, require */
import { App } from "yoastseo";
import isUndefined from "lodash/isUndefined";

import { tmceId } from "./wp-seo-tinymce";
import YoastMarkdownPlugin from "./wp-seo-markdown-plugin";

import initializeEdit from "./edit";
import { setActiveKeyword } from "./redux/actions/activeKeyword";
import { setReadabilityResults, setSeoResultsForKeyword } from "yoast-components/composites/Plugin/ContentAnalysis/actions/contentAnalysis";
import tinyMCEHelper from "./wp-seo-tinymce";
import { tinyMCEDecorator } from "./decorator/tinyMCE";

import publishBox from "./ui/publishBox";
import { update as updateTrafficLight } from "./ui/trafficLight";
import { update as updateAdminBar } from "./ui/adminBar";

import PostDataCollector from "./analysis/PostDataCollector";
import getIndicatorForScore from "./analysis/getIndicatorForScore";
import TabManager from "./analysis/tabManager";
import getTranslations from "./analysis/getTranslations";
import isKeywordAnalysisActive from "./analysis/isKeywordAnalysisActive";
import isContentAnalysisActive from "./analysis/isContentAnalysisActive";
import snippetPreviewHelpers from "./analysis/snippetPreview";
import UsedKeywords from "./analysis/usedKeywords";

( function( $ ) {
	if ( typeof wpseoPostScraperL10n === "undefined" ) {
		return;
	}

	let snippetContainer;
	let titleElement;
	let app, snippetPreview;
	let decorator = null;
	let tabManager, postDataCollector;

	let store;

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

			app.snippetPreview.setUrlPath( getUrlPathFromResponse( response ) );
		}
	} );

	/**
	 * Initializes the snippet preview.
	 *
	 * @param {PostDataCollector} postScraper Object for getting post data.
	 *
	 * @returns {SnippetPreview} The created snippetpreview element.
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
	 * @returns {boolean} True when markers should be shown.
	 */
	function displayMarkers() {
		return wpseoPostScraperL10n.show_markers === "1";
	}

	/**
	 * Returns the marker callback method for the assessor.
	 *
	 * @returns {*|bool} False when tinyMCE is undefined or when there are no markers.
	 */
	function getMarker() {
		// Only add markers when tinyMCE is loaded and show_markers is enabled (can be disabled by a WordPress hook).
		// Only check for the tinyMCE object because the actual editor isn't loaded at this moment yet.
		if ( typeof tinyMCE === "undefined" || ! displayMarkers() ) {
			return false;
		}

		return function( paper, marks ) {
			if ( tinyMCEHelper.isTinyMCEAvailable( tmceId ) ) {
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
	 * @param {App} app                       The App object.
	 * @param {PostDataCollector} postScraper The post scraper object.
	 * @param {Object} publishBox             The publish box object.
	 *
	 * @returns {void}
	 */
	function initializeKeywordAnalysis( app, postScraper, publishBox ) {
		const savedKeywordScore = $( "#yoast_wpseo_linkdex" ).val();
		const usedKeywords = new UsedKeywords( "#yoast_wpseo_focuskw_text_input", "get_focus_keyword_usage", wpseoPostScraperL10n, app );

		usedKeywords.init();
		postScraper.initKeywordTabTemplate();

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
				const hiddenKeyword       = $( "#yoast_wpseo_focuskw" );
				const hiddenKeywordValue  = hiddenKeyword.val();
				const visibleKeywordValue = tabManager.getKeywordTab().getKeywordFromElement();

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
		const targets = {};

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
		const args = {
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
			args.callbacks.updatedKeywordsResults = function( results ) {
				let keyword = tabManager.getKeywordTab().getKeyWord();

				if ( tabManager.isMainKeyword( keyword ) ) {
					store.dispatch( setSeoResultsForKeyword( keyword, results ) );
					store.dispatch( setActiveKeyword( keyword ) );
				}
			};
		}

		if ( isContentAnalysisActive() ) {
			args.callbacks.saveContentScore = postDataCollector.saveContentScore.bind( postDataCollector );
			args.callbacks.updatedContentResults = function( results ) {
				store.dispatch( setReadabilityResults( results ) );
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
		window.YoastSEO.wp = {};
		window.YoastSEO.wp.replaceVarsPlugin = replaceVarsPlugin;
		window.YoastSEO.wp.shortcodePlugin = shortcodePlugin;

		window.YoastSEO.wp._tabManager = tabManager;
		window.YoastSEO.wp._tinyMCEHelper = tinyMCEHelper;

		window.YoastSEO.store = store;
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
		const editArgs = {
			readabilityTarget: "yoast-seo-content-analysis",
			seoTarget: "wpseo-pageanalysis",
		};
		store = initializeEdit( editArgs ).store;

		snippetContainer = $( "#wpseosnippet" );

		// Avoid error when snippet metabox is not rendered.
		if ( snippetContainer.length === 0 ) {
			return;
		}

		tabManager = initializeTabManager();
		postDataCollector = initializePostDataCollector();
		publishBox.initalise();
		snippetPreview = initSnippetPreview( postDataCollector );

		let appArgs = getAppArgs();
		app = new App( appArgs );

		postDataCollector.app = app;

		let replaceVarsPlugin = new YoastReplaceVarPlugin( app );
		let shortcodePlugin = new YoastShortcodePlugin( app );

		if ( wpseoPostScraperL10n.markdownEnabled ) {
			let markdownPlugin = new YoastMarkdownPlugin( app );
			markdownPlugin.register();
		}

		exposeGlobals( app, tabManager, replaceVarsPlugin, shortcodePlugin );

		tinyMCEHelper.wpTextViewOnInitCheck();

		activateEnabledAnalysis( tabManager );

		jQuery( window ).trigger( "YoastSEO:ready" );

		/*
		 * Checks the snippet preview size and toggles views when the WP admin menu state changes.
		 * In WordPress, `wp-collapse-menu` fires when clicking on the Collapse/expand button.
		 * `wp-menu-state-set` fires also when the window gets resized and the menu can be folded/auto-folded/collapsed/expanded/responsive.
		 */
		jQuery( document ).on( "wp-collapse-menu wp-menu-state-set", function() {
			app.snippetPreview.handleWindowResizing();
		} );

		// Backwards compatibility.
		YoastSEO.analyzerArgs = appArgs;

		keywordElementSubmitHandler();
		postDataCollector.bindElementEvents( app );

		if ( ! isKeywordAnalysisActive() && ! isContentAnalysisActive() ) {
			snippetPreviewHelpers.isolate( snippetContainer );
		}

		// Switch between assessors when checkbox has been checked.
		let cornerstoneCheckbox = jQuery( "#_yst_is_cornerstone" );
		app.switchAssessors( cornerstoneCheckbox.is( ":checked" ) );
		cornerstoneCheckbox.change( function() {
			app.switchAssessors( cornerstoneCheckbox.is( ":checked" ) );
		} );

		// Hack needed to make sure Publish box and traffic light are still updated.
		app.seoAssessorPresenter.render = function() {};
		app.contentAssessorPresenter.render = function() {};
		app.contentAssessorPresenter.renderIndividualRatings = function() {};
		let originalInitAssessorPresenters = app.initAssessorPresenters.bind( app );
		app.initAssessorPresenters = function() {
			originalInitAssessorPresenters();

			app.seoAssessorPresenter.render = function() {};
			app.contentAssessorPresenter.render = function() {};
			app.contentAssessorPresenter.renderIndividualRatings = function() {};
		};

		// Set initial keyword.
		store.dispatch( setActiveKeyword( tabManager.getKeywordTab().getKeyWord() ) );
	}

	jQuery( document ).ready( initializePostAnalysis );
}( jQuery ) );
