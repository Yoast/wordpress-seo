
/**
 * Adds a redirect from the google search console overview.
 *
 * @returns {boolean} Always returns false to cancel the default event handler.
 */
function wpseo_gsc_post_redirect() {
	"use strict";

	var target_form = jQuery( "#TB_ajaxContent" );
	var old_url     = jQuery( target_form ).find( "input[name=current_url]" ).val();
	var is_checked  = jQuery( target_form ).find( "input[name=mark_as_fixed]" ).prop( "checked" );

	jQuery.ajax( {
		type: "POST",
		url: yoastPremiumGSC.data.restApi.root + "yoast/v1/redirects",
		beforeSend: ( xhr ) => {
			xhr.setRequestHeader( "X-WP-Nonce", yoastPremiumGSC.data.restApi.nonce );
		},
		dataType: "json",
		data: {
			origin: old_url,
			target: jQuery( target_form ).find( "input[name=new_url]" ).val(),
			type: "301",
		},
		success: function( response ) {
			if( response === "true" && is_checked === true ) {
				wpseo_send_mark_as_fixed( nonce, jQuery( "#field_platform" ).val(), jQuery( "#field_category" ).val(), old_url );
			}

			// Remove the thickbox.
			tb_remove();
		},
	} );

	return false;
}

window.wpseo_gsc_post_redirect = wpseo_gsc_post_redirect;