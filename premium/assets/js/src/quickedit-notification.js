/* global ajaxurl */
/* jshint -W097 */

var redirectFunctions = require( "./redirects/functions" );

/**
 * Use notification counter so we can count how many times the function wpseo_show_notification is called.
 *
 * @type {number}
 */
var wpseo_notification_counter = 0;

/**
 * Show notification to user when there's a redirect created. When the response is empty, up the notification counter with 1, wait 100 ms and call function again.
 * Stop when the notification counter is bigger than 20.
 *
 * @returns {void}
 */
function wpseo_show_notification() {
	jQuery.post(
		ajaxurl,
		{ action: "yoast_get_notifications" },
		function( response ) {
			if ( response !== "" ) {
				var insertAfterElement = jQuery( ".wrap" ).children().eq( 0 );
				jQuery( response ).insertAfter( insertAfterElement );
				wpseo_notification_counter = 0;
			}

			if ( wpseo_notification_counter < 20 && response === "" ) {
				wpseo_notification_counter++;
				setTimeout( wpseo_show_notification, 500 );
			}
		}
	);
}

window.wpseo_show_notification = wpseo_show_notification;

/**
 * Gets the current page based on the current URL.
 *
 * @returns {string} The current page.
 */
function wpseo_get_current_page() {
	return jQuery( location ).attr( "pathname" ).split( "/" ).pop();
}

window.wpseo_get_current_page = wpseo_get_current_page;

/**
 * Gets the current slug of a post based on the current page and post or term being edited.
 *
 * @returns {string} The slug of the current post or term.
 */
function wpseo_get_current_slug() {
	var currentPost = wpseo_get_item_id();
	var currentPage = wpseo_get_current_page();

	if ( currentPage === "edit.php" ) {
		return jQuery( "#inline_" + currentPost ).find( ".post_name" ).html();
	}

	if ( currentPage === "edit-tags.php" ) {
		return jQuery( "#inline_" + currentPost ).find( ".slug" ).html();
	}

	return "";
}

window.wpseo_get_current_slug = wpseo_get_current_slug;

/**
 * Checks whether or not the slug has changed.
 *
 * @returns {boolean} Whether or not the slug has changed.
 */
function wpseo_slug_changed() {
	var editor = wpseo_get_active_editor();
	var currentSlug = wpseo_get_current_slug();
	var wpseo_new_slug =  editor.find( "input[name=post_name]" ).val();

	return currentSlug !== wpseo_new_slug;
}

window.wpseo_slug_changed = wpseo_slug_changed;

/**
 * Gets the currently active editor used in quick edit.
 *
 * @returns {Object} The editor that is currently active.
 */
function wpseo_get_active_editor() {
	return jQuery( "tr.inline-editor" );
}

window.wpseo_get_active_editor = wpseo_get_active_editor;

/**
 * Gets the current post or term id.
 * Returns an empty string if no editor is currently active.
 *
 * @returns {string} The ID of the current post or term.
 */
function wpseo_get_item_id() {
	var editor = wpseo_get_active_editor();

	if ( editor.length === 0 || editor === "" ) {
		return "";
	}

	return editor.attr( "id" ).replace( "edit-", "" );
}

window.wpseo_get_item_id = wpseo_get_item_id;

/**
 * Handles the key-based events in the quick edit editor.
 *
 * @param {Event} ev The event currently being executed.
 *
 * @returns {void}
 */
function wpseo_handle_key_events( ev ) {
	// 13 refers to the enter key.
	if ( ev.which === 13 && wpseo_slug_changed() ) {
		wpseo_show_notification();
	}
}

window.wpseo_handle_key_events = wpseo_handle_key_events;

/**
 * Handles the button-based events in the quick edit editor.
 *
 * @param {Event} ev The event currently being executed.
 *
 * @returns {void}
 */
function wpseo_handle_button_events( ev ) {
	if ( jQuery( ev.target ).attr( "id" ) !== "save-order" && wpseo_slug_changed() ) {
		wpseo_show_notification();
	}
}

window.wpseo_handle_button_events = wpseo_handle_button_events;

window.wpseo_undo_redirect = redirectFunctions.wpseo_undo_redirect;
window.wpseo_create_redirect = redirectFunctions.wpseo_create_redirect;

( jQuery( function() {
	var wpseoCurrentPage = wpseo_get_current_page();

	// If current page is edit*.php, continue execution.
	if ( wpseoCurrentPage === "edit.php" || wpseoCurrentPage === "edit-tags.php" ) {
		jQuery( "#inline-edit input" ).on( "keydown", function( ev ) {
			wpseo_handle_key_events( ev );
		} );

		jQuery( ".button-primary" ).click( function( ev ) {
			wpseo_handle_button_events( ev );
		} );
	}
} ) );
