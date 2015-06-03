/* global wpseo_premium_strings */
/* jshint -W097 */
/* jshint -W098 */
'use strict';

/**
 * Undoes a redirect
 *
 * @param {string} url
 * @param {string} nonce
 * @param {string} id
 */
function wpseo_undo_redirect( url, nonce, id ) {
	jQuery.post(
		ajaxurl,
		{
			action: 'wpseo_delete_redirect_url',
			ajax_nonce: nonce,
			redirect: { key: url },
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
 * @param {string} old_url
 * @param {string} nonce
 * @param {string} id
 */
function wpseo_create_redirect( old_url, nonce, id ) {
	var new_url = window.prompt( wpseo_premium_strings.enter_new_url.replace( '%s', old_url ) );

	if ( null !== new_url ) {
		if ( '' !== new_url ) {
			jQuery.post(
				ajaxurl,
				{
					action: 'wpseo_create_redirect_url',
					ajax_nonce: nonce,
					old_url: old_url,
					new_url: new_url,
					id: id,
					type: '301'
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
