/* global yoastSiteWideAnalysisData, tb_remove */

import ProminentWordCalculation from "./keywordSuggestions/siteWideCalculation";
import ProminentWordCache from "./keywordSuggestions/ProminentWordCache";
import ProminentWordCachePopulator from "./keywordSuggestions/ProminentWordCachePopulator";
import RestApi from "./helpers/restApi";
import a11ySpeak from "a11y-speak";

let settings = yoastSiteWideAnalysisData.data;

let infoContainer;
let prominentWordCache;
let prominentWordsCalculated = false;

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
			let newWidth = postCount * ( 100 / settings.amount.total );

			progress.progressbar( "value", Math.round( newWidth ) );

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
			let newWidth = pageCount * ( 100 / settings.amountPages.total );

			progress.progressbar( "value", Math.round( newWidth ) );
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

	jQuery.get(
		{
			url: settings.restApi.root + "yoast/v1/complete_recalculation/",
			beforeSend: ( xhr ) => {
				xhr.setRequestHeader( "X-WP-Nonce", settings.restApi.nonce );
			},
			success: function() {
				prominentWordsCalculated = true;
				jQuery( "#internalLinksCalculation" ).html( settings.message.analysisCompleted );

				tb_remove();
			},
		}
	);
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
 * Opens the internal link calculation modal.
 *
 * @returns {void}
 */
function openInternalLinkCalculation() {
	jQuery( "#general-tab" ).click();

	if ( prominentWordsCalculated === false ) {
		jQuery( "#openInternalLinksCalculation" ).click();
	}
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

	jQuery( "#noticeRunAnalysis" ).click( openInternalLinkCalculation );

	if ( document.location.hash === "#open-internal-links-calculation" ) {
		setTimeout( openInternalLinkCalculation, 0 );
	}

	infoContainer = jQuery( ".yoast-js-prominent-words-info" );
}

jQuery( init );
