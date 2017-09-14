/* global ajaxurl */

( jQuery( function( $ ) {
	let currentPage = $( location ).attr( "pathname" ).split( "/" ).pop();

	// If current page is edit*.php, continue execution.
	let isEditPage = ( currentPage === "edit.php" || currentPage !== "edit-tags.php" );
	if ( ! isEditPage ) {
		return;
	}

	let notificationShown = false;
	let notificationTarget = jQuery( ".wrap" ).children().eq( 0 );

	/**
	 * Use notification counter so we can count how many times the function wpseoShowNotification is called.
	 *
	 * @type {number}
	 */
	let wpseoNotificationCounter = 0;

	/**
	 * Show notification to user when there's a redirect created.
	 *
	 * When the response is empty, up the notification counter with 1, wait 100 ms and call function again.
	 * Stop when the notification counter is bigger than 20.
	 *
	 * @returns {void}
	 */
	function wpseoShowNotification() {
		// We only want to show the notification once.
		if ( notificationShown ) {
			return;
		}

		jQuery.post(
			ajaxurl,
			{
				action: "yoast_get_notifications",
			},
			function( response ) {
				if ( response !== "" ) {
					notificationShown = true;

					jQuery( response ).insertAfter( notificationTarget );
					wpseoNotificationCounter = 0;
				}

				if ( wpseoNotificationCounter < 20 && response === "" ) {
					wpseoNotificationCounter++;
					setTimeout( wpseoShowNotification, 500 );
				}
			}
		);
	}

	/**
	 * Gets the current post or term id.
	 *
	 * Returns an empty string if no editor is currently active.
	 *
	 * @param {Object} editor The editor to get the id from.
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

}( jQuery ) )  );
