/* global ajaxurl */
/* global wpseoAdminGlobalL10n, wpseoConsoleNotifications */
/* jshint -W097 */
/* jshint unused:false */

( function( $ ) {
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
	 * Used to remove the admin notices for several purposes, dies on exit.
	 *
	 * @param {string} option The option to ignore.
	 * @param {string} hide   The target element to hide.
	 * @param {string} nonce  Nonce for verification.
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
	 * Generates a dismissable anchor button.
	 *
	 * @param {string} dismissLink The URL that leads to the dismissing of the notice.
	 *
	 * @returns {Object} Anchor to dismiss.
	 */
	function wpseoDismissLink( dismissLink ) {
		return jQuery(
			'<a href="' + dismissLink + '" type="button" class="notice-dismiss">' +
			'<span class="screen-reader-text">Dismiss this notice.</span>' +
			"</a>"
		);
	}

	jQuery( document ).ready( function() {
		jQuery( ".yoast-dismissible" ).on( "click", ".yoast-notice-dismiss", function() {
			var $parentDiv = jQuery( this ).parent();

			// Deprecated: remove when all notifiers have been implemented.
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

	window.wpseoSetIgnore = wpseoSetIgnore;
	window.wpseoDismissLink = wpseoDismissLink;

	/**
	 * Hides popup showing new alerts message.
	 *
	 * @returns {void}
	 */
	function hideAlertPopup() {
		// Remove the namespaced hover event from the menu top level list items.
		$( "#wp-admin-bar-root-default > li" ).off( "mouseenter.yoastalertpopup mouseleave.yoastalertpopup" );
		// Hide the notification popup by fading it out.
		$( ".yoast-issue-added" ).fadeOut( 200 );
	}

	/**
	 * Shows popup with new alerts message.
	 *
	 * @returns {void}
	 */
	function showAlertPopup() {
		// Attach an hover event and show the notification popup by fading it in.
		$( ".yoast-issue-added" )
			.on( "mouseenter mouseleave", function( evt ) {
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
		$( "#wp-admin-bar-root-default > li" ).on( "mouseenter.yoastalertpopup mouseleave.yoastalertpopup", hideAlertPopup );

		// Hide the notification popup after 3 seconds from DOM ready.
		setTimeout( hideAlertPopup, 3000 );
	}

	/**
	 * Handles dismiss and restore AJAX responses.
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

		var $wpseoMenu = $( "#wp-admin-bar-wpseo-menu" );
		var $issueCounter = $wpseoMenu.find( ".yoast-issue-counter" );

		if ( ! $issueCounter.length ) {
			$wpseoMenu.find( "> a:first-child" ).append( '<div class="yoast-issue-counter"/>' );
			$issueCounter = $wpseoMenu.find( ".yoast-issue-counter" );
		}

		$issueCounter.html( response.total );
		if ( response.total === 0 ) {
			$issueCounter.hide();
		} else {
			$issueCounter.show();
		}

		$( "#toplevel_page_wpseo_dashboard .update-plugins" ).removeClass().addClass( "update-plugins count-" + response.total );
		$( "#toplevel_page_wpseo_dashboard .plugin-count" ).html( response.total );
	}

	/**
	 * Hooks the restore and dismiss buttons.
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
		const $premiumIndicator = jQuery( ".wpseo-js-premium-indicator" );
		const $svg = $premiumIndicator.find( "svg" );

		// Don't change the color to stand out when premium is actually enabled.
		if ( $premiumIndicator.hasClass( "wpseo-premium-indicator--no" ) ) {
			const $svgPath = $svg.find( "path" );

			const backgroundColor = $premiumIndicator.css( "backgroundColor" );

			$svgPath.css( "fill", backgroundColor );
		}

		$svg.css( "display", "block" );
		$premiumIndicator.css( {
			backgroundColor: "transparent",
			width: "20px",
			height: "20px",
		} );
	}

	/**
	 * Checks a scrollable table width.
	 *
	 * Compares the scrollable table width against the size of its container and
	 * adds or removes CSS classes accordingly.
	 *
	 * @param {object} table A jQuery object with one scrollable table.
	 * @returns {void}
	 */
	function checkScrollableTableSize( table ) {
		// Bail if the table is hidden.
		if ( table.is( ":hidden" ) ) {
			return;
		}

		// When the table is wider than its parent, make it scrollable.
		if ( table.outerWidth() > table.parent().outerWidth() ) {
			table.data( "scrollHint" ).addClass( "yoast-has-scroll" );
			table.data( "scrollContainer" ).addClass( "yoast-has-scroll" );
		} else {
			table.data( "scrollHint" ).removeClass( "yoast-has-scroll" );
			table.data( "scrollContainer" ).removeClass( "yoast-has-scroll" );
		}
	}

	/**
	 * Checks the width of multiple scrollable tables.
	 *
	 * @param {object} tables A jQuery collection of scrollable tables.
	 * @returns {void}
	 */
	function checkMultipleScrollableTablesSize( tables ) {
		tables.each( function() {
			checkScrollableTableSize( $( this ) );
		} );
	}

	/**
	 * Makes tables scrollable.
	 *
	 * Usage: see related stylesheet.
	 *
	 * @returns {void}
	 */
	function createScrollableTables() {
		// Get the tables elected to be scrollable and store them for later reuse.
		window.wpseoScrollableTables = $( ".yoast-table-scrollable" );

		// Bail if there are no tables.
		if ( ! window.wpseoScrollableTables.length ) {
			return;
		}

		// Loop over the collection of tables and build some HTML around them.
		window.wpseoScrollableTables.each( function() {
			var table = $( this );

			// Continue if the table already has the necessary markup.
			if ( table.data( "scrollContainer" ) ) {
				// This is a jQuery equivalent of `continue` within an `each()` loop.
				return;
			}

			/*
			 * Create an element with a hint message and insert it in the DOM
			 * before each table.
			 */
			var scrollHint = $( "<div />", {
				"class": "yoast-table-scrollable__hintwrapper",
				html: "<span class='yoast-table-scrollable__hint' aria-hidden='true' />",
			} ).insertBefore( table );

			/*
			 * Create a wrapper element with an inner div necessary for
			 * styling and insert them in the DOM before each table.
			 */
			var scrollContainer = $( "<div />", {
				"class": "yoast-table-scrollable__container",
				html: "<div class='yoast-table-scrollable__inner' />",
			} ).insertBefore( table );

			// Set the hint message text.
			scrollHint.find( ".yoast-table-scrollable__hint" ).text( wpseoAdminGlobalL10n.scrollable_table_hint );

			// For each table, store a reference to its wrapper element.
			table.data( "scrollContainer", scrollContainer );

			// For each table, store a reference to its hint message.
			table.data( "scrollHint", scrollHint );

			// Move the scrollable table inside the wrapper.
			table.appendTo( scrollContainer.find( ".yoast-table-scrollable__inner" ) );

			// Check each table's width.
			checkScrollableTableSize( table );
		} );
	}

	/*
	 * When the viewport size changes, check again the scrollable tables width.
	 * About the events: technically `wp-window-resized` is triggered on the
	 * body but since it bubbles, it happens also on the window.
	 * Also, instead of trying to detect events support on devices and browsers,
	 * we just run the check on both `wp-window-resized` and `orientationchange`.
	 */
	$( window ).on( "wp-window-resized orientationchange", function() {
		/*
		 * Bail if there are no tables. Check also for the jQuery object itself,
		 * see https://github.com/Yoast/wordpress-seo/issues/8214
		 */
		if ( ! window.wpseoScrollableTables || ! window.wpseoScrollableTables.length ) {
			return;
		}

		checkMultipleScrollableTablesSize( window.wpseoScrollableTables );
	} );

	/*
	 * Generates the scrollable tables markuo when the react tabs are mounted,
	 * when a table is in the active tab. Or, generates the markup when a react
	 * tabs is selected. Uses a timeout to wait for the HTML injection of the table.
	 */
	$( window ).on( {
		"Yoast:YoastTabsMounted": function() {
			setTimeout( function() {
				createScrollableTables();
			}, 100 );
		},
		"Yoast:YoastTabsSelected": function() {
			setTimeout( function() {
				createScrollableTables();
			}, 100 );
		},
	} );

	$( document ).ready( function() {
		showAlertPopup();
		hookDismissRestoreButtons();
		setPremiumIndicatorColor();
		createScrollableTables();
	} );
}( jQuery ) );
