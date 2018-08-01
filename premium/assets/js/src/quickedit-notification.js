/* global ajaxurl */
/* jshint -W097 */

var redirectFunctions = require( "./redirects/functions" );

/**
 * Use notification counter so we can count how many times the function wpseoShowNotification is called.
 *
 * @type {number}
 */
var wpseoNotificationCounter = 0;

/**
 * Show notification to user when there's a redirect created. When the response is empty, up the notification counter
 * with 1, wait 100 ms and call function again.
 * Stop when the notification counter is bigger than 20.
 *
 * @returns {void}
 */
function wpseoShowNotification() {
	jQuery.post(
		ajaxurl,
		{ action: "yoast_get_notifications" },
		function( response ) {
			if ( response !== "" ) {
				var insertAfterElement = jQuery( ".wrap" ).children().eq( 0 );
				jQuery( response ).insertAfter( insertAfterElement );
				wpseoNotificationCounter = 0;
			}

			if ( wpseoNotificationCounter < 20 && response === "" ) {
				wpseoNotificationCounter++;
				setTimeout( wpseoShowNotification, 500 );
			}
		}
	);
}

window.wpseoShowNotification = wpseoShowNotification;

/**
 * Gets the current page based on the current URL.
 *
 * @returns {string} The current page.
 */
function wpseoGetCurrentPage() {
	return jQuery( location ).attr( "pathname" ).split( "/" ).pop();
}

window.wpseoGetCurrentPage = wpseoGetCurrentPage;

/**
 * Gets the name of the field to get the slug from, based on the current URL.
 *
 * For posts, this is 'post_name', for terms it is 'slug'.
 *
 * @returns {string} The current slug field name.
 */
function wpseoGetSlugField( currentPage ) {
	currentPage = currentPage || wpseoGetCurrentPage();

	if ( currentPage === "edit-tags.php" ) {
		return "slug";
	}

	return "post_name";
}

/**
 * Gets the current slug of a post based on the current page and post or term being edited.
 *
 * @returns {string} The slug of the current post or term.
 */
function wpseoGetCurrentSlug() {
	var currentPost = wpseoGetItemId();
	var slugField   = wpseoGetSlugField();

	return jQuery( "#inline_" + currentPost ).find( "." + slugField ).html();
}

window.wpseoGetCurrentSlug = wpseoGetCurrentSlug;

/**
 * Checks whether or not the slug has changed.
 *
 * @returns {boolean} Whether or not the slug has changed.
 */
function wpseoSlugChanged() {
	var editor      = wpseoGetActiveEditor();
	var slugField   = wpseoGetSlugField();
	var currentSlug = wpseoGetCurrentSlug();
	var newSlug     =  editor.find( "input[name=" + slugField + "]" ).val();

	return currentSlug !== newSlug;
}

window.wpseoSlugChanged = wpseoSlugChanged;

/**
 * Gets the currently active editor used in quick edit.
 *
 * @returns {Object} The editor that is currently active.
 */
function wpseoGetActiveEditor() {
	return jQuery( "tr.inline-editor" );
}

window.wpseoGetActiveEditor = wpseoGetActiveEditor;

/**
 * Gets the current post or term id.
 * Returns an empty string if no editor is currently active.
 *
 * @returns {string} The ID of the current post or term.
 */
function wpseoGetItemId() {
	var editor = wpseoGetActiveEditor();

	if ( editor.length === 0 || editor === "" ) {
		return "";
	}

	return editor.attr( "id" ).replace( "edit-", "" );
}

window.wpseoGetItemId = wpseoGetItemId;

/**
 * Handles the key-based events in the quick edit editor.
 *
 * @param {Event} ev The event currently being executed.
 *
 * @returns {void}
 */
function wpseoHandleKeyEvents( ev ) {
	// 13 refers to the enter key.
	if ( ev.which === 13 && wpseoSlugChanged() ) {
		wpseoShowNotification();
	}
}

window.wpseoHandleKeyEvents = wpseoHandleKeyEvents;

/**
 * Handles the button-based events in the quick edit editor.
 *
 * @param {Event} ev The event currently being executed.
 *
 * @returns {void}
 */
function wpseoHandleButtonEvents( ev ) {
	if ( jQuery( ev.target ).attr( "id" ) !== "save-order" && wpseoSlugChanged() ) {
		wpseoShowNotification();
	}
}

window.wpseoHandleButtonEvents = wpseoHandleButtonEvents;

window.wpseoUndoRedirect = redirectFunctions.wpseoUndoRedirect;
window.wpseoCreateRedirect = redirectFunctions.wpseoCreateRedirect;

( jQuery( function() {
	var wpseoCurrentPage = wpseoGetCurrentPage();

	if ( [ "edit.php", "edit-tags.php" ].includes( wpseoCurrentPage ) ) {
		jQuery( "#inline-edit input" ).on( "keydown", function( ev ) {
			wpseoHandleKeyEvents( ev );
		} );

		jQuery( ".button-primary" ).click( function( ev ) {
			wpseoHandleButtonEvents( ev );
		} );
	}

	if ( wpseoCurrentPage === "edit-tags.php" ) {
		jQuery( document ).on( "ajaxComplete", function( e, xhr, settings ) {
			if ( settings.data.indexOf( "action=delete-tag" ) > -1 ) {
				wpseoShowNotification();
			}
		} );
	}
} ) );
