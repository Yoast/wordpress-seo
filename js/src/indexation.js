/* global jQuery, tb_show, tb_remove, TB_WIDTH, TB_HEIGHT, wpseoSetIgnore, ajaxurl */
import a11ySpeak from "a11y-speak";

import ProgressBar from "./ui/progressBar";

( ( $ ) => {
	let indexationInProgress = false;
	let stoppedIndexation = false;
	let processed = 0;
	const preIndexationActions = {};
	const indexationActions = {};

	window.yoast = window.yoast || {};
	window.yoast.indexation = window.yoast.indexation || {};
	window.yoast.indexation.registerPreIndexationAction = ( endpoint, action ) => {
		preIndexationActions[ endpoint ] = action;
	};
	window.yoast.indexation.registerIndexationAction = ( endpoint, action ) => {
		indexationActions[ endpoint ] = action;
	};

	/**
	 * Does an indexation request.
	 *
	 * @param {string} url   The url of the indexation that should be done.
	 * @param {string} nonce The WordPress nonce value for in the header.
	 *
	 * @returns {Promise} The request promise.
	 */
	async function doIndexationRequest( url, nonce ) {
		const response = await fetch( url, {
			method: "POST",
			headers: {
				"X-WP-Nonce": nonce,
			},
		} );
		return response.json();
	}

	/**
	 * Does the indexation of a given endpoint.
	 *
	 * @param {Object}      settings    The indexation settings.
	 * @param {string}      endpoint    The endpoint.
	 * @param {ProgressBar} progressBar The progress bar.
	 *
	 * @returns {Promise} The indexation promise.
	 */
	async function doIndexation( settings, endpoint, progressBar ) {
		let url = settings.restApi.root + settings.restApi.endpoints[ endpoint ];

		while ( ! stoppedIndexation && url !== false && processed <= settings.amount ) {
			if ( typeof preIndexationActions[ endpoint ] === "function" ) {
				await preIndexationActions[ endpoint ]( settings );
			}
			const response = await doIndexationRequest( url, settings.restApi.nonce );
			if ( typeof indexationActions[ endpoint ] === "function" ) {
				await indexationActions[ endpoint ]( response.objects, settings );
			}
			progressBar.update( response.objects.length );
			processed += response.objects.length;
			url = response.next_url;
		}
	}

	/**
	 * Starts the indexation.
	 *
	 * @param {Object}      settings    The indexation settings.
	 * @param {ProgressBar} progressBar The progress bar.
	 *
	 * @returns {Promise} The indexation promise.
	 */
	async function startIndexation( settings, progressBar ) {
		processed = 0;
		for ( const endpoint of Object.keys( settings.restApi.endpoints ) ) {
			await doIndexation( settings, endpoint, progressBar );
		}
	}

	$( () => {
		$( ".yoast-open-indexation" ).on( "click", function() {
			const settings = window[ $( this ).data( "settings" ) ];

			/*
			 * WordPress overwrites the tb_position function if the media library is loaded to ignore custom height and width arguments.
			 * So we temporarily revert that change as we do want to have custom height and width.
			 * Eslint is disabled as these have to use the correct names.
			 * @see https://core.trac.wordpress.org/ticket/27473
			 */
			/* eslint-disable camelcase */
			const old_tb_position = window.tb_position;
			window.tb_position = () => {
				jQuery( "#TB_window" ).css( {
					marginLeft: "-" + parseInt( ( TB_WIDTH / 2 ), 10 ) + "px", width: TB_WIDTH + "px",
					marginTop: "-" + parseInt( ( TB_HEIGHT / 2 ), 10 ) + "px",
				} );
			};
			tb_show( $( this ).data( "title" ), "#TB_inline?width=600&height=179&inlineId=" + settings.ids.modal, false );
			window.tb_position = old_tb_position;
			/* eslint-enable camelcase */

			if ( indexationInProgress === false ) {
				stoppedIndexation = false;
				indexationInProgress = true;

				a11ySpeak( settings.l10n.calculationInProgress, "polite" );
				const progressBar = new ProgressBar( settings.amount, settings.ids.count, settings.ids.progress );

				// If the div with the warning was removed, insert it again, so that a success/error alert can be shown.
				if ( ! $( "#yoast-indexation-warning" ).length ) {
					jQuery( '<div id="yoast-indexation-warning" class="notice"></div>' ).insertAfter( "#wpseo-title" ).hide();
				}

				startIndexation( settings, progressBar ).then( () => {
					if ( stoppedIndexation ) {
						return;
					}

					progressBar.complete();
					a11ySpeak( settings.l10n.calculationCompleted );
					$( "#yoast-indexation-warning" )
						.html( "<p>" + settings.message.indexingCompleted + "</p>" )
						.show()
						.addClass( "notice-success" )
						.removeClass( "notice-error" )
						.removeClass( "notice-warning" );
					$( settings.ids.message ).html( settings.message.indexingCompleted );

					tb_remove();
					indexationInProgress = false;
				} ).catch( error => {
					if ( stoppedIndexation ) {
						return;
					}
					console.error( error );
					a11ySpeak( settings.l10n.calculationFailed );
					$( "#yoast-indexation-warning" )
						.html( "<p>" + settings.message.indexingFailed + "</p>" )
						.show()
						.addClass( "notice-error" )
						.removeClass( "notice-warning" );
					$( settings.ids.message ).html( settings.message.indexingFailed );

					tb_remove();
					indexationInProgress = false;
				} );
			}
		} );

		$( ".yoast-indexation-stop" ).on( "click", () => {
			stoppedIndexation = true;
			tb_remove();
			// Reset the hash for if we linked from another page. Preventing an immediate re-run.
			window.location.hash = "";
			window.location.reload();
		} );

		$( "#yoast-indexation-dismiss-button" ).on( "click", function() {
			wpseoSetIgnore( "indexation_warning", "yoast-indexation-warning", jQuery( this ).data( "nonce" ) );
		} );

		$( "#yoast-indexation-remind-button" ).on( "click", function() {
			const nonce = jQuery( this ).data( "nonce" );

			jQuery.post(
				ajaxurl,
				{
					action: "wpseo_set_indexation_remind",
					_wpnonce: nonce,
				},
				function( data ) {
					if ( data ) {
						jQuery( "#yoast-indexation-warning" ).hide();
					}
				}
			);
		} );

		// Start the indexation if the hash matches a settings value.
		if ( window.location.hash && window.location.hash.startsWith( "#start-indexation-" ) ) {
			$( ".yoast-open-indexation" ).each( function() {
				if ( window.location.hash.endsWith( $( this ).data( "settings" ) ) ) {
					$( () => {
						$( this ).click();
					} );
				}
			} );
		}
	} );
} )( jQuery );
