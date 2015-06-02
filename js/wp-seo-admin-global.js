/* global ajaxurl */
/* jshint -W097 */
/* jshint unused:false */
'use strict';
jQuery( document ).ready( function() {
	jQuery( '#wpseo-dismiss-about > .notice-dismiss' ).click( function() {
		wpseoDismissAbout( jQuery( '#wpseo-dismiss-about' ).data( 'nonce' ) );
	});
});

/**
 * Used to dismiss the after-update admin notice for a specific user until the next update.
 *
 * @param {string} nonce
 */
function wpseoDismissAbout( nonce ) {
	jQuery.post( ajaxurl, {
			action: 'wpseo_dismiss_about',
			_wpnonce: nonce
		}
	);
}

/**
 * Used to remove the admin notices for several purposes, dies on exit.
 *
 * @param {string} option
 * @param {string} hide
 * @param {string} nonce
 */
function wpseoSetIgnore( option, hide, nonce ) {
	jQuery.post( ajaxurl, {
			action: 'wpseo_set_ignore',
			option: option,
			_wpnonce: nonce
		}, function( data ) {
			if ( data ) {
				jQuery( '#' + hide ).hide();
				jQuery( '#hidden_ignore_' + option ).val( 'ignore' );
			}
		}
	);
}
