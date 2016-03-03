/* global ajaxurl */
/* global wpseoMakeDismissible */
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
				wpseoMakeDismissible();
				wpseo_notification_counter = 0;
			} else if (wpseo_notification_counter < 20 && response === '') {
				wpseo_notification_counter++;
				setTimeout(wpseo_show_notification, 100);
			}
		}
	);
}

(jQuery(function() {
	var wpseo_post_id;

	//We want to show a redirect message when the slug is changed using quick edit. Therefore we need to get the current page.
	var wpseo_current_page = jQuery(location).attr('pathname').split('/').pop();

	//If current page is edit.php, proceed.
	if (wpseo_current_page === 'edit.php' || wpseo_current_page === 'edit-tags.php') {
		//When user clicks on save button after doing a quick edit, get the post id, current slug and new slug.
		jQuery('.button-primary').click(function() {
			if ( jQuery(this).attr('id') === 'save-order' ) {
				return;
			}

			if ( jQuery(this).closest('tr').length > 0 ) {
				wpseo_post_id = jQuery(this).closest('tr').attr('id').replace('edit-', '');
			}
			else {
				return;
			}

			var wpseo_current_slug;

			if (wpseo_current_page === 'edit.php') {
				wpseo_current_slug = jQuery('#inline_' + wpseo_post_id).find('.post_name').html();
			}
			else if (wpseo_current_page === 'edit-tags.php') {
				wpseo_current_slug = jQuery('#inline_' + wpseo_post_id).find('.slug').html();
			}

			var wpseo_new_slug = jQuery('input[name=post_name]').val();

			if (wpseo_current_slug !== wpseo_new_slug) {
				wpseo_show_notification();
			}
		});
	}
}));
