/* global ajaxurl */
/* global wpseoAdminGlobalL10n */
/* jshint -W097 */
/* jshint unused:false */
'use strict';

/**
 * Used to dismiss the tagline notice for a specific user.
 *
 * @param {string} nonce
 */
function wpseoDismissTaglineNotice( nonce ) {
	jQuery.post( ajaxurl, {
			action: 'wpseo_dismiss_tagline_notice',
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

/**
 * Make the notices dismissible (again)
 */
function wpseoMakeDismissible() {
	jQuery( '.notice.is-dismissible' ).each( function() {
		var $notice = jQuery( this );
		if ( $notice.find( '.notice-dismiss').empty() ) {
			var	$button = jQuery( '<button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>' );

			$notice.append( $button );

			$button.on( 'click.wp-dismiss-notice', function( ev ) {
				ev.preventDefault();
				$notice.fadeTo( 100 , 0, function() {
					jQuery(this).slideUp( 100, function() {
						jQuery(this).remove();
					});
				});
			});
		}
	});
}

/**
 * Generates a dismissable anchor button
 *
 * @param {string} dismiss_link
 *
 * @returns {*}
 */
function wpseoDismissLink( dismiss_link ) {
	return jQuery(
		'<a href="' + dismiss_link + '" type="button" class="notice-dismiss">' +
		'<span class="screen-reader-text">Dismiss this notice.</span>' +
		'</a>'
	);
}

jQuery( document ).ready( function() {
	jQuery( '#wpseo-dismiss-about > .notice-dismiss').replaceWith( wpseoDismissLink( wpseoAdminGlobalL10n.dismiss_about_url ) );
	jQuery( '#wpseo-dismiss-tagline-notice > .notice-dismiss').replaceWith( wpseoDismissLink( wpseoAdminGlobalL10n.dismiss_tagline_url ) );

	jQuery( '.yoast-dismissible > .notice-dismiss').click( function() {
		var parent_div = jQuery( this ).parent('.yoast-dismissible');

		jQuery.post(
			ajaxurl,
			{
				action: parent_div.attr( 'id').replace( /-/g, '_' ),
				_wpnonce: parent_div.data( 'nonce' ),
				data: parent_div.data( 'json' )
			}
		);
	});
});
