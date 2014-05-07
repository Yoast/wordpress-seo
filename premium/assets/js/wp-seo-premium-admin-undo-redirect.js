function wpseo_undo_redirect(url, nonce) {

	jQuery.post(
			ajaxurl,
			{
				action    : 'wpseo_delete_redirect_url',
				ajax_nonce: nonce,
				redirect  : { key: url }
			},
			function (response) {
				jQuery('.yoast-redirect-message').fadeOut('normal',function() {
					jQuery(this).remove();
				})
			}
	);

}