/* global wpseo_premium_strings */
/* global wpseo_undo_redirect */
/* jshint -W097 */
/* jshint -W098 */
'use strict';

/**
 * Undoes a redirect
 *
 * @param {string} origin
 * @param {string} target
 * @param {string} type
 * @param {string} nonce
 * @param {object} source
 */
function wpseo_undo_redirect( origin, target, type, nonce, source ) {
	jQuery.post(
		ajaxurl,
		{
			action: 'wpseo_delete_redirect_plain',
			ajax_nonce: nonce,
			redirect: {
				origin: origin,
				target: target,
				type:   type
			}
		},
		function() {
			jQuery( source ).closest( '.yoast-alert' ).fadeOut( 'slow' );
		}
	);
}

/**
 * Creates a redirect
 *
 * @param {string} origin
 * @param {string} type
 * @param {string} nonce
 * @param {object} source
 */
function wpseo_create_redirect( origin, type, nonce, source ) {
	var target = '';
	if( parseInt( type, 10 ) !== 410 ) {
		target = window.prompt( wpseo_premium_strings.enter_new_url.replace( '%s', origin ) );

		if ( target === '' ) {
			window.alert( wpseo_premium_strings.error_new_url );
			return;
		}
	}

	jQuery.post(
		ajaxurl,
		{
			action: 'wpseo_add_redirect_plain',
			ajax_nonce: nonce,
			redirect: {
				origin: origin,
				target: target,
				type:   type
			}
		},
		function( response ) {
			var notice = jQuery( source ).closest( '.yoast-alert' );

			// Remove the classes first.
			jQuery( notice )
				.removeClass( 'updated' )
				.removeClass( 'error' );

			// Remove possibly added redirect errors
			jQuery( notice ).find( '.redirect_error' ).remove();

			if( response.error ) {
				// Add paragraph on top of the notice with actions and set class to error.
				jQuery( notice )
					.addClass( 'error' )
					.prepend( '<p class="redirect_error">' + response.error.message + '</p>' );

				return;
			}

			// Parse the success message
			var success_message = '';
			if( parseInt( type, 10 ) === 410 ) {
				success_message = wpseo_premium_strings.redirect_saved_no_target;
			}
			else {
				success_message = wpseo_premium_strings.redirect_saved.replace( '%2$s', '<code>' + response.target + '</code>' );
			}

			success_message = success_message.replace( '%1$s', '<code>' + response.origin + '</code>' );

			// Set class to updated and replace html with the success message
			jQuery( notice )
				.addClass( 'updated' )
				.html( '<p>' + success_message + '</p>' );
		},
		'json'
	);
}

(function( $ ) {
	$( window ).load( function() {
		$( '.wp-list-table.tags tbody' ).on( 'DOMNodeRemoved', function() {
			jQuery.post(
				ajaxurl,
				{
					action: 'yoast_get_notifications'
				},
				function( response ) {
					if ( '' !== response ) {
						$( '#ajax-response' ).append( response );
					}
				}
			);
		});
	});
})( jQuery );
