/* global ajaxurl */
/* jshint -W097 */
'use strict';

/**
 * Use notification counter so we can count how many times the function wpseo_show_notification is called.
 *
 * @type {number}
 */
var wpseo_notification_counter = 0;

/**
 * Show notification to user when there's a redirect created. When the response is empty, up the notification counter with 1, wait 100 ms and call function again.
 * Stop when the notification counter is bigger than 20.
 */
function wpseo_show_notification() {
	jQuery.post(
		ajaxurl,
		{ action: 'yoast_get_notifications' },
		function(response) {
			if (response !== '') {
				var insertAfterElement = jQuery( '.wrap' ).children().eq( 0 );
				jQuery(response ).insertAfter( insertAfterElement );
				wpseo_notification_counter = 0;
			} else if (wpseo_notification_counter < 20 && response === '') {
				wpseo_notification_counter++;
				setTimeout(wpseo_show_notification, 100);
			}
		}
	);
}

function wpseo_get_current_page() {
	// We want to show a redirect message when the slug is changed using quick edit. Therefore we need to get the current page.
	return jQuery(location).attr('pathname').split('/').pop();
}

function wpseo_get_current_slug( post_id ) {
	var currentPage = wpseo_get_current_page();

	if ( currentPage === 'edit.php' ) {
		return jQuery('#inline_' + post_id ).find('.post_name').html();
	}

	if ( currentPage === 'edit-tags.php' ) {
		return jQuery('#inline_' + post_id).find('.slug').html();
	}

	return '';
}

function wpseo_compare_slug( currentSlug ) {
	var wpseo_new_slug = jQuery('input[name=post_name]').val();

	if ( currentSlug !== wpseo_new_slug) {
		wpseo_show_notification();
	}
}

(jQuery(function() {
	var wpseo_current_page = wpseo_get_current_page();

	// If current page is edit.php, proceed.
	if (wpseo_current_page === 'edit.php' || wpseo_current_page === 'edit-tags.php') {
		if ( jQuery(this).attr('id') === 'save-order' ) {
			return;
		}

		var tr = jQuery( this ).closest('tr');

		console.log( tr );

		if ( tr.length === 0 ) {
			return;
		}

		var wpseo_post_id = tr.attr('id').replace('edit-', '');
		var wpseo_current_slug = wpseo_get_current_slug( wpseo_post_id );

		$( 'td', '#inline-edit').on( 'keydown', function(e){
			if ( e.which === 13 && ! $( e.target ).hasClass( 'cancel' ) ) {
				wpseo_compare_slug( wpseo_current_slug );
			}
		});

		// When user clicks on save button after doing a quick edit, get the post id, current slug and new slug.
		jQuery('.button-primary').click(function() {
			wpseo_compare_slug( wpseo_current_slug );
		});
	}
}));
