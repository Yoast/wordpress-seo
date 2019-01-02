/* global ajaxurl, wpseoAdminL10n */
import React from "react";
import ReactDOM from "react-dom";

import RedirectUpsell from "./components/modals/RedirectUpsell";

jQuery( function() {
	jQuery( ".subsubsub .yoast_help" ).on(
		"click active",
		function() {
			const targetElementID = "#" + jQuery( this ).attr( "aria-controls" );
			jQuery( ".yoast-help-panel" ).not( targetElementID ).hide();
		}
	);

	jQuery( "#gsc_auth_code" ).click(
		function() {
			const authUrl = jQuery( "#gsc_auth_url" ).val(),
				w = 600,
				h = 500,
				left = ( screen.width / 2 ) - ( w / 2 ),
				top = ( screen.height / 2 ) - ( h / 2 );
			return window.open(
				authUrl,
				"wpseogscauthcode",
				"toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, " +
				"copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left
			);
		}
	);

	const element = document.getElementById( "yoast-google-search-console-modal" );
	if ( element ) {
		ReactDOM.render( <RedirectUpsell
			buyLink={ wpseoAdminL10n[ "shortlinks.upsell.gsc.create_redirect_button" ] }
		/>, element );
	}
} );


/**
 * Decrement current category count by one.
 *
 * @param {string} category The category count to update.
 *
 * @returns {void}
 */
function wpseoUpdateCategoryCount( category ) {
	const countElement = jQuery( "#gsc_count_" + category + "" );
	let newCount       = parseInt( countElement.text(), 10 ) - 1;
	if ( newCount < 0 ) {
		newCount = 0;
	}

	countElement.text( newCount );
}

/**
 * Sends the request to mark the given url as fixed.
 *
 * @param {string} nonce    The nonce for the request
 * @param {string} platform The platform to mark the issue for.
 * @param {string} category The category to mark the issue for.
 * @param {string} url      The url to mark as fixed.
 *
 * @returns {void}
 */
function wpseoSendMarkAsFixed( nonce, platform, category, url ) {
	jQuery.post(
		ajaxurl,
		{
			action: "wpseo_mark_fixed_crawl_issue",
			// eslint-disable-next-line
			ajax_nonce: nonce,
			platform: platform,
			category: category,
			url: url,
		},
		function( response ) {
			if ( "true" === response ) {
				wpseoUpdateCategoryCount( jQuery( "#field_category" ).val() );
				jQuery( 'span:contains("' + url + '")' ).closest( "tr" ).remove();
			}
		}
	);
}

/**
 * Marks a search console crawl issue as fixed.
 *
 * @param {string} url The URL that has been fixed.
 *
 * @returns {void}
 */
function wpseoMarkAsFixed( url ) {
	wpseoSendMarkAsFixed(
		jQuery( ".wpseo-gsc-ajax-security" ).val(),
		jQuery( "#field_platform" ).val(),
		jQuery( "#field_category" ).val(),
		url
	);
}

window.wpseoUpdateCategoryCount = wpseoUpdateCategoryCount;
window.wpseoMarkAsFixed = wpseoMarkAsFixed;
window.wpseoSendMarkAsFixed = wpseoSendMarkAsFixed;

/* eslint-disable camelcase */
window.wpseo_update_category_count = wpseoUpdateCategoryCount;
window.wpseo_mark_as_fixed = wpseoMarkAsFixed;
window.wpseo_send_mark_as_fixed = wpseoSendMarkAsFixed;
/* eslint-enable camelcase */
