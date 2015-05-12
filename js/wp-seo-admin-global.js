/* global ajaxurl */
/* jshint -W097 */
/* jshint unused:false */
'use strict';
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
