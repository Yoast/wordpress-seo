/* global yoastSiteWideAnalysisData */

import ProminentWordCalculation from "./keywordSuggestions/siteWideCalculation";
import a11ySpeak from "a11y-speak";

let settings = yoastSiteWideAnalysisData.data;

let prominentWordCalculation = null;
let infoContainer, progressContainer, completedContainer;

/**
 * Start recalculating.
 *
 * @param {number} postCount The number of posts to recalculate.
 * @param {boolean} recalculateAll Whether to recalculate all posts.
 * @returns {void}
 */
function startRecalculating( postCount, recalculateAll = true ) {
	// Prevent duplicate calculation.
	if ( prominentWordCalculation !== null ) {
		return;
	}

	let progressElement = jQuery( ".yoast-js-prominent-words-progress-current" );

	infoContainer.hide();
	progressContainer.show();

	prominentWordCalculation = new ProminentWordCalculation( {
		totalPosts: postCount,
		recalculateAll,
		rootUrl: settings.restApi.root,
		nonce: settings.restApi.nonce,
		allProminentWordIds: settings.allWords,
	} );

	prominentWordCalculation.on( "processedPost", ( postCount ) => {
		progressElement.html( postCount );
	} );

	prominentWordCalculation.start();

	a11ySpeak( settings.l10n.calculationInProgress );

	// Free up the variable to start another recalculation.
	prominentWordCalculation.on( "complete", () => {
		prominentWordCalculation = null;

		progressContainer.hide();
		completedContainer.show();

		a11ySpeak( settings.l10n.calculationCompleted );
	} );
}

/**
 * Initializes the site wide analysis tab.
 *
 * @returns {void}
 */
function init() {
	jQuery( ".yoast-js-calculate-prominent-words--all" ).on( "click", function() {
		startRecalculating( settings.amount.total );

		jQuery( this ).hide();
	} );

	infoContainer = jQuery( ".yoast-js-prominent-words-info" );

	progressContainer = jQuery( ".yoast-js-prominent-words-progress" );
	progressContainer.hide();

	completedContainer = jQuery( ".yoast-js-prominent-words-completed" );
	completedContainer.hide();
}

jQuery( init );
