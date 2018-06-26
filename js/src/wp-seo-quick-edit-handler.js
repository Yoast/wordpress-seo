/* global ajaxurl */

( jQuery( function( $ ) {
	let currentPage = $( location ).attr( "pathname" ).split( "/" ).pop();

	// If current page is edit*.php, continue execution.
	let isEditPage = ( currentPage === "edit.php" || currentPage !== "edit-tags.php" );
	if ( ! isEditPage ) {
		return;
	}

	let notificationTarget = jQuery( ".wrap" ).children().eq( 0 );

	/**
	 * Use notification counter so we can count how many times the function wpseoShowNotification is called.
	 *
	 * @type {number}
	 */
	let wpseoNotificationCounter = 0;

	let addedNotifications = [];

	/**
	 * Adds the given notification to the DOM if it doesn't already exist.
	 *
	 * @param {string} notification The notification to add.
	 *
	 * @returns {void}
	 */
	function addNotificationToDom( notification ) {
		if ( ! addedNotifications.includes( notification ) ) {
			addedNotifications.push( notification );

			$( notification ).insertAfter( notificationTarget );
		}
	}

	/**
	 * Shows notification to user when a redirect is created.
	 *
	 * When the response is empty, up the notification counter with 1, wait 500 ms and call the function again.
	 * Stops when the notification counter is more than 20.
	 *
	 * @returns {void}
	 */
	function wpseoShowNotification() {
		jQuery.post(
			ajaxurl,
			{
				action: "yoast_get_notifications",
				version: 2,
			},
			function( response ) {
				if ( response !== "" ) {
					wpseoNotificationCounter = 0;

					let notifications = JSON.parse( response );
					notifications.map( addNotificationToDom );
				}

				if ( wpseoNotificationCounter < 20 && response === "" ) {
					wpseoNotificationCounter++;
					setTimeout( wpseoShowNotification, 500 );
				}
			}
		);
	}

	/**
	 * Gets the current post or term ID.
	 *
	 * Returns an empty string if no editor is currently active.
	 *
	 * @param {Object} editor The editor to get the ID from.
	 *
	 * @returns {string} The ID of the current post or term.
	 */
	function wpseoGetItemId( editor ) {
		if ( editor.length === 0 || editor === "" ) {
			return "";
		}

		return editor.attr( "id" ).replace( "edit-", "" );
	}

	/**
	 * Gets the current slug of a post based on the current page and post or term being edited.
	 *
	 * @param {string} currentPost The current element.
	 *
	 * @returns {string} The slug of the current post or term.
	 */
	function wpseoGetCurrentSlug( currentPost ) {
		if ( currentPage === "edit.php" ) {
			return jQuery( "#inline_" + currentPost ).find( ".post_name" ).html();
		}

		if ( currentPage === "edit-tags.php" ) {
			return jQuery( "#inline_" + currentPost ).find( ".slug" ).html();
		}

		return "";
	}

	/**
	 * Checks whether or not the slug has changed.
	 *
	 * @returns {boolean} Whether or not the slug has changed.
	 */
	function wpseoSlugChanged() {
		let editor = jQuery( "tr.inline-editor" );
		let currentPost = wpseoGetItemId( editor );
		let currentSlug = wpseoGetCurrentSlug( currentPost );
		let newSlug = editor.find( "input[name=post_name]" ).val();

		return currentSlug !== newSlug;
	}

	jQuery( "#inline-edit input" ).on( "keydown", function( ev ) {
		// 13 refers to the enter key.
		if ( ev.which === 13 && wpseoSlugChanged() ) {
			wpseoShowNotification();
		}
	} );

	jQuery( ".button-primary" ).click( function( ev ) {
		if ( jQuery( ev.target ).attr( "id" ) !== "save-order" && wpseoSlugChanged() ) {
			wpseoShowNotification();
		}
	} );

	/**
	 * @todo This won't work, make it work
	 */
	jQuery( document ).on( "ajaxComplete", function( e, xhr, settings ) {
		if ( settings.data.indexOf( "action=delete-tag" ) > -1 ) {
			wpseoShowNotification();
		}
	} );
}( jQuery ) )  );
