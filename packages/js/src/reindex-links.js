/* global yoastReindexLinksData, tb_remove */
import jQuery from "jquery";

const settings = yoastReindexLinksData.data;
let linkIndexingCompleted = false;

import a11ySpeak from "a11y-speak";

/**
 * Represents the progressbar for the reindexing for the links.
 */
class IndexProgressBar {
	/**
	 * The constructor.
	 *
	 * @param {int} total The total amount of items.
	 */
	constructor( total ) {
		this.element = jQuery( "#wpseo_count_index_links" );
		this.progressbarTarget = jQuery( "#wpseo_index_links_progressbar" ).progressbar( { value: 0 } );
		this.total = parseInt( total, 10 );
		this.totalProcessed = 0;
	}

	/**
	 * Updates the processbar.
	 *
	 * @param {int} countProcessed The amount of items that has been process.
	 *
	 * @returns {void}
	 */
	update( countProcessed ) {
		this.totalProcessed += countProcessed;
		const newWidth = this.totalProcessed * ( 100 / this.total );

		this.progressbarTarget.progressbar( "value", Math.round( newWidth ) );
		this.element.html( this.totalProcessed );
	}

	/**
	 * Completes the processbar.
	 *
	 * @returns {void}
	 */
	complete() {
		this.progressbarTarget.progressbar( "value", 100 );
	}
}

/**
 * Does the reindex request for the current post and updates the processbar.
 *
 * @param {IndexProgressBar} progressbar The progressbar.
 * @param {Promise.resolve}  resolve     The method to complete index process.
 *
 * @returns {void}
 */
function doReindexRequest( progressbar, resolve ) {
	// Do
	jQuery.ajax( {
		type: "GET",
		url: settings.restApi.root + settings.restApi.endpoint,
		beforeSend: ( xhr ) => {
			xhr.setRequestHeader( "X-WP-Nonce", settings.restApi.nonce );
		},
		success: function( response ) {
			const totalIndexed = parseInt( response, 10 );
			if ( totalIndexed !== 0 ) {
				progressbar.update( totalIndexed );

				doReindexRequest( progressbar, resolve );

				return;
			}

			progressbar.complete();
			resolve();
		},
	} );
}

/**
 * Starts the reindexing of the links.
 *
 * @returns {Promise} Promise.
 */
function reindexLinks() {
	// Do request to get post ids
	return new Promise( ( resolve ) => {
		const progressbar = new IndexProgressBar( settings.amount );
		doReindexRequest( progressbar, resolve );
	} );
}

/**
 * Sets the finish message, when indexing has been completed.
 *
 * @returns {void}
 */
function completeReindexing() {
	linkIndexingCompleted = true;
	a11ySpeak( settings.l10n.calculationCompleted );
	jQuery( "#reindexLinks" ).html( settings.message.indexingCompleted );

	tb_remove();
}

/**
 * Starts the reindexing of the links.
 *
 * @returns {void}
 */
function startReindexing() {
	a11ySpeak( settings.l10n.calculationInProgress );

	const promises = [];
	promises.push( reindexLinks() );
	Promise.all( promises ).then( completeReindexing );
}

/**
 * Opens the link indexing modal.
 *
 * @returns {void}
 */
function openLinkIndexing() {
	jQuery( "#general-tab" ).trigger( "click" );

	if ( linkIndexingCompleted === false ) {
		jQuery( "#openLinkIndexing" ).trigger( "click" );
	}
}

/**
 * Initializes the indexation of links.
 *
 * @returns {void}
 */
function init() {
	let recalculating = false;
	jQuery( ".yoast-js-calculate-index-links--all " ).on( "click", function() {
		if ( recalculating === false ) {
			startReindexing();

			recalculating = true;
		}
	} );

	jQuery( "#noticeRunLinkIndex" ).on( "click", openLinkIndexing );

	if ( window.location.href.indexOf( "&reIndexLinks=1" ) !== -1 ) {
		jQuery( openLinkIndexing );
	}
}

jQuery( init );
