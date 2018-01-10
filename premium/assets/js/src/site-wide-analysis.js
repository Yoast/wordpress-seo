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
 * Recalculates all unindexed posts, pages and custom post types.
 *
 * @returns {Promise} Promise containing the resolved calculation Promises.
 */
function recalculateUnindexed() {
	let progressElement = jQuery( "#wpseo_count_items" );
	let progress        = jQuery( "#wpseo_internal_links_unindexed_progressbar" ).progressbar( { value: 0 } );

	let calculations    = [];
	let processed       = {};
	let totalProcessed  = 0;

	Object.keys( settings.allItems ).forEach( ( key ) => {
		let postTypeItems = settings.allItems[key];

		settings.totalPostTypeItems = postTypeItems;

		let calculationPromise = new Promise( ( resolve ) => {
			let prominentWordsCalculation = createProminentWordsCalculation( settings, key );

			prominentWordsCalculation.on( "processedPost", ( postCount, total, postType ) => {
				// Increment the total processed for the current postType.
				processed[postType] = postCount;

				totalProcessed = sumValues( processed );

				// Update the progress bar.
				updateProgress( progress, progressElement, totalProcessed, settings.totalItems );
			} );

			prominentWordsCalculation.start();

			// Free up the variable to start another recalculation.
			prominentWordsCalculation.on( "complete", resolve );
		} );

		calculations.push( calculationPromise );
	} );

	return Promise.all( calculations );
}

/**
 * Sums up the values of the passed object.
 *
 * @param {Object} values The values to sum up.
 *
 * @returns {Number} The total sum of the object values.
 */
function sumValues( values ) {
	return Object.values( values ).reduce( ( a, b ) => a + b );
}

/**
 * Creates a new ProminentWordCalculation object.
 *
 * @param {Object} settings The settings to use for the calculation.
 * @param {string} postTypeRestBase The endpoint to use for the REST API request.
 *
 * @returns {SiteWideCalculation} The SiteWideCalculation object.
 */
function createProminentWordsCalculation( settings, postTypeRestBase ) {
	return new ProminentWordCalculation( {
		nonce:                  settings.restApi.nonce,
		rootUrl:                settings.restApi.root,
		totalPosts:             settings.totalPostTypeItems,
		listEndpoint:           settings.restApi.root + "wp/v2/" + postTypeRestBase,
		postTypeRestBase:       postTypeRestBase,
		recalculateAll:         true,
		allProminentWordIds:    settings.allWords,
		prominentWordCache,
	} );
}

/**
 * Updates the progressbar and progress counter.
 *
 * @param {HTMLElement} bar     The progress bar element.
 * @param {HTMLElement} counter The progress counter element.
 * @param {Number}      current The current progress value.
 * @param {Number}      total   The total amount of items.
 *
 * @returns {void}
 */
function updateProgress( bar, counter, current, total ) {
	let barWidth = current * ( 100 / total );

	bar.progressbar( "value", Math.round( barWidth ) );

	counter.html( current );
}

/**
 * Shows the recalculation completion to the user.
 *
 * @returns {void}
 */
function showCompletion() {
	a11ySpeak( settings.l10n.calculationCompleted );

	jQuery.get( {
		url: settings.restApi.root + "yoast/v1/complete_recalculation/",
		beforeSend: ( xhr ) => {
			xhr.setRequestHeader( "X-WP-Nonce", settings.restApi.nonce );
		},
		success: function() {
			prominentWordsCalculated = true;
			jQuery( "#internalLinksCalculation" ).html( settings.message.analysisCompleted );

			tb_remove();
		},
	} );
}

/**
 * Starts the recalculating process.
 *
 * @returns {void}
 */
function startRecalculating() {
	a11ySpeak( settings.l10n.calculationInProgress );

	let restApi = new RestApi( { rootUrl: settings.restApi.root, nonce: settings.restApi.nonce } );

	prominentWordCache  = new ProminentWordCache();
	let populator       = new ProminentWordCachePopulator( { cache: prominentWordCache, restApi: restApi } );

	populator.populate()
		.then( recalculateUnindexed )
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
		if ( recalculating === false ) {
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
