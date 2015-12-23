/* global wpseo_premium_strings */
/* global wpseoMakeDismissible */
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
 * @param {string} id
 */
function wpseo_undo_redirect( origin, target, type, nonce, id ) {
	jQuery.post(
		ajaxurl,
		{
			action: 'wpseo_delete_redirect_plain',
			ajax_nonce: nonce,
			redirect: {
				origin: origin,
				target: target,
				type:   type
			},
			id: id
		},
		function( response ) {
			jQuery( '#' + response ).fadeOut( 'slow' );
		}
	);
}

/**
 * Creates a redirect
 *
 * @param {string} origin
 * @param {string} nonce
 * @param {string} id
 */
function wpseo_create_redirect( origin, nonce, id ) {
	var target = window.prompt( wpseo_premium_strings.enter_new_url.replace( '%s', origin ) );

	if ( null !== target ) {
		if ( '' !== target ) {
			jQuery.post(
				ajaxurl,
				{
					action: 'wpseo_add_redirect_plain',
					ajax_nonce: nonce,
					redirect : {
						origin : origin,
						target : target,
						type   : 301
					},
					id: id
				},
				function( response ) {
					var resp = JSON.parse( response );
					jQuery( '#' + resp.id + ' p' ).html( wpseo_premium_strings.redirect_saved.replace( '%1$s', '<code>' + resp.old_url + '</code>' ).replace( '%2$s', '<code>' + resp.new_url + '</code>' ) );
				}
			);
		}
		else {
			window.alert( wpseo_premium_strings.error_new_url );
		}
	}
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
						wpseoMakeDismissible();
					}
				}
			);
		}
		);
	}
	);
})( jQuery );
