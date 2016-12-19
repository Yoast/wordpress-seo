/* global yoastSiteWideAnalysisData */

import ProminentWordCalculation from "./keywordSuggestions/siteWideCalculation";
import ProminentWordCache from "./keywordSuggestions/ProminentWordCache";
import ProminentWordCachePopulator from "./keywordSuggestions/ProminentWordCachePopulator";
import RestApi from "./helpers/restApi";

let settings = yoastSiteWideAnalysisData.data;

let progressContainer, completedContainer;
let prominentWordCache;

/**
 * Recalculates posts
 *
 * @returns {Promise} Resolves when we have recalculated posts.
 */
function recalculatePosts() {
	let progressElement = jQuery( ".yoast-js-prominent-words-progress-current" );
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
	let progressElement = jQuery( ".yoast-js-prominent-words-pages-progress-current" );
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

		pagesCalculation.on( "processedPost", ( postCount ) => {
			progressElement.html( postCount );
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
	progressContainer.hide();
	completedContainer.show();
}

/**
 * Start recalculating.
 *
 * @returns {void}
 */
function startRecalculating() {
	progressContainer.show();

	let restApi = new RestApi( { rootUrl: settings.restApi.root, nonce: settings.restApi.nonce } );

	prominentWordCache = new ProminentWordCache();
	let populator = new ProminentWordCachePopulator( { cache: prominentWordCache, restApi: restApi } );

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
	jQuery( ".yoast-js-calculate-prominent-words--all" ).on( "click", function() {
		startRecalculating();

		jQuery( this ).hide();
	} );

	progressContainer = jQuery( ".yoast-js-prominent-words-progress" );
	progressContainer.hide();

	completedContainer = jQuery( ".yoast-js-prominent-words-completed" );
	completedContainer.hide();
}

jQuery( init );
