/* global yoastSiteWideAnalysisData */

import ProminentWordCalculation from "./keywordSuggestions/siteWideCalculation";
import ProminentWordCache from "./keywordSuggestions/ProminentWordCache";
import ProminentWordCachePopulator from "./keywordSuggestions/ProminentWordCachePopulator";
import RestApi from "./helpers/restApi";
import a11ySpeak from "a11y-speak";

let settings = yoastSiteWideAnalysisData.data;

let infoContainer;
let prominentWordCache;

/**
 * Recalculates posts
 *
 * @returns {Promise} Resolves when we have recalculated posts.
 */
function recalculatePosts() {
	let progressElement = jQuery( "#wpseo_count_posts" );
	let progress = jQuery( "#wpseo_internal_links_posts_progressbar" ).progressbar( { value: 0 } );
	let rootUrl = settings.restApi.root;

	return new Promise( ( resolve ) => {
		let postsCalculation = new ProminentWordCalculation( {
			totalPosts: settings.amount.total,
			recalculateAll: true,
			rootUrl: rootUrl,
			nonce: settings.restApi.nonce,
			allProminentWordIds: settings.allWords,
			listEndpoint: rootUrl + "wp/v2/posts/",
			prominentWordCache,
		} );

		postsCalculation.on( "processedPost", ( postCount ) => {
			let new_width = postCount * ( 100 / settings.amount.total );

			progress.progressbar( "value", Math.round( new_width ) );

			progressElement.html( postCount );
		} );

		postsCalculation.start();

		// Free up the variable to start another recalculation.
		postsCalculation.on( "complete", resolve );
	} );
}

/**
 * Recalculates pages
 *
 * @returns {Promise} Resolves when we have recalculated pages.
 */
function recalculatePages() {
	let progressElement = jQuery( "#wpseo_count_pages" );
	let progress = jQuery( "#wpseo_internal_links_pages_progressbar" ).progressbar( { value: 0 } );
	let rootUrl = settings.restApi.root;

	return new Promise( ( resolve ) => {
		let pagesCalculation = new ProminentWordCalculation( {
			totalPosts: settings.amountPages.total,
			recalculateAll: true,
			rootUrl: rootUrl,
			nonce: settings.restApi.nonce,
			allProminentWordIds: settings.allWords,
			listEndpoint: rootUrl + "wp/v2/pages/",
			prominentWordCache,
		} );

		pagesCalculation.on( "processedPost", ( pageCount ) => {
			let new_width = pageCount * ( 100 / settings.amountPages.total );

			progress.progressbar( "value", Math.round( new_width ) );
			progressElement.html( pageCount );
		} );

		pagesCalculation.start();

		// Free up the variable to start another recalculation.
		pagesCalculation.on( "complete", resolve );
	} );
}

/**
 * Shows completion to the user
 *
 * @returns {void}
 */
function showCompletion() {
	a11ySpeak( settings.l10n.calculationCompleted );

	jQuery( '#openInternalLinksCalculation' )
		.addClass( 'button-disabled' )
		.removeClass( 'thickbox' )
		.attr( 'href', '#top#general' );
}

/**
 * Start recalculating.
 *
 * @returns {void}
 */
function startRecalculating() {
	a11ySpeak( settings.l10n.calculationInProgress );

	let restApi = new RestApi( { rootUrl: settings.restApi.root, nonce: settings.restApi.nonce } );

	prominentWordCache  = new ProminentWordCache();
	let populator       = new ProminentWordCachePopulator( { cache: prominentWordCache, restApi: restApi } );

	populator.populate()
		.then( recalculatePosts )
		.then( recalculatePages )
		.then( showCompletion );
}

/**
 * Initializes the site wide analysis tab.
 *
 * @returns {void}
 */
function init() {
	let recalculating = false;
	jQuery( ".yoast-js-calculate-prominent-words--all" ).on( "click", function() {
		if( recalculating === false ) {
			startRecalculating();

			recalculating = true;
		}
	} );

	infoContainer = jQuery( ".yoast-js-prominent-words-info" );
}

jQuery( init );
