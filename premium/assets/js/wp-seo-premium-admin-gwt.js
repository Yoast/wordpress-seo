/* jshint -W097 */
/* jshint -W098 */
/* global yoast_overlay */
'use strict';

/**
 * Opens a popup window
 *
 * @param {string} url
 * @returns {Window}
 */
function wpseo_gwt_open_authorize_code_window( url ) {
	var w = 600,
		h = 500,
		left = (screen.width / 2) - (w / 2),
		top = (screen.height / 2) - (h / 2);
	return window.open( url, 'wpseogwtauthcode', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left );
}

/**
 * Creates a redirect for the given URL
 *
 * @param {string} old_url
 * @param {string} current_view
 */
function wpseo_create_redirect( old_url, current_view ) {
	var new_url = window.prompt( wpseo_premium_strings.enter_new_url.replace( '%s', old_url ) );

	if ( null !== new_url ) {
		if ( '' !== new_url ) {
			jQuery.post(
				ajaxurl,
				{
					action: 'wpseo_create_redirect_url',
					ajax_nonce: jQuery( '.wpseo_redirects_ajax_nonce' ).val(),
					old_url: old_url,
					new_url: new_url,
					type: '301'
				},
				function( response ) {
					var resp = JSON.parse( response );
					/**
					 * @todo create a nice overlay
					 */

					var update_div = jQuery( '<div>' ).addClass( 'updated' ).html( '<p>' + wpseo_premium_strings.redirect_saved.replace( '%1$s', '<code>' + resp.old_url + '</code>' ).replace( '%2$s', '<code>' + resp.new_url + '</code>' ) + '</p>' );
					jQuery( '.wrap' ).prepend( update_div );

					jQuery( update_div ).delay( 500 ).fadeOut( 'slow', function() {
						jQuery( this ).remove();
					}
					);

					// Remove the redirect row if we're in the not-redirected view
					if ( 'not-redirected' === current_view ) {
						jQuery( 'span.value:contains("' + old_url + '")' ).closest( 'tr' ).fadeOut( 'slow', function() {
							jQuery( this ).remove();
						}
						);
					}
				}
			);
		}
		else {
			yoast_overlay.add_message( wpseo_premium_strings.error_saving_redirect, wpseo_premium_strings.error_new_url, 5 );
		}
	}
}

/**
 * Ignore a specific crawl issue
 *
 * @param {string} url
 */
function wpseo_ignore_redirect( url ) {
	jQuery.post(
		ajaxurl,
		{ action: 'wpseo_ignore_crawl_issue', ajax_nonce: jQuery( '.wpseo_redirects_ajax_nonce' ).val(), url: url },
		function( response ) {
			if ( 'true' === response ) {
				jQuery( 'span:contains(' + url + ')' ).closest( 'tr' ).remove();
			}
		}
	);
}

/**
 * Un-ignore a crawl issue
 *
 * @param {string} url
 */
function wpseo_unignore_redirect( url ) {
	jQuery.post(
		ajaxurl,
		{ action: 'wpseo_unignore_crawl_issue', ajax_nonce: jQuery( '.wpseo_redirects_ajax_nonce' ).val(), url: url },
		function( response ) {
			if ( 'true' === response ) {
				jQuery( 'span:contains(' + url + ')' ).closest( 'tr' ).remove();
			}
		}
	);
}
