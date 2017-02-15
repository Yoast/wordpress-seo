/* global tb_remove, wpseo_send_mark_as_fixed, yoastPremiumGSC */

/**
 * Adds a redirect from the Google Search Console overview.
 *
 * @returns {boolean} Always returns false to cancel the default event handler.
 */
function wpseoPostRedirectToGSC() {
	let targetForm = jQuery( "#TB_ajaxContent" );
	let oldURL     = jQuery( targetForm ).find( "input[name=current_url]" ).val();
	let newURL     = jQuery( targetForm ).find( "input[name=new_url]" ).val();
	let isChecked  = jQuery( targetForm ).find( "input[name=mark_as_fixed]" ).prop( "checked" );

	jQuery.ajax( {
		type: "POST",
		url: yoastPremiumGSC.data.restApi.root + "yoast/v1/redirects",
		beforeSend: ( xhr ) => {
			xhr.setRequestHeader( "X-WP-Nonce", yoastPremiumGSC.data.restAPI.nonce );
		},
		dataType: "json",
		data: {
			origin: oldURL,
			target: newURL,
			type: "301",
		},
		success: function( response ) {
			if( response === "true" && isChecked === true ) {
				wpseo_send_mark_as_fixed(
					jQuery( ".wpseo-gsc-ajax-security" ).val(),
					jQuery( "#field_platform" ).val(),
					jQuery( "#field_category" ).val(),
					oldURL
				);
			}

			// Remove the thickbox.
			tb_remove();
		},
	} );

	return false;
}

window.wpseoPostRedirectToGSC = wpseoPostRedirectToGSC;
