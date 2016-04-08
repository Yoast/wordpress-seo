/* global ajaxurl */
/* global wpseoAdminGlobalL10n */
/* jshint -W097 */
/* jshint unused:false */
(function() {
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
			if ( $notice.find( '.notice-dismiss' ).empty() ) {
				var $button = jQuery( '<button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>' );

				$notice.append( $button );

				$button.on( 'click.wp-dismiss-notice', function( ev ) {
					ev.preventDefault();
					$notice.fadeTo( 100, 0, function() {
						jQuery( this ).slideUp( 100, function() {
							jQuery( this ).remove();
						} );
					} );
				} );
			}
		} );
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
		jQuery( '#wpseo-dismiss-about > .notice-dismiss' ).replaceWith( wpseoDismissLink( wpseoAdminGlobalL10n.dismiss_about_url ) );
		jQuery( '#wpseo-dismiss-tagline-notice > .notice-dismiss' ).replaceWith( wpseoDismissLink( wpseoAdminGlobalL10n.dismiss_tagline_url ) );

		jQuery( '.yoast-dismissible > .notice-dismiss' ).click( function() {
			var $parentDiv = jQuery( this ).parent( '.yoast-dismissible' );

			// Deprecated, todo: remove when all notifiers have been implemented.
			jQuery.post(
				ajaxurl,
				{
					action: $parentDiv.attr( 'id' ).replace( /-/g, '_' ),
					_wpnonce: $parentDiv.data( 'nonce' ),
					data: $parentDiv.data( 'json' )
				}
			);

			jQuery.post(
				ajaxurl,
				{
					action: 'yoast_dismiss_notification',
					notification: $parentDiv.attr( 'id' ),
					nonce: $parentDiv.data( 'nonce' ),
					data: $parentDiv.data( 'json' )
				}
			);

			$parentDiv.fadeTo( 100 , 0, function() {
				jQuery(this).slideUp( 100, function() {
					jQuery(this).remove();
				});
			});

			return false;
		} );

		jQuery( '.yoast-help-button' ).on( 'click', function() {
			var $button = jQuery( this ),
				helpPanel = jQuery( '#' + $button.attr( 'aria-controls' ) ),
				isPanelVisible = helpPanel.is( ':visible' );

			jQuery( helpPanel ).slideToggle( 200, function() {
				$button.attr( 'aria-expanded', ! isPanelVisible );
			});
		});
	});
	window.wpseoDismissTaglineNotice = wpseoDismissTaglineNotice;
	window.wpseoSetIgnore = wpseoSetIgnore;
	window.wpseoMakeDismissible = wpseoMakeDismissible;
	window.wpseoDismissLink = wpseoDismissLink;
}());

(function( $ ) {
	'use strict';

	$( '.nav-tab' ).click( function() {
		closeVideoSlideout( 0 );
	} );

	$( '.wpseo-tab-video-container' ).on( 'click', '.wpseo-tab-video-container__handle', function( e ) {
		var $target = $( e.delegateTarget ).find( '.wpseo-tab-video-slideout' );
		if ( $target.is( ':hidden' ) ) {
			openVideoSlideout( $target, 400 );
		}
		else {
			closeVideoSlideout( 400 );
		}
		return false;
	} );

	/**
	 * Open Video Slideout
	 *
	 * @param {object} $target Tab to open video slider of.
	 * @param {int} duration Duration of the slider.
	 */
	function openVideoSlideout( $target, duration ) {
		var $data = $target.find( '.wpseo-tab-video__data' );
		var videoUrl = $data.data( 'url' );
		$data.append( '<iframe width="560" height="315" src="' + videoUrl + '" frameborder="0" allowfullscreen></iframe>' );

		$target.attr( 'aria-hidden', 'false' ).slideDown( duration );
	}

	/**
	 * Close Video Slideout
	 * 
	 * @param duration Duration of the slider.
	 */
	function closeVideoSlideout( duration ) {
		var $target = $( '#wpbody-content' ).find( '.wpseo-tab-video-slideout' );
		$target.attr( 'aria-hidden', 'true' ).slideUp( duration, function() {
			$( '#wpbody-content' ).find( '.wpseo-tab-video__data' ).children().remove();
		} );
	}
})( jQuery );
