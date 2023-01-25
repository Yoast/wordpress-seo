/* global ajaxurl */

( jQuery( function( $ ) {
	const currentScreen      = $( location ).attr( "pathname" ).split( "/" ).pop();
	const slugField          = currentScreen === "edit-tags.php" ? "slug" : "post_name";
	const notificationTarget = $( ".wrap" ).children().eq( 0 );

	/**
	 * Use notification counter so we can count how many times the function wpseoShowNotification is called.
	 *
	 * @type {number}
	 */
	let wpseoNotificationCounter = 0;

	const addedNotifications = [];

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
		$.post(
			ajaxurl,
			{
				action: "yoast_get_notifications",
				version: 2,
			},
			function( response ) {
				if ( response !== "" ) {
					wpseoNotificationCounter = 0;

					const notifications = JSON.parse( response );
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
		return $( "#inline_" + currentPost ).find( "." + slugField ).html();
	}

	/**
	 * Checks whether or not the slug has changed.
	 *
	 * @returns {boolean} Whether or not the slug has changed.
	 */
	function wpseoSlugChanged() {
		const editor      = $( "tr.inline-editor" );
		const currentPost = wpseoGetItemId( editor );
		const currentSlug = wpseoGetCurrentSlug( currentPost );
		const newSlug     = editor.find( "input[name=" + slugField + "]" ).val();

		return currentSlug !== newSlug;
	}

	if ( [ "edit.php", "edit-tags.php" ].includes( currentScreen ) ) {
		$( "#inline-edit input" ).on( "keydown", function( ev ) {
			// 13 refers to the enter key.
			if ( ev.which === 13 && wpseoSlugChanged() ) {
				wpseoShowNotification();
			}
		} );

		$( ".button-primary" ).on( "click", function( ev ) {
			if ( $( ev.target ).attr( "id" ) !== "save-order" && wpseoSlugChanged() ) {
				wpseoShowNotification();
			}
		} );
	}

	if ( currentScreen === "edit-tags.php" ) {
		$( document ).on( "ajaxComplete", function( e, xhr, settings ) {
			if ( settings.data.indexOf( "action=delete-tag" ) > -1 ) {
				wpseoShowNotification();
			}
		} );
	}
}( jQuery ) )  );
