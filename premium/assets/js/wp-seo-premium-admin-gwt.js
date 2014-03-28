function wpseo_gwt_open_authorize_code_window(url) {
	var w = 600,
			h = 500,
			left = (screen.width / 2) - (w / 2),
			top = (screen.height / 2) - (h / 2);
	return window.open(url, 'wpseogwtauthcode', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}

function wpseo_create_redirect(old_url, current_view) {
	var new_url = prompt(wpseo_premium_strings.enter_new_url);

	if (null != new_url) {
		if ('' != new_url) {
			jQuery.post(
					wpseo_premium_strings.ajaxurl,
					{
						action    : 'wpseo_create_redirect',
						ajax_nonce: jQuery('.wpseo_redirects_ajax_nonce').val(),
						old_url   : old_url,
						new_url   : new_url
					},
					function (response) {

						/**
						 * @todo create a nice overlay
						 */

						var update_div = jQuery('<div>').addClass('updated').html('<p><bold>' + wpseo_premium_strings.redirect_saved + '</bold></p>');
						jQuery('.wrap').prepend(update_div);

						jQuery(update_div).delay(500).fadeOut('slow', function () {
							jQuery(this).remove();
						});

						// Remove the redirect row if we're in the not-redirected view
						if ('not-redirected' == current_view) {
							alert("DOEI");
						}
					}
			);
		} else {
			alert(wpseo_premium_strings.error_new_url);
		}
	}
}

function wpseo_ignore_redirect(url) {
	jQuery.post(
			wpseo_premium_strings.ajaxurl,
			{ action: 'wpseo_ignore_crawl_issue', ajax_nonce: jQuery('.wpseo_redirects_ajax_nonce').val(), url: url },
			function (response) {
				if ("true" == response) {
					jQuery('span:contains(' + url + ')').closest('tr').remove();
				}
			}
	);
}

function wpseo_unignore_redirect(url) {
	jQuery.post(
			wpseo_premium_strings.ajaxurl,
			{ action: 'wpseo_unignore_crawl_issue', ajax_nonce: jQuery('.wpseo_redirects_ajax_nonce').val(), url: url },
			function (response) {
				if ("true" == response) {
					jQuery('span:contains(' + url + ')').closest('tr').remove();
				}
			}
	);
}