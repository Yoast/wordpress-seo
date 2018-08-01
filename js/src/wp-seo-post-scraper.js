/* global YoastSEO: true, tinyMCE, wpseoReplaceVarsL10n, wpseoPostScraperL10n, YoastShortcodePlugin, YoastReplaceVarPlugin, console, require */

// External dependencies.
import { App } from "yoastseo";
import isUndefined from "lodash/isUndefined";
import debounce from "lodash/debounce";
import { setReadabilityResults, setSeoResultsForKeyword } from "yoast-components/composites/Plugin/ContentAnalysis/actions/contentAnalysis";
import { refreshSnippetEditor } from "./redux/actions/snippetEditor.js";
import isShallowEqualObjects from "@wordpress/is-shallow-equal/objects";

// Internal dependencies.
import "./helpers/babel-polyfill";
import initializeEdit from "./edit";
import { tmceId, setStore } from "./wp-seo-tinymce";
import YoastMarkdownPlugin from "./wp-seo-markdown-plugin";
import tinyMCEHelper from "./wp-seo-tinymce";
import { tinyMCEDecorator } from "./decorator/tinyMCE";

import publishBox from "./ui/publishBox";
import { update as updateTrafficLight } from "./ui/trafficLight";
import { update as updateAdminBar } from "./ui/adminBar";

import PostDataCollector from "./analysis/PostDataCollector";
import getIndicatorForScore from "./analysis/getIndicatorForScore";
import getTranslations from "./analysis/getTranslations";
import isKeywordAnalysisActive from "./analysis/isKeywordAnalysisActive";
import isContentAnalysisActive from "./analysis/isContentAnalysisActive";
import snippetEditorHelpers from "./analysis/snippetEditor";
import UsedKeywords from "./analysis/usedKeywords";

import { setFocusKeyword } from "./redux/actions/focusKeyword";
import { setMarkerStatus } from "./redux/actions/markerButtons";
import { isGutenbergPostAvailable } from "./helpers/isGutenbergAvailable";
import { updateData } from "./redux/actions/snippetEditor";
import { setWordPressSeoL10n, setYoastComponentsL10n } from "./helpers/i18n";
import { setCornerstoneContent } from "./redux/actions/cornerstoneContent";
import isGutenbergDataAvailable from "./helpers/isGutenbergDataAvailable";
import {
	registerReactComponent,
	renderClassicEditorMetabox,
} from "./helpers/classicEditor";

setYoastComponentsL10n();
setWordPressSeoL10n();

( function( $ ) {
	"use strict"; // eslint-disable-line
	if ( typeof wpseoPostScraperL10n === "undefined" ) {
		return;
	}

	let metaboxContainer;
	let titleElement;
	let app;
	let decorator = null;
	let postDataCollector;

	let editStore;

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

			editStore.dispatch( updateData( snippetEditorData ) );
		}
	} );

	/**
	 * Determines if markers should be shown.
	 *
	 * @returns {boolean} True when markers should be shown.
	 */
	function displayMarkers() {
		return ! isGutenbergPostAvailable() && wpseoPostScraperL10n.show_markers === "1";
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
			if ( ! isUndefined( editStore ) ) {
				editStore.dispatch( setMarkerStatus( "hidden" ) );
			}
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
		const usedKeywords = new UsedKeywords( "#yoast_wpseo_focuskw", "get_focus_keyword_usage", wpseoPostScraperL10n, app );

		usedKeywords.init();

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
		let postDataCollector = new PostDataCollector( {
			data,
			store: editStore,
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
		const args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [
				tmceId,
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
			hasSnippetPreview: false,
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
	 * Exposes globals necessary for functionality of plugins integrating.
	 *
	 * @param {App} app The app to expose globally.
	 * @param {YoastReplaceVarPlugin} replaceVarsPlugin The replace vars plugin to expose.
	 * @param {YoastShortcodePlugin} shortcodePlugin The shortcode plugin to expose.
	 * @returns {void}
	 */
	function exposeGlobals( app, replaceVarsPlugin, shortcodePlugin ) {
		window.YoastSEO = {};
		window.YoastSEO.app = app;

		// Init Plugins.
		window.YoastSEO.wp = {};
		window.YoastSEO.wp.replaceVarsPlugin = replaceVarsPlugin;
		window.YoastSEO.wp.shortcodePlugin = shortcodePlugin;

		window.YoastSEO.wp._tinyMCEHelper = tinyMCEHelper;

		window.YoastSEO.store = editStore;
	}

	/**
	 * Activates the correct analysis and tab based on which analyses are enabled.
	 *
	 * @returns {void}
	 */
	function activateEnabledAnalysis() {
		if ( isKeywordAnalysisActive() ) {
			initializeKeywordAnalysis( app, postDataCollector, publishBox );
		}

		if ( isContentAnalysisActive() ) {
			initializeContentAnalysis( publishBox );
		}
	}

	/**
	 * Overwrites YoastSEO.js' app renderers.
	 *
	 * @param {Object} app YoastSEO.js app.
	 *
	 * @returns {void}
	 */
	function disableYoastSEORenderers( app ) {
		if( ! isUndefined( app.seoAssessorPresenter ) ) {
			app.seoAssessorPresenter.render = function() {};
		}
		if( ! isUndefined( app.contentAssessorPresenter ) ) {
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
	 * Initializes analysis for the post edit screen.
	 *
	 * @returns {void}
	 */
	function initializePostAnalysis() {
		const editArgs = {
			onRefreshRequest: () => {},
			shouldRenderSnippetPreview: true,
			snippetEditorBaseUrl: wpseoPostScraperL10n.base_url,
			snippetEditorDate: wpseoPostScraperL10n.metaDescriptionDate,
			replaceVars: wpseoReplaceVarsL10n.replace_vars,
			recommendedReplaceVars: wpseoReplaceVarsL10n.recommended_replace_vars,
			shouldRenderGutenbergSidebar: !! wpseoPostScraperL10n.gutenbergSidebar,
		};
		const { store, data } = initializeEdit( editArgs );
		editStore = store;

		metaboxContainer = $( "#wpseo_meta" );

		// Avoid error when snippet metabox is not rendered.
		if ( metaboxContainer.length === 0 ) {
			return;
		}

		postDataCollector = initializePostDataCollector( data );
		publishBox.initialize();

		const appArgs = getAppArgs( store );
		app = new App( appArgs );

		postDataCollector.app = app;

		editStore.subscribe( handleStoreChange.bind( null, editStore, app ) );

		const replaceVarsPlugin = new YoastReplaceVarPlugin( app, store );
		const shortcodePlugin = new YoastShortcodePlugin( app );

		if ( wpseoPostScraperL10n.markdownEnabled ) {
			let markdownPlugin = new YoastMarkdownPlugin( app );
			markdownPlugin.register();
		}

		exposeGlobals( app, replaceVarsPlugin, shortcodePlugin );

		setStore( store );
		tinyMCEHelper.wpTextViewOnInitCheck();

		activateEnabledAnalysis();

		YoastSEO._registerReactComponent = registerReactComponent;

		jQuery( window ).trigger( "YoastSEO:ready" );

		// Backwards compatibility.
		YoastSEO.analyzerArgs = appArgs;

		postDataCollector.bindElementEvents( app );

		// Hack needed to make sure Publish box and traffic light are still updated.
		disableYoastSEORenderers( app );
		const originalInitAssessorPresenters = app.initAssessorPresenters.bind( app );
		app.initAssessorPresenters = function() {
			originalInitAssessorPresenters();
			disableYoastSEORenderers( app );
		};

		// Set refresh function. data.setRefresh is only defined when Gutenberg is available.
		if ( data.setRefresh ) {
			data.setRefresh( app.refresh );
		}

		// Initialize the snippet editor data.
		let snippetEditorData = snippetEditorHelpers.getDataFromCollector( postDataCollector );
		const snippetEditorTemplates = snippetEditorHelpers.getTemplatesFromL10n( wpseoPostScraperL10n );
		snippetEditorData = snippetEditorHelpers.getDataWithTemplates( snippetEditorData, snippetEditorTemplates );

		// Set the initial snippet editor data.
		store.dispatch( updateData( snippetEditorData ) );
		store.dispatch( setCornerstoneContent( document.getElementById( "yoast_wpseo_is_cornerstone" ).value === "true" ) );

		// Save the keyword, in order to compare it to store changes.
		let focusKeyword = store.getState().focusKeyword;

		const refreshAfterFocusKWChange = debounce( () => {
			app.refresh();
		}, 50 );

		let previousCornerstoneValue = null;

		store.subscribe( () => {
			// Verify whether the focusKeyword changed. If so, trigger refresh:
			let newFocusKeyword = store.getState().focusKeyword;

			if( focusKeyword !== newFocusKeyword ) {
				focusKeyword = newFocusKeyword;

				$( "#yoast_wpseo_focuskw" ).val( focusKeyword );
				refreshAfterFocusKWChange();
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

			let currentState = store.getState();

			if ( previousCornerstoneValue !== currentState.isCornerstone ) {
				previousCornerstoneValue = currentState.isCornerstone;
				document.getElementById( "yoast_wpseo_is_cornerstone" ).value = currentState.isCornerstone;

				app.changeAssessorOptions( {
					useCornerStone: currentState.isCornerstone,
				} );
			}

			snippetEditorData.title = data.title;
			snippetEditorData.slug = data.slug;
			snippetEditorData.description = data.description;
		} );

		if ( ! isGutenbergDataAvailable() ) {
			renderClassicEditorMetabox( store );
		}
	}

	jQuery( document ).ready( initializePostAnalysis );
}( jQuery ) );
