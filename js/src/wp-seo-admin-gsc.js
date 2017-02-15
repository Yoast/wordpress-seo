/* jshint unused:false */
/* global ajaxurl */
/* global tb_click */
jQuery( function() {
	"use strict";

	// Store the control that opened the modal dialog for later use.
	var $gscModalFocusedBefore;

	jQuery( "#gsc_auth_code" ).click(
		function() {
			var auth_url = jQuery( "#gsc_auth_url" ).val(),
				w = 600,
				h = 500,
				left = ( screen.width / 2 ) - ( w / 2 ),
				top = ( screen.height / 2 ) - ( h / 2 );
			return window.open( auth_url, "wpseogscauthcode", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left );
		}
	);

	// Accessibility improvements for the Create Redirect modal dialog.
	jQuery( ".wpseo-open-gsc-redirect-modal" ).click(
		function( event ) {
			var $modal;
			var $modalTitle;
			var $closeButtonTop;
			var $closeButtonBottom;

			// Get the link text to be used as the modal title.
			var title = jQuery( this ).text();

			// Prevent default action.
			event.preventDefault();
			// Prevent triggering Thickbox original click.
			event.stopPropagation();
			// Get the control that opened the modal dialog.
			$gscModalFocusedBefore = jQuery( this );
			// Call Thickbox now and bind `this`. The Thickbox UI is now available.
			tb_click.call( this );

			// Get the Thickbox modal elements.
			$modal = jQuery( "#TB_window" );
			$modalTitle = jQuery( "#TB_ajaxWindowTitle" );
			$closeButtonTop = jQuery( "#TB_closeWindowButton" );
			$closeButtonBottom = jQuery( ".wpseo-redirect-close", $modal );

			// Set the modal title.
			$modalTitle.text( title );

			// Set ARIA role and ARIA attributes.
			$modal.attr( {
				role: "dialog",
				"aria-labelledby": "TB_ajaxWindowTitle",
				"aria-describedby": "TB_ajaxContent",
			} )
			.on( "keydown", function( event ) {
				var id;

				// Constrain tabbing within the modal.
				if ( 9 === event.which ) {
					id = event.target.id;

					if ( jQuery( event.target ).hasClass( "wpseo-redirect-close" ) && ! event.shiftKey ) {
						$closeButtonTop.focus();
						event.preventDefault();
					} else if ( id === "TB_closeWindowButton" && event.shiftKey ) {
						$closeButtonBottom.focus();
						event.preventDefault();
					}
				}
			} );
		}
	);

	jQuery( document.body ).on( "click", ".wpseo-redirect-close", function() {
		// Close the Thickbox modal when clicking on the bottom button.
		jQuery( this ).closest( "#TB_window" ).find( "#TB_closeWindowButton" ).trigger( "click" );
	} ).on( "thickbox:removed", function() {
		// Move focus back to the element that opened the modal.
		$gscModalFocusedBefore.focus();
	} );
} );


/**
 * Decrement current category count by one.
 *
 * @param {string} category The category count to update.
 */
function wpseo_update_category_count( category ) {
	"use strict";

	var count_element = jQuery( "#gsc_count_" + category + "" );
	var new_count     = parseInt( count_element.text(), 10 ) - 1;
	if( new_count < 0 ) {
		new_count = 0;
	}

	count_element.text( new_count );
}

/**
 * Sends the request to mark the given url as fixed.
 *
 * @param {string} nonce    The nonce for the request
 * @param {string} platform The platform to mark the issue for.
 * @param {string} category The category to mark the issue for.
 * @param {string} url      The url to mark as fixed.
 */
function wpseo_send_mark_as_fixed( nonce, platform, category, url ) {
	jQuery.post(
		ajaxurl,
		{
			action: "wpseo_mark_fixed_crawl_issue",
			ajax_nonce: nonce,
			platform: platform,
			category: category,
			url: url,
		},
		function( response ) {
			if ( "true" === response ) {
				wpseo_update_category_count( jQuery( "#field_category" ).val() );
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
function wpseo_mark_as_fixed( url ) {
	"use strict";

	wpseo_send_mark_as_fixed(
		jQuery( ".wpseo-gsc-ajax-security" ).val(),
		jQuery( "#field_platform" ).val(),
		jQuery( "#field_category" ).val(),
		url
	);
}

window.wpseo_update_category_count = wpseo_update_category_count;
window.wpseo_mark_as_fixed = wpseo_mark_as_fixed;
window.wpseo_send_mark_as_fixed = wpseo_send_mark_as_fixed;
