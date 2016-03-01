(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global ajaxurl */
/* global wpseoAdminGlobalL10n */
/* jshint -W097 */
/* jshint unused:false */
'use strict';

/**
 * Used to dismiss the tagline notice for a specific user.
 *
 * @deprecated 3.2
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
 * @deprecated 3.2
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
 * @param {string} dismiss_link The URL that leads to the dismissing of the notice.
 *
 * @returns {Object} Anchor to dismiss.
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

	jQuery( '.yoast-dismissible > .notice-dismiss').click( function() {
		var $parent_div = jQuery( this ).parent('.yoast-dismissible');
		var notification = $parent_div.attr( 'id' );
		var options = {
			action: 'yoast_dismiss_notification',
			notification: notification,
			nonce: $parent_div.data( 'nonce' ),
			data: $parent_div.data( 'json' )
		};

		options[notification] = '1';

		jQuery.post(
			ajaxurl,
			options
		);

		$parent_div.fadeTo( 100 , 0, function() {
			jQuery(this).slideUp( 100, function() {
				jQuery(this).remove();
			});
		});

		return false;
	});
});

},{}]},{},[1]);
