/* global yoastIndexationData, jQuery, tb_show, tb_remove, TB_WIDTH, TB_HEIGHT, wpseoSetIgnore */
import a11ySpeak from "a11y-speak";

import ProgressBar from "./ui/progressBar";

const settings = yoastIndexationData;

( ( $ ) => {
	let indexationInProgress = false;
	const indexationActions = {};

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
			if ( typeof indexationActions[ endpoint ] === "function" ) {
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
		$( "#yoast-open-indexation" ).on( "click", function() {
			// WordPress overwrites the tb_position function if the media library is loaded to ignore custom height and width arguments.
			// So we temporarily revert that change as we do want to have custom height and width.
			// Eslint is disabled as these have to use the correct names.
			// @see https://core.trac.wordpress.org/ticket/27473
			/* eslint-disable camelcase */
			const old_tb_position = window.tb_position;
			window.tb_position = () => {
				jQuery( "#TB_window" ).css( {
					marginLeft: "-" + parseInt( ( TB_WIDTH / 2 ), 10 ) + "px", width: TB_WIDTH + "px",
					marginTop: "-" + parseInt( ( TB_HEIGHT / 2 ), 10 ) + "px",
				} );
			};
			tb_show( this.innerText, "#TB_inline?width=600&height=175&inlineId=yoast-indexation-wrapper", false );
			window.tb_position = old_tb_position;
			/* eslint-enable camelcase */

			if ( indexationInProgress === false ) {
				a11ySpeak( settings.l10n.calculationInProgress );
				const progressBar = new ProgressBar( settings.amount, settings.ids.count, settings.ids.progress );
				startIndexation( progressBar ).then( () => {
					progressBar.complete();
					a11ySpeak( settings.l10n.calculationCompleted );
					$( "#yoast-indexation-warning" )
						.html( "<p>" + settings.message.indexingCompleted + "</p>" )
						.addClass( "notice-success" )
						.removeClass( "notice-warning" );

					tb_remove();
					indexationInProgress = false;
				} ).catch( error => {
					console.error( error );
					a11ySpeak( settings.l10n.calculationFailed );
					$( "#yoast-indexation-warning" )
						.html( "<p>" + settings.message.indexingFailed + "</p>" )
						.addClass( "notice-error" )
						.removeClass( "notice-warning" );

					tb_remove();
				} );
				indexationInProgress = true;
			}
		} );

		$( "#yoast-indexation-dismiss-button" ).on( "click", function() {
			wpseoSetIgnore( "indexation_warning", "yoast-indexation-warning", jQuery( this ).data( "nonce" ) );
		} );
	} );
} )( jQuery );
