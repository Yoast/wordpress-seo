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
	let type       = parseInt( jQuery( targetForm ).find( "select[name=redirect-type]" ).val(), 10 );

	jQuery.ajax( {
		type: "POST",
		url: yoastPremiumGSC.data.restAPI.root + "yoast/v1/redirects",
		beforeSend: ( xhr ) => {
			xhr.setRequestHeader( "X-WP-Nonce", yoastPremiumGSC.data.restAPI.nonce );
		},
		dataType: "json",
		data: {
			origin: oldURL,
			target: newURL,
			type: type,
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

/**
 * Adds onchange event to the dropdowns.
 *
 * @returns {void}
 */
jQuery( function() {
	let redirectTypes = jQuery( "select[name=redirect-type]" );

	let ALLOW_EMPTY_TARGET = [
		410, 451,
	];

	redirectTypes.on( "change", function( evt ) {
		let type            = parseInt( this.value, 10 );
		let fieldToToggle = jQuery( evt.target ).closest( ".wpseo_content_wrapper" ).find( ".form-field-target" )[ 0 ];

		// Hide the target field in case of a 410 redirect.
		if( jQuery.inArray( type, ALLOW_EMPTY_TARGET ) > -1 ) {
			jQuery( fieldToToggle ).hide();
		} else {
			jQuery( fieldToToggle ).show();
		}
	} );
} );

window.wpseoPostRedirectToGSC = wpseoPostRedirectToGSC;
