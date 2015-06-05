function wpseo_gwt_open_authorize_code_window(url) {
	var w = 600,
		h = 500,
		left = (screen.width / 2) - (w / 2),
		top = (screen.height / 2) - (h / 2);
	return window.open(url, 'wpseogwtauthcode', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}

function wpseo_gwt_post_redirect( target_button ) {

	var target_form = jQuery( '#TB_ajaxContent' );
	var old_url     = jQuery( target_form ).find('input[name=current_url]').val();

	jQuery.post(
		wpseo_premium_strings.ajaxurl,
		{
			action        : 'wpseo_gwt_create_redirect_url',
			ajax_nonce    : jQuery('.wpseo-gwt-ajax-security').val(),
			old_url       : old_url,
			new_url       : jQuery( target_form ).find('input[name=new_url]').val(),
			mark_as_fixed : jQuery( target_form ).find('input[name=mark_as_fixed]').val(),
			platform      : jQuery('#field_platform').val(),
			category      : jQuery('#field_category').val(),
			type	      : '301',

		},
		function ( response ) {
			// Remove the row with old url
			jQuery('span:contains(' + old_url + ')').closest('tr').remove();

			// Remove the thickbox
			tb_remove();
		}
	);

	return false;
}


function wpseo_mark_as_fixed(url) {
	jQuery.post(
		ajaxurl,
		{
			action     : 'wpseo_mark_fixed_crawl_issue',
			ajax_nonce : jQuery('.wpseo-gwt-ajax-security').val(),
			platform   : jQuery('#field_platform').val(),
			category   : jQuery('#field_category').val(),
			url        : url
		},
		function (response) {
			if ("true" === response) {
				jQuery('span:contains(' + url + ')').closest('tr').remove();
			}
		}
	);
}
