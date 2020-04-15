/* global yoastIndexationData, jQuery, tb_remove */

const settings = yoastIndexationData;

import a11ySpeak from "a11y-speak";

import ProgressBar from "./ui/progressBar";

( ( $ ) => {
	let indexationInProgress = false;
	let indexationCompleted  = false;
	const indexationActions  = {};

	window.yoast = window.yoast || {};
	window.yoast.registerIndexationAction = ( endpoint, action ) => {
		indexationActions[ endpoint ] = action;
	};

	/**
     * Does an indexation request.
     *
     * @param {string} url The url of the indexation that should be done.
     *
     * @returns {Promise} The request promise.
     */
	async function doIndexationRequest( url ) {
		const response = await fetch( url, {
			method: "POST",
			headers: {
				"X-WP-Nonce": settings.restApi.nonce,
			},
		} );
		return response.json();
	}

	/**
     * Does the indexation of a given endpoint
     *
     * @param {string}      endpoint    The endpoint.
     * @param {ProgressBar} progressBar The progress bar.
     *
     * @returns {Promise} The indexation promise.
     */
	async function doIndexation( endpoint, progressBar ) {
		let url = settings.restApi.root + settings.restApi.endpoints[ endpoint ];

		while ( url !== false ) {
			const response = await doIndexationRequest( url );
			if ( indexationActions[ endpoint ] ) {
				await indexationActions[ endpoint ]( response.objects );
			}
			progressBar.update( response.objects.length );
			url = response.next_url;
		}
	}

	/**
     * Starts the indexation.
     *
     * @param {ProgressBar} progressBar The progress bar.
     *
     * @returns {Promise} The indexation promise.
     */
	async function startIndexation( progressBar ) {
		for ( const endpoint of Object.keys( settings.restApi.endpoints ) ) {
			await doIndexation( endpoint, progressBar );
		}
	}

	$( () => {
		$( ".yoast-js-run-indexation--all " ).on( "click", function() {
			if ( indexationInProgress === false ) {
				a11ySpeak( settings.l10n.calculationInProgress );
				const progressBar = new ProgressBar( settings.amount, "#yoast-indexation-current-count", "#yoast-indexation-progress-bar" );
				startIndexation( progressBar ).then( () => {
					progressBar.complete();
					a11ySpeak( settings.l10n.calculationCompleted );
					$( "#yoast-indexation" ).html( settings.message.indexingCompleted );

					tb_remove();
					indexationInProgress = false;
					indexationCompleted  = true;
				} );
				indexationInProgress = true;
			}
		} );
	} );
} )( jQuery );
