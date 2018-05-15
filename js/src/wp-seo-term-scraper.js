/* global YoastSEO: true, wpseoTermScraperL10n, YoastReplaceVarPlugin, console, require */

// External dependencies.
import { App } from "yoastseo";
import { setReadabilityResults, setSeoResultsForKeyword } from "yoast-components/composites/Plugin/ContentAnalysis/actions/contentAnalysis";
import isEqual from "lodash/isEqual";
import isFunction from "lodash/isFunction";
import isUndefined from "lodash/isUndefined";

// Internal dependencies.
import initializeEdit from "./edit";
import { termsTmceId as tmceId } from "./wp-seo-tinymce";
import { update as updateTrafficLight } from "./ui/trafficLight";
import { update as updateAdminBar } from "./ui/adminBar";
import getIndicatorForScore from "./analysis/getIndicatorForScore";
import TabManager from "./analysis/tabManager";
import getTranslations from "./analysis/getTranslations";
import isKeywordAnalysisActive from "./analysis/isKeywordAnalysisActive";
import isContentAnalysisActive from "./analysis/isContentAnalysisActive";
import snippetPreviewHelpers from "./analysis/snippetPreview";
import snippetEditorHelpers from "./analysis/snippetEditor";
import TermDataCollector from "./analysis/TermDataCollector";
import UsedKeywords from "./analysis/usedKeywords";
import TaxonomyAssessor from "./assessors/taxonomyAssessor";
import { setActiveKeyword } from "./redux/actions/activeKeyword";
import { refreshSnippetEditor, updateData } from "./redux/actions/snippetEditor";
import { setYoastComponentsI18n } from "./helpers/i18n";

setYoastComponentsI18n();

window.yoastHideMarkers = true;

( function( $, window ) {
	var snippetContainer;

	var app, snippetPreview;

	var termSlugInput;

	var tabManager;

	let store;

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
	 * Dispatches an action to the store that updates the snippet editor.
	 *
	 * @param {Object} data The data from the legacy snippet editor.
	 *
	 * @returns {void}
	 */
	const dispatchUpdateSnippetEditor = function( data ) {
		/*
		 * The setTimeout makes sure the React component is only updated on the next
		 * frame. This is to prevent input lag.
		 */
		setTimeout( () => {
			store.dispatch( updateData( {
				title: data.title,
				slug: data.urlPath,
				description: data.metaDesc,
			} ) );
		}, 0 );
	};

	/**
	 * Update the legacy snippet preview based on the passed data from the redux
	 * store.
	 *
	 * @param {Object} data The data from the store.
	 *
	 * @returns {void}
	 */
	function updateLegacySnippetEditor( data ) {
		if ( isFunction( snippetPreview.refresh ) ) {
			let isDataChanged = false;

			if ( snippetPreview.data.title !== data.title ) {
				snippetPreview.element.input.title.value = data.title;

				isDataChanged = true;
			}

			if ( snippetPreview.data.urlPath !== data.slug ) {
				snippetPreview.element.input.urlPath.value = data.slug;

				isDataChanged = true;
			}

			if ( snippetPreview.data.metaDesc !== data.description ) {
				snippetPreview.element.input.metaDesc.value = data.description;

				isDataChanged = true;
			}

			if ( isDataChanged ) {
				snippetPreview.changedInput();
			}
		}
	}

	/**
	 * Initializes the snippet preview.
	 *
	 * @param {Object} snippetEditorData The snippet editor data.
	 *
	 * @returns {SnippetPreview} Instance of snippetpreview.
	 */
	function initSnippetPreview( snippetEditorData ) {
		return snippetPreviewHelpers.create( snippetContainer, {
			title: snippetEditorData.title,
			urlPath: snippetEditorData.slug,
			metaDesc: snippetEditorData.description,
		}, ( data ) => {
			const previousData = snippetEditorHelpers.getDataFromStore( store );

			if (
				previousData.title !== data.title ||
				previousData.description !== data.metaDesc ||
				previousData.slug !== data.urlPath
			) {
				dispatchUpdateSnippetEditor( data );
			}
		} );
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

	jQuery( document ).ready( function() {
		var args, termScraper, translations;

		const editArgs = {
			analysisSection: "pageanalysis",
			shouldRenderSnippetPreview: !! wpseoTermScraperL10n.reactSnippetPreview,
			snippetEditorBaseUrl: wpseoTermScraperL10n.base_url,
		};
		store = initializeEdit( editArgs ).store;

		snippetContainer = $( "#wpseosnippet" );

		insertTinyMCE();

		tabManager = new TabManager( {
			strings: wpseoTermScraperL10n,
			focusKeywordField: "#wpseo_focuskw",
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive(),
		} );

		tabManager.init();

		termScraper = new TermDataCollector( { tabManager } );

		// Initialize the snippet editor data.
		let snippetEditorData = snippetEditorHelpers.getDataFromCollector( termScraper );
		const snippetEditorTemplates = snippetEditorHelpers.getTemplatesFromL10n( wpseoTermScraperL10n );
		snippetEditorData = snippetEditorHelpers.getDataWithTemplates( snippetEditorData, snippetEditorTemplates );

		snippetPreview = initSnippetPreview( snippetEditorData );

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
			args.callbacks.updatedKeywordsResults = function( results ) {
				let keyword = tabManager.getKeywordTab().getKeyWord();

				if ( tabManager.isMainKeyword( keyword ) ) {
					if ( keyword === "" ) {
						keyword = termScraper.getName();
					}
					store.dispatch( setSeoResultsForKeyword( keyword, results ) );
					store.dispatch( setActiveKeyword( keyword ) );
					store.dispatch( refreshSnippetEditor() );
				}
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

		if ( isKeywordAnalysisActive() ) {
			app.seoAssessor = new TaxonomyAssessor( app.i18n );
			app.seoAssessorPresenter.assessor = app.seoAssessor;
		}

		window.YoastSEO = {};
		window.YoastSEO.app = app;
		window.YoastSEO.store = store;

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

		// Hack needed to make sure Publish box and traffic light are still updated.
		disableYoastSEORenderers( app );
		let originalInitAssessorPresenters = app.initAssessorPresenters.bind( app );
		app.initAssessorPresenters = function() {
			originalInitAssessorPresenters();
			disableYoastSEORenderers( app );
		};

		/*
		 * Checks the snippet preview size and toggles views when the WP admin menu state changes.
		 * In WordPress, `wp-collapse-menu` fires when clicking on the Collapse/expand button.
		 * `wp-menu-state-set` fires also when the window gets resized and the menu can be folded/auto-folded/collapsed/expanded/responsive.
		 */
		jQuery( document ).on( "wp-collapse-menu wp-menu-state-set", function() {
			app.snippetPreview.handleWindowResizing();
		} );

		// Set the initial snippet editor data.
		store.dispatch( updateData( snippetEditorData ) );

		// Subscribe to the store to save the snippet editor data.
		store.subscribe( () => {
			const data = snippetEditorHelpers.getDataFromStore( store );

			if ( ! isEqual( snippetEditorData, data ) ) {
				snippetEditorData = data;
				const dataWithoutTemplates = snippetEditorHelpers.getDataWithoutTemplates( data, snippetEditorTemplates );
				termScraper.saveSnippetData( {
					title: dataWithoutTemplates.title,
					urlPath: dataWithoutTemplates.slug,
					metaDesc: dataWithoutTemplates.description,
				} );

				updateLegacySnippetEditor( data );
			}
		} );
	} );
}( jQuery, window ) );
