/* global ajaxurl */
/* global wpseoAdminGlobalL10n, wpseoConsoleNotifications */
/* jshint -W097 */
/* jshint unused:false */

( function() {
	"use strict";

	/**
	 * Displays console notifications.
	 *
	 * Looks at a global variable to display all notifications in there.
	 */
	function displayConsoleNotifications() {
		if ( typeof window.wpseoConsoleNotifications === "undefined" || typeof console === "undefined" ) {
			return;
		}

		/* jshint ignore:start */
		for ( var index = 0; index < wpseoConsoleNotifications.length; index++ ) {
			console.warn( wpseoConsoleNotifications[ index ] );
		}
		/* jshint ignore:end */
	}

	jQuery( document ).ready( displayConsoleNotifications );

	/**
	 * Used to dismiss the tagline notice for a specific user.
	 *
	 * @param {string} nonce
	 */
	function wpseoDismissTaglineNotice( nonce ) {
		jQuery.post( ajaxurl, {
			action: "wpseo_dismiss_tagline_notice",
			_wpnonce: nonce,
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
			action: "wpseo_set_ignore",
			option: option,
			_wpnonce: nonce,
		}, function( data ) {
			if ( data ) {
				jQuery( "#" + hide ).hide();
				jQuery( "#hidden_ignore_" + option ).val( "ignore" );
			}
		}
		);
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
			"</a>"
		);
	}

	jQuery( document ).ready( function() {
		jQuery( ".yoast-dismissible" ).on( "click", ".yoast-notice-dismiss", function() {
			var $parentDiv = jQuery( this ).parent();

			// Deprecated, todo: remove when all notifiers have been implemented.
			jQuery.post(
				ajaxurl,
				{
					action: $parentDiv.attr( "id" ).replace( /-/g, "_" ),
					_wpnonce: $parentDiv.data( "nonce" ),
					data: $parentDiv.data( "json" ),
				}
			);

			jQuery.post(
				ajaxurl,
				{
					action: "yoast_dismiss_notification",
					notification: $parentDiv.attr( "id" ),
					nonce: $parentDiv.data( "nonce" ),
					data: $parentDiv.data( "json" ),
				}
			);

			$parentDiv.fadeTo( 100, 0, function() {
				$parentDiv.slideUp( 100, function() {
					$parentDiv.remove();
				} );
			} );

			return false;
		} );

		jQuery( ".yoast-help-button" ).on( "click", function() {
			var $button = jQuery( this ),
				helpPanel = jQuery( "#" + $button.attr( "aria-controls" ) ),
				isPanelVisible = helpPanel.is( ":visible" );

			jQuery( helpPanel ).slideToggle( 200, function() {
				$button.attr( "aria-expanded", ! isPanelVisible );
			} );
		} );
	} );
	window.wpseoDismissTaglineNotice = wpseoDismissTaglineNotice;
	window.wpseoSetIgnore = wpseoSetIgnore;
	window.wpseoDismissLink = wpseoDismissLink;
}() );

( function() {
	"use strict";

	var $ = jQuery;

	/**
	 * Hide popup showing new alerts are present
	 */
	function hideAlertPopup() {
		$( "#wp-admin-bar-root-default > li" ).off( "hover", hideAlertPopup );
		$( ".yoast-issue-added" ).fadeOut( 200 );
	}

	/**
	 * Show popup with new alerts message
	 */
	function showAlertPopup() {
		$( ".yoast-issue-added" ).hover( hideAlertPopup ).fadeIn();
		$( "#wp-admin-bar-root-default > li" ).on( "hover", hideAlertPopup );
		setTimeout( hideAlertPopup, 3000 );
	}


	/**
	 * Updates the notification counter based on the amount of notifications passed.
	 *
	 * @param {number} total The amount of notifications that are currently available.
	 */
	function updateNotificationCounter( total ) {
		var $wpseo_menu = $( "#wp-admin-bar-wpseo-menu" );
		var $issue_counter = $wpseo_menu.find( ".yoast-issue-counter" );

		if ( ! $issue_counter.length ) {
			$wpseo_menu.find( "> a:first-child" ).append( '<div class="yoast-issue-counter"/>' );
			$issue_counter = $wpseo_menu.find( ".yoast-issue-counter" );
		}

		$issue_counter.html( total );

		if ( total === 0 ) {
			$issue_counter.hide();
		}

		if ( total !== 0 ) {
			$issue_counter.show();
		}

		$( "#toplevel_page_wpseo_dashboard .update-plugins" ).removeClass().addClass( "update-plugins count-" + total );
	}

	/**
	 * Handle dismiss and restore AJAX responses
	 *
	 * @param {Object} $source Object that triggered the request.
	 * @param {Object} response AJAX response.
	 */
	function handleDismissRestoreResponse( $source, response ) {
		$( ".yoast-alert-holder" ).off( "click", ".restore" ).off( "click", ".dismiss" );

		if ( typeof response.html === "undefined" ) {
			return;
		}

		if ( typeof response.total === "undefined" ) {
			response.total = 0;
		}

		if ( response.html ) {
			$source.html( response.html );
			/* jshint ignore:start */
			/* eslint-disable */
			hookDismissRestoreButtons();
			/* jshint ignore:end */
			/* eslint-enable */
		}

		updateNotificationCounter( response.total );
	}

	function sendRequest( action, notificationId, nonce, data, responseTarget ) {
		$.post(
			ajaxurl,
			{
				action: action,
				notification: notificationId,
				nonce: nonce,
				data: data,
			},
			handleDismissRestoreResponse.bind( this, responseTarget ),
			"json"
		);
	}

	function restore( source, responseTarget ) {
		sendRequest( "yoast_restore_alert", source.attr( "id" ), source.data( "nonce" ), source.data( "json" ), responseTarget );
	}

	function dismiss( source, responseTarget ) {
		sendRequest( "yoast_dismiss_alert", source.attr( "id" ), source.data( "nonce" ), source.data( "json" ), responseTarget );
	}

	function disableContainer( container ) {
		container.append( '<div class="yoast-container-disabled"/>' );
	}

	/**
	 * Hook the restore and dismiss buttons
	 */
	function hookDismissRestoreButtons() {
		var $dismissible = $( ".yoast-alert-holder" );

		$dismissible.on( "click", ".restore, .dismiss", function() {
			var $this = $( this );
			var holder = $this.closest( ".yoast-alert-holder" );
			var container = holder.closest( ".yoast-container" );

			disableContainer( container );

			if ( $this.hasClass( "restore" ) ) {
				$this.find( "span" ).removeClass( "dashicons-arrow-up" ).addClass( "dashicons-randomize" );
				restore( holder, container );
			}

			if ( $this.hasClass( "dismiss" ) ) {
				$this.find( "span" ).removeClass( "dashicons-no-alt" ).addClass( "dashicons-randomize" );
				dismiss( holder, container );
			}
		} );
	}

	function extractHolderData( holders ) {
		var data = [];

		holders.each( function() {
			var $this = $( this );

			data.push( {
				id: $this.attr( "id" ),
				nonce: $this.data( "nonce" ),
				data: $this.data( "json" ),
				target: $this,
			} );
		} );

		return data;
	}

	/**
	 *
	 */
	function hookDismissAllButton() {
		$( document ).on( "click", ".yoast-dismiss-all", function( ev ) {
			ev.preventDefault();

			var alerts = extractHolderData( $( ".yoast-alert-holder" ) );

			disableContainer( $( ".yoast-container" ) );

			$.post(
				ajaxurl,
				{
					action: "yoast_dismiss_alerts",
					data: JSON.stringify( alerts )
				},
				function( data ) {
					$.each( $( data.html )[0], function( key, item ) {
						handleDismissRestoreResponse( $( item.container ), { html: item.html, total: 0 } );
					});
				},
				"json"
			);
		} );
	}

	$( document ).ready( function() {
		showAlertPopup();
		hookDismissAllButton();
		hookDismissRestoreButtons();
	} );
}() );

( function() {
	"use strict";

	var $ = jQuery;

	/**
	 * Start video if found on the tab
	 *
	 * @param {object} $tab Tab that is activated.
	 */
	function activateVideo( $tab ) {
		var $data = $tab.find( ".wpseo-tab-video__data" );
		if ( $data.length === 0 ) {
			return;
		}

		$data.append( '<iframe width="560" height="315" src="' + $data.data( "url" ) + '" title="' + wpseoAdminGlobalL10n.help_video_iframe_title + '" frameborder="0" allowfullscreen></iframe>' );
	}

	/**
	 * Stop playing any video.
	 */
	function stopVideos() {
		$( "#wpbody-content" ).find( ".wpseo-tab-video__data" ).children().remove();
	}

	/**
	 * Open tab
	 *
	 * @param {object} $container Container that contains the tab.
	 * @param {object} $tab Tab that is activated.
	 */
	function openHelpCenterTab( $container, $tab ) {
		$container.find( ".contextual-help-tabs-wrap div" ).removeClass( "active" );
		$tab.addClass( "active" );

		stopVideos();
		activateVideo( $tab );
	}

	/**
	 * Open Video Slideout
	 *
	 * @param {object} $container Tab to open video slider of.
	 */
	function openVideoSlideout( $container ) {
		$container.find( ".toggle__arrow" ).removeClass( "dashicons-arrow-down" ).addClass( "dashicons-arrow-up" );
		$container.find( ".wpseo-tab-video-container__handle" ).attr( "aria-expanded", "true" );
		$container.find( ".wpseo-tab-video-slideout" ).css( "display", "flex" );

		var $activeTabLink = $container.find( ".wpseo-help-center-item.active > a" );

		$( "#wpcontent" ).addClass( "yoast-help-center-open" );

		if ( $activeTabLink.length > 0 ) {
			var activeTab = $activeTabLink.attr( "aria-controls" );
			activateVideo( $( "#" + activeTab ) );

			$container.on( "click", ".wpseo-help-center-item > a", function( e ) {
				var $link = $( this );
				var target = $link.attr( "aria-controls" );

				$container.find( ".wpseo-help-center-item" ).removeClass( "active" );
				$link.parent().addClass( "active" );

				openHelpCenterTab( $container, $( "#" + target ) );

				e.preventDefault();
			} );
		}
		else {
			activateVideo( $container );
		}
	}

	/**
	 * Close Video Slideout
	 */
	function closeVideoSlideout() {
		var $container = $( "#wpbody-content" ).find( ".wpseo-tab-video-container" );
		$container.find( ".wpseo-tab-video-slideout" ).css( "display", "" );

		stopVideos();

		$container.find( ".toggle__arrow" ).removeClass( "dashicons-arrow-up" ).addClass( "dashicons-arrow-down" );
		$container.find( ".wpseo-tab-video-container__handle" ).attr( "aria-expanded", "false" );

		$( "#wpcontent" ).removeClass( "yoast-help-center-open" );
	}

	$( ".nav-tab" ).click( function() {
		closeVideoSlideout();
	} );

	$( ".wpseo-tab-video-container" ).on( "click", ".wpseo-tab-video-container__handle", function( e ) {
		var $container = $( e.delegateTarget );
		var $slideout = $container.find( ".wpseo-tab-video-slideout" );
		if ( $slideout.is( ":hidden" ) ) {
			openVideoSlideout( $container );
		}
		else {
			closeVideoSlideout();
		}
	} );
}() );
