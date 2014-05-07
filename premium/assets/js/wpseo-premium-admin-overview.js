function wpseo_undo_redirect(url, nonce) {

	jQuery.post(
			ajaxurl,
			{
				action    : 'wpseo_delete_redirect_url',
				ajax_nonce: nonce,
				redirect  : { key: url }
			},
			function (response) {
				jQuery('.yoast-notice').fadeOut('normal', function () {
					jQuery(this).remove();
				});
			}
	);

}

function wpseo_create_redirect(url, nonce) {
	var new_url = prompt(wpseo_premium_strings.enter_new_url);

	if (null != new_url) {
		if ('' != new_url) {
			jQuery.post(
					wpseo_premium_strings.ajaxurl,
					{
						action    : 'wpseo_create_redirect_url',
						ajax_nonce: nonce,
						old_url   : url,
						new_url   : new_url
					},
					function (response) {

						var update_div = jQuery('<div>').addClass('updated').html('<p><bold>' + wpseo_premium_strings.redirect_saved + '</bold></p>');
						jQuery('.wrap').prepend(update_div);

						jQuery(update_div).delay(500).fadeOut('slow', function () {
							jQuery(this).remove();
						});

						jQuery('.yoast-notice').fadeOut('normal', function () {
							jQuery(this).remove();
						});

					}
			);
		} else {
			alert(wpseo_premium_strings.error_new_url);
		}
	}
}

(function ($) {

	$(window).load(function () {

		$('.wp-list-table.tags tbody').on('DOMNodeRemoved', function () {

			jQuery.post(
					ajaxurl,
					{
						action: 'yoast_get_notifications'
					},
					function (response) {
						if ('' != response) {
							$('#ajax-response').append(response);
						}
					}
			);


		});

	});

})(jQuery);