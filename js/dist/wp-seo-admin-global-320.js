(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

(function() {
	'use strict';

	var $ = jQuery;

	$( '.nav-tab' ).click( function() {
		closeVideoSlideout();
	} );

	$( '.wpseo-tab-video-container' ).on( 'click', '.wpseo-tab-video-container__handle', function( e ) {
		var $container = $( e.delegateTarget );
		var $slideout = $container.find( '.wpseo-tab-video-slideout' );
		if ( $slideout.is( ':hidden' ) ) {
			openVideoSlideout( $container );
		}
		else {
			closeVideoSlideout();
		}
	} );

	/**
	 * Open Video Slideout
	 *
	 * @param {object} $container Tab to open video slider of.
	 */
	function openVideoSlideout( $container ) {
		$container.find( '.toggle__arrow' ).removeClass( 'dashicons-arrow-down' ).addClass( 'dashicons-arrow-up' );
		$container.find( '.wpseo-tab-video-container__handle' ).attr( 'aria-expanded', 'true' );
		$container.find( '.wpseo-tab-video-slideout' ).css( 'display', 'flex' );

		var $activeTabLink = $container.find('.wpseo-help-center-item.active > a');
		if ( $activeTabLink.length > 0 ) {
			var activeTab = $activeTabLink.attr( 'aria-controls' );
			activateVideo( $( '#' + activeTab ) );

			$container.on( 'click', '.wpseo-help-center-item > a', function( e ) {
				var $link = $( this );
				var target = $link.attr( 'aria-controls' );

				$container.find( '.wpseo-help-center-item' ).removeClass( 'active' );
				$link.parent().addClass( 'active' );

				openHelpCenterTab( $container, $( '#' + target ) );

				e.preventDefault();
			} );
		}
		else {
			activateVideo( $container );
		}
	}

	/**
	 * Open tab
	 *
	 * @param {object} $container Container that contains the tab.
	 * @param {object} $tab Tab that is activated.
	 */
	function openHelpCenterTab( $container, $tab ) {
		$container.find('.contextual-help-tabs-wrap div').removeClass('active');
		$tab.addClass('active');

		stopVideos();
		activateVideo( $tab );
	}

	/**
	 * Start video if found on the tab
	 *
	 * @param {object} $tab Tab that is activated.
	 */
	function activateVideo( $tab ) {
		var $data = $tab.find( '.wpseo-tab-video__data' );
		if ( $data.length === 0 ) {
			return;
		}

		$data.append( '<iframe width="560" height="315" src="' + $data.data( 'url' ) + '" frameborder="0" allowfullscreen></iframe>' );
	}

	/**
	 * Stop playing any video.
	 */
	function stopVideos() {
		$( '#wpbody-content' ).find( '.wpseo-tab-video__data' ).children().remove();
	}

	/**
	 * Close Video Slideout
	 */
	function closeVideoSlideout() {
		var $container = $( '#wpbody-content' ).find( '.wpseo-tab-video-container' );
		$container.find( '.wpseo-tab-video-slideout' ).css( 'display', '' );

		stopVideos();

		$container.find( '.toggle__arrow' ).removeClass( 'dashicons-arrow-up' ).addClass( 'dashicons-arrow-down' );
		$container.find( '.wpseo-tab-video-container__handle' ).attr( 'aria-expanded', 'false' );
	}
})();

},{}]},{},[1]);
