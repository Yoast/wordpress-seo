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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCBhamF4dXJsICovXG4vKiBnbG9iYWwgd3BzZW9BZG1pbkdsb2JhbEwxMG4gKi9cbi8qIGpzaGludCAtVzA5NyAqL1xuLyoganNoaW50IHVudXNlZDpmYWxzZSAqL1xuKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0LyoqXG5cdCAqIFVzZWQgdG8gZGlzbWlzcyB0aGUgdGFnbGluZSBub3RpY2UgZm9yIGEgc3BlY2lmaWMgdXNlci5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlXG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0Rpc21pc3NUYWdsaW5lTm90aWNlKCBub25jZSApIHtcblx0XHRqUXVlcnkucG9zdCggYWpheHVybCwge1xuXHRcdFx0XHRhY3Rpb246ICd3cHNlb19kaXNtaXNzX3RhZ2xpbmVfbm90aWNlJyxcblx0XHRcdFx0X3dwbm9uY2U6IG5vbmNlXG5cdFx0XHR9XG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBVc2VkIHRvIHJlbW92ZSB0aGUgYWRtaW4gbm90aWNlcyBmb3Igc2V2ZXJhbCBwdXJwb3NlcywgZGllcyBvbiBleGl0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBoaWRlXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub25jZVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9TZXRJZ25vcmUoIG9wdGlvbiwgaGlkZSwgbm9uY2UgKSB7XG5cdFx0alF1ZXJ5LnBvc3QoIGFqYXh1cmwsIHtcblx0XHRcdFx0YWN0aW9uOiAnd3BzZW9fc2V0X2lnbm9yZScsXG5cdFx0XHRcdG9wdGlvbjogb3B0aW9uLFxuXHRcdFx0XHRfd3Bub25jZTogbm9uY2Vcblx0XHRcdH0sIGZ1bmN0aW9uKCBkYXRhICkge1xuXHRcdFx0XHRpZiAoIGRhdGEgKSB7XG5cdFx0XHRcdFx0alF1ZXJ5KCAnIycgKyBoaWRlICkuaGlkZSgpO1xuXHRcdFx0XHRcdGpRdWVyeSggJyNoaWRkZW5faWdub3JlXycgKyBvcHRpb24gKS52YWwoICdpZ25vcmUnICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1ha2UgdGhlIG5vdGljZXMgZGlzbWlzc2libGUgKGFnYWluKVxuXHQgKi9cblx0ZnVuY3Rpb24gd3BzZW9NYWtlRGlzbWlzc2libGUoKSB7XG5cdFx0alF1ZXJ5KCAnLm5vdGljZS5pcy1kaXNtaXNzaWJsZScgKS5lYWNoKCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkbm90aWNlID0galF1ZXJ5KCB0aGlzICk7XG5cdFx0XHRpZiAoICRub3RpY2UuZmluZCggJy5ub3RpY2UtZGlzbWlzcycgKS5lbXB0eSgpICkge1xuXHRcdFx0XHR2YXIgJGJ1dHRvbiA9IGpRdWVyeSggJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwibm90aWNlLWRpc21pc3NcIj48c3BhbiBjbGFzcz1cInNjcmVlbi1yZWFkZXItdGV4dFwiPkRpc21pc3MgdGhpcyBub3RpY2UuPC9zcGFuPjwvYnV0dG9uPicgKTtcblxuXHRcdFx0XHQkbm90aWNlLmFwcGVuZCggJGJ1dHRvbiApO1xuXG5cdFx0XHRcdCRidXR0b24ub24oICdjbGljay53cC1kaXNtaXNzLW5vdGljZScsIGZ1bmN0aW9uKCBldiApIHtcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdCRub3RpY2UuZmFkZVRvKCAxMDAsIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCB0aGlzICkuc2xpZGVVcCggMTAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0alF1ZXJ5KCB0aGlzICkucmVtb3ZlKCk7XG5cdFx0XHRcdFx0XHR9ICk7XG5cdFx0XHRcdFx0fSApO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdlbmVyYXRlcyBhIGRpc21pc3NhYmxlIGFuY2hvciBidXR0b25cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGRpc21pc3NfbGluayBUaGUgVVJMIHRoYXQgbGVhZHMgdG8gdGhlIGRpc21pc3Npbmcgb2YgdGhlIG5vdGljZS5cblx0ICpcblx0ICogQHJldHVybnMge09iamVjdH0gQW5jaG9yIHRvIGRpc21pc3MuXG5cdCAqL1xuXHRmdW5jdGlvbiB3cHNlb0Rpc21pc3NMaW5rKCBkaXNtaXNzX2xpbmsgKSB7XG5cdFx0cmV0dXJuIGpRdWVyeShcblx0XHRcdCc8YSBocmVmPVwiJyArIGRpc21pc3NfbGluayArICdcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJub3RpY2UtZGlzbWlzc1wiPicgK1xuXHRcdFx0JzxzcGFuIGNsYXNzPVwic2NyZWVuLXJlYWRlci10ZXh0XCI+RGlzbWlzcyB0aGlzIG5vdGljZS48L3NwYW4+JyArXG5cdFx0XHQnPC9hPidcblx0XHQpO1xuXHR9XG5cblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcblx0XHRqUXVlcnkoICcjd3BzZW8tZGlzbWlzcy1hYm91dCA+IC5ub3RpY2UtZGlzbWlzcycgKS5yZXBsYWNlV2l0aCggd3BzZW9EaXNtaXNzTGluayggd3BzZW9BZG1pbkdsb2JhbEwxMG4uZGlzbWlzc19hYm91dF91cmwgKSApO1xuXHRcdGpRdWVyeSggJyN3cHNlby1kaXNtaXNzLXRhZ2xpbmUtbm90aWNlID4gLm5vdGljZS1kaXNtaXNzJyApLnJlcGxhY2VXaXRoKCB3cHNlb0Rpc21pc3NMaW5rKCB3cHNlb0FkbWluR2xvYmFsTDEwbi5kaXNtaXNzX3RhZ2xpbmVfdXJsICkgKTtcblxuXHRcdGpRdWVyeSggJy55b2FzdC1kaXNtaXNzaWJsZSA+IC5ub3RpY2UtZGlzbWlzcycgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHBhcmVudERpdiA9IGpRdWVyeSggdGhpcyApLnBhcmVudCggJy55b2FzdC1kaXNtaXNzaWJsZScgKTtcblxuXHRcdFx0Ly8gRGVwcmVjYXRlZCwgdG9kbzogcmVtb3ZlIHdoZW4gYWxsIG5vdGlmaWVycyBoYXZlIGJlZW4gaW1wbGVtZW50ZWQuXG5cdFx0XHRqUXVlcnkucG9zdChcblx0XHRcdFx0YWpheHVybCxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGFjdGlvbjogJHBhcmVudERpdi5hdHRyKCAnaWQnICkucmVwbGFjZSggLy0vZywgJ18nICksXG5cdFx0XHRcdFx0X3dwbm9uY2U6ICRwYXJlbnREaXYuZGF0YSggJ25vbmNlJyApLFxuXHRcdFx0XHRcdGRhdGE6ICRwYXJlbnREaXYuZGF0YSggJ2pzb24nIClcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0alF1ZXJ5LnBvc3QoXG5cdFx0XHRcdGFqYXh1cmwsXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRhY3Rpb246ICd5b2FzdF9kaXNtaXNzX25vdGlmaWNhdGlvbicsXG5cdFx0XHRcdFx0bm90aWZpY2F0aW9uOiAkcGFyZW50RGl2LmF0dHIoICdpZCcgKSxcblx0XHRcdFx0XHRub25jZTogJHBhcmVudERpdi5kYXRhKCAnbm9uY2UnICksXG5cdFx0XHRcdFx0ZGF0YTogJHBhcmVudERpdi5kYXRhKCAnanNvbicgKVxuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXG5cdFx0XHQkcGFyZW50RGl2LmZhZGVUbyggMTAwICwgMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGpRdWVyeSh0aGlzKS5zbGlkZVVwKCAxMDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGpRdWVyeSh0aGlzKS5yZW1vdmUoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0gKTtcblxuXHRcdGpRdWVyeSggJy55b2FzdC1oZWxwLWJ1dHRvbicgKS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJGJ1dHRvbiA9IGpRdWVyeSggdGhpcyApLFxuXHRcdFx0XHRoZWxwUGFuZWwgPSBqUXVlcnkoICcjJyArICRidXR0b24uYXR0ciggJ2FyaWEtY29udHJvbHMnICkgKSxcblx0XHRcdFx0aXNQYW5lbFZpc2libGUgPSBoZWxwUGFuZWwuaXMoICc6dmlzaWJsZScgKTtcblxuXHRcdFx0alF1ZXJ5KCBoZWxwUGFuZWwgKS5zbGlkZVRvZ2dsZSggMjAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JGJ1dHRvbi5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICEgaXNQYW5lbFZpc2libGUgKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KTtcblx0d2luZG93Lndwc2VvRGlzbWlzc1RhZ2xpbmVOb3RpY2UgPSB3cHNlb0Rpc21pc3NUYWdsaW5lTm90aWNlO1xuXHR3aW5kb3cud3BzZW9TZXRJZ25vcmUgPSB3cHNlb1NldElnbm9yZTtcblx0d2luZG93Lndwc2VvTWFrZURpc21pc3NpYmxlID0gd3BzZW9NYWtlRGlzbWlzc2libGU7XG5cdHdpbmRvdy53cHNlb0Rpc21pc3NMaW5rID0gd3BzZW9EaXNtaXNzTGluaztcbn0oKSk7XG5cbihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciAkID0galF1ZXJ5O1xuXG5cdCQoICcubmF2LXRhYicgKS5jbGljayggZnVuY3Rpb24oKSB7XG5cdFx0Y2xvc2VWaWRlb1NsaWRlb3V0KCk7XG5cdH0gKTtcblxuXHQkKCAnLndwc2VvLXRhYi12aWRlby1jb250YWluZXInICkub24oICdjbGljaycsICcud3BzZW8tdGFiLXZpZGVvLWNvbnRhaW5lcl9faGFuZGxlJywgZnVuY3Rpb24oIGUgKSB7XG5cdFx0dmFyICRjb250YWluZXIgPSAkKCBlLmRlbGVnYXRlVGFyZ2V0ICk7XG5cdFx0dmFyICRzbGlkZW91dCA9ICRjb250YWluZXIuZmluZCggJy53cHNlby10YWItdmlkZW8tc2xpZGVvdXQnICk7XG5cdFx0aWYgKCAkc2xpZGVvdXQuaXMoICc6aGlkZGVuJyApICkge1xuXHRcdFx0b3BlblZpZGVvU2xpZGVvdXQoICRjb250YWluZXIgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjbG9zZVZpZGVvU2xpZGVvdXQoKTtcblx0XHR9XG5cdH0gKTtcblxuXHQvKipcblx0ICogT3BlbiBWaWRlbyBTbGlkZW91dFxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gJGNvbnRhaW5lciBUYWIgdG8gb3BlbiB2aWRlbyBzbGlkZXIgb2YuXG5cdCAqL1xuXHRmdW5jdGlvbiBvcGVuVmlkZW9TbGlkZW91dCggJGNvbnRhaW5lciApIHtcblx0XHQkY29udGFpbmVyLmZpbmQoICcudG9nZ2xlX19hcnJvdycgKS5yZW1vdmVDbGFzcyggJ2Rhc2hpY29ucy1hcnJvdy1kb3duJyApLmFkZENsYXNzKCAnZGFzaGljb25zLWFycm93LXVwJyApO1xuXHRcdCRjb250YWluZXIuZmluZCggJy53cHNlby10YWItdmlkZW8tY29udGFpbmVyX19oYW5kbGUnICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScgKTtcblx0XHQkY29udGFpbmVyLmZpbmQoICcud3BzZW8tdGFiLXZpZGVvLXNsaWRlb3V0JyApLmNzcyggJ2Rpc3BsYXknLCAnZmxleCcgKTtcblxuXHRcdHZhciAkYWN0aXZlVGFiTGluayA9ICRjb250YWluZXIuZmluZCgnLndwc2VvLWhlbHAtY2VudGVyLWl0ZW0uYWN0aXZlID4gYScpO1xuXHRcdGlmICggJGFjdGl2ZVRhYkxpbmsubGVuZ3RoID4gMCApIHtcblx0XHRcdHZhciBhY3RpdmVUYWIgPSAkYWN0aXZlVGFiTGluay5hdHRyKCAnYXJpYS1jb250cm9scycgKTtcblx0XHRcdGFjdGl2YXRlVmlkZW8oICQoICcjJyArIGFjdGl2ZVRhYiApICk7XG5cblx0XHRcdCRjb250YWluZXIub24oICdjbGljaycsICcud3BzZW8taGVscC1jZW50ZXItaXRlbSA+IGEnLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0dmFyICRsaW5rID0gJCggdGhpcyApO1xuXHRcdFx0XHR2YXIgdGFyZ2V0ID0gJGxpbmsuYXR0ciggJ2FyaWEtY29udHJvbHMnICk7XG5cblx0XHRcdFx0JGNvbnRhaW5lci5maW5kKCAnLndwc2VvLWhlbHAtY2VudGVyLWl0ZW0nICkucmVtb3ZlQ2xhc3MoICdhY3RpdmUnICk7XG5cdFx0XHRcdCRsaW5rLnBhcmVudCgpLmFkZENsYXNzKCAnYWN0aXZlJyApO1xuXG5cdFx0XHRcdG9wZW5IZWxwQ2VudGVyVGFiKCAkY29udGFpbmVyLCAkKCAnIycgKyB0YXJnZXQgKSApO1xuXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRhY3RpdmF0ZVZpZGVvKCAkY29udGFpbmVyICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIE9wZW4gdGFiXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkY29udGFpbmVyIENvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSB0YWIuXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkdGFiIFRhYiB0aGF0IGlzIGFjdGl2YXRlZC5cblx0ICovXG5cdGZ1bmN0aW9uIG9wZW5IZWxwQ2VudGVyVGFiKCAkY29udGFpbmVyLCAkdGFiICkge1xuXHRcdCRjb250YWluZXIuZmluZCgnLmNvbnRleHR1YWwtaGVscC10YWJzLXdyYXAgZGl2JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdCR0YWIuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdFx0c3RvcFZpZGVvcygpO1xuXHRcdGFjdGl2YXRlVmlkZW8oICR0YWIgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTdGFydCB2aWRlbyBpZiBmb3VuZCBvbiB0aGUgdGFiXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSAkdGFiIFRhYiB0aGF0IGlzIGFjdGl2YXRlZC5cblx0ICovXG5cdGZ1bmN0aW9uIGFjdGl2YXRlVmlkZW8oICR0YWIgKSB7XG5cdFx0dmFyICRkYXRhID0gJHRhYi5maW5kKCAnLndwc2VvLXRhYi12aWRlb19fZGF0YScgKTtcblx0XHRpZiAoICRkYXRhLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkZGF0YS5hcHBlbmQoICc8aWZyYW1lIHdpZHRoPVwiNTYwXCIgaGVpZ2h0PVwiMzE1XCIgc3JjPVwiJyArICRkYXRhLmRhdGEoICd1cmwnICkgKyAnXCIgZnJhbWVib3JkZXI9XCIwXCIgYWxsb3dmdWxsc2NyZWVuPjwvaWZyYW1lPicgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTdG9wIHBsYXlpbmcgYW55IHZpZGVvLlxuXHQgKi9cblx0ZnVuY3Rpb24gc3RvcFZpZGVvcygpIHtcblx0XHQkKCAnI3dwYm9keS1jb250ZW50JyApLmZpbmQoICcud3BzZW8tdGFiLXZpZGVvX19kYXRhJyApLmNoaWxkcmVuKCkucmVtb3ZlKCk7XG5cdH1cblxuXHQvKipcblx0ICogQ2xvc2UgVmlkZW8gU2xpZGVvdXRcblx0ICovXG5cdGZ1bmN0aW9uIGNsb3NlVmlkZW9TbGlkZW91dCgpIHtcblx0XHR2YXIgJGNvbnRhaW5lciA9ICQoICcjd3Bib2R5LWNvbnRlbnQnICkuZmluZCggJy53cHNlby10YWItdmlkZW8tY29udGFpbmVyJyApO1xuXHRcdCRjb250YWluZXIuZmluZCggJy53cHNlby10YWItdmlkZW8tc2xpZGVvdXQnICkuY3NzKCAnZGlzcGxheScsICcnICk7XG5cblx0XHRzdG9wVmlkZW9zKCk7XG5cblx0XHQkY29udGFpbmVyLmZpbmQoICcudG9nZ2xlX19hcnJvdycgKS5yZW1vdmVDbGFzcyggJ2Rhc2hpY29ucy1hcnJvdy11cCcgKS5hZGRDbGFzcyggJ2Rhc2hpY29ucy1hcnJvdy1kb3duJyApO1xuXHRcdCRjb250YWluZXIuZmluZCggJy53cHNlby10YWItdmlkZW8tY29udGFpbmVyX19oYW5kbGUnICkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnICk7XG5cdH1cbn0pKCk7XG4iXX0=
