/* global ajaxurl */
/* global wpseoAdminGlobalL10n, wpseoConsoleNotifications */
/* jshint -W097 */
/* jshint unused:false */

( function() {
	/**
	 * Displays console notifications.
	 *
	 * Looks at a global variable to display all notifications in there.
	 *
	 * @returns {void}
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
	 *
	 * @returns {void}
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
	 *
	 * @returns {void}
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
	 * Hide popup showing new alerts message.
	 *
	 * @returns {void}
	 */
	function hideAlertPopup() {
		// Remove the namespaced hover event from the menu top level list items.
		$( "#wp-admin-bar-root-default > li" ).off( "hover.yoastalertpopup" );
		// Hide the notification popup by fading it out.
		$( ".yoast-issue-added" ).fadeOut( 200 );
	}

	/**
	 * Show popup with new alerts message.
	 *
	 * @returns {void}
	 */
	function showAlertPopup() {
		// Attach an hover event and show the notification popup by fading it in.
		$( ".yoast-issue-added" )
			.on( "hover", function( evt ) {
				// Avoid the hover event to propagate on the parent elements.
				evt.stopPropagation();
				// Hide the notification popup when hovering on it.
				hideAlertPopup();
			} )
			.fadeIn();

		/*
		 * Attach a namespaced hover event on the menu top level items to hide
		 * the notification popup when hovering them.
		 * Note: this will work just the first time the list items get hovered in the
		 * first 3 seconds after DOM ready because this event is then removed.
		 */
		$( "#wp-admin-bar-root-default > li" ).on( "hover.yoastalertpopup", hideAlertPopup );

		// Hide the notification popup after 3 seconds from DOM ready.
		setTimeout( hideAlertPopup, 3000 );
	}

	/**
	 * Handle dismiss and restore AJAX responses
	 *
	 * @param {Object} $source Object that triggered the request.
	 * @param {Object} response AJAX response.
	 *
	 * @returns {void}
	 */
	function handleDismissRestoreResponse( $source, response ) {
		$( ".yoast-alert-holder" ).off( "click", ".restore" ).off( "click", ".dismiss" );

		if ( typeof response.html === "undefined" ) {
			return;
		}

		if ( response.html ) {
			$source.closest( ".yoast-container" ).html( response.html );
			/* jshint ignore:start */
			/* eslint-disable */
			hookDismissRestoreButtons();
			/* jshint ignore:end */
			/* eslint-enable */
		}

		var $wpseo_menu = $( "#wp-admin-bar-wpseo-menu" );
		var $issue_counter = $wpseo_menu.find( ".yoast-issue-counter" );

		if ( ! $issue_counter.length ) {
			$wpseo_menu.find( "> a:first-child" ).append( '<div class="yoast-issue-counter"/>' );
			$issue_counter = $wpseo_menu.find( ".yoast-issue-counter" );
		}

		$issue_counter.html( response.total );
		if ( response.total === 0 ) {
			$issue_counter.hide();
		} else {
			$issue_counter.show();
		}

		$( "#toplevel_page_wpseo_dashboard .update-plugins" ).removeClass().addClass( "update-plugins count-" + response.total );
		$( "#toplevel_page_wpseo_dashboard .plugin-count" ).html( response.total );
	}

	/**
	 * Hook the restore and dismiss buttons
	 *
	 * @returns {void}
	 */
	function hookDismissRestoreButtons() {
		var $dismissible = $( ".yoast-alert-holder" );

		$dismissible.on( "click", ".dismiss", function() {
			var $this = $( this );
			var $source = $this.closest( ".yoast-alert-holder" );

			var $container = $this.closest( ".yoast-container" );
			$container.append( '<div class="yoast-container-disabled"/>' );

			$this.find( "span" ).removeClass( "dashicons-no-alt" ).addClass( "dashicons-randomize" );

			$.post(
				ajaxurl,
				{
					action: "yoast_dismiss_alert",
					notification: $source.attr( "id" ),
					nonce: $source.data( "nonce" ),
					data: $source.data( "json" ),
				},
				handleDismissRestoreResponse.bind( this, $source ),
				"json"
			);
		} );

		$dismissible.on( "click", ".restore", function() {
			var $this = $( this );
			var $source = $this.closest( ".yoast-alert-holder" );

			var $container = $this.closest( ".yoast-container" );
			$container.append( '<div class="yoast-container-disabled"/>' );

			$this.find( "span" ).removeClass( "dashicons-arrow-up" ).addClass( "dashicons-randomize" );

			$.post(
				ajaxurl,
				{
					action: "yoast_restore_alert",
					notification: $source.attr( "id" ),
					nonce: $source.data( "nonce" ),
					data: $source.data( "json" ),
				},
				handleDismissRestoreResponse.bind( this, $source ),
				"json"
			);
		} );
	}

	/**
	 * Sets the color of the svg for the premium indicator based on the color of the color scheme.
	 *
	 * @returns {void}
	 */
	function setPremiumIndicatorColor() {
		let $premiumIndicator = jQuery( ".wpseo-js-premium-indicator" );
		let $svg = $premiumIndicator.find( "svg" );

		// Don't change the color to stand out when premium is actually enabled.
		if ( $premiumIndicator.hasClass( "wpseo-premium-indicator--no" ) ) {
			let $svgPath = $svg.find( "path" );

			let backgroundColor = $premiumIndicator.css( "backgroundColor" );

			$svgPath.css( "fill", backgroundColor );
		}

		$svg.css( "display", "block" );
		$premiumIndicator.css( {
			backgroundColor: "transparent",
			width: "20px",
			height: "20px",
		} );
	}

	$( document ).ready( function() {
		showAlertPopup();
		hookDismissRestoreButtons();
		setPremiumIndicatorColor();
	} );
}() );

( function() {
	"use strict";

	var $ = jQuery;

	/**
	 * Start video if found on the tab
	 *
	 * @param {object} $tab Tab that is activated.
	 *
	 * @returns {void}
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
	 *
	 * @returns {void}
	 */
	function stopVideos() {
		$( "#wpbody-content" ).find( ".wpseo-tab-video__data" ).children().remove();
	}

	/**
	 * Open tab
	 *
	 * @param {object} $container Container that contains the tab.
	 * @param {object} $tab Tab that is activated.
	 *
	 * @returns {void}
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
	 *
	 * @returns {void}
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

		$( "#sidebar-container" ).hide();
	}

	/**
	 * Close Video Slideout
	 *
	 * @returns {void}
	 */
	function closeVideoSlideout() {
		var $container = $( "#wpbody-content" ).find( ".wpseo-tab-video-container" );
		$container.find( ".wpseo-tab-video-slideout" ).css( "display", "" );

		stopVideos();

		$container.find( ".toggle__arrow" ).removeClass( "dashicons-arrow-up" ).addClass( "dashicons-arrow-down" );
		$container.find( ".wpseo-tab-video-container__handle" ).attr( "aria-expanded", "false" );

		$( "#wpcontent" ).removeClass( "yoast-help-center-open" );
		$( "#sidebar-container" ).show();
	}

	$( ".nav-tab" ).click( function() {
		closeVideoSlideout();
	} );

	$( ".wpseo-tab-video-container" ).on( "click", ".wpseo-tab-video-container__handle", function( e ) {
		var $container = $( e.delegateTarget );
		var $slideout = $container.find( ".wpseo-tab-video-slideout" );
		if ( $slideout.is( ":hidden" ) ) {
			openVideoSlideout( $container );
		} else {
			closeVideoSlideout();
		}
	} );
}() );
