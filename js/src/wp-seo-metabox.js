/* Browser:true */
/* global wpseoSelect2Locale, wpseoFeaturesL10n */

import { enableFeatures } from "@yoast/feature-flag";

( function( $ ) {
	/**
	 * Initializes the meta box tabs, adds event handlers, and manages the tabs visibility.
	 *
	 * @returns {void}
	 */
	function wpseoInitTabs() {
		// Enable features using the feature-flag package.
		enableFeatures( wpseoFeaturesL10n );

		// When there's only one add-on tab, change its link to a span element.
		var addonsTabsLinks = jQuery( "#wpseo-meta-section-addons .wpseo_tablink" );
		if ( addonsTabsLinks.length === 1 ) {
			addonsTabsLinks.replaceWith( "<span class='" + addonsTabsLinks[ 0 ].className + "'>" + addonsTabsLinks.text() + "</span>" );
		}

		if ( jQuery( ".wpseo-metabox-tabs-div" ).length > 0 ) {
			jQuery( ".wpseo-metabox-tabs" )
				.on( "click", "a.wpseo_tablink", function( ev ) {
					ev.preventDefault();

					jQuery( ".wpseo-meta-section.active .wpseo-metabox-tabs li" ).removeClass( "active" );
					jQuery( ".wpseo-meta-section.active .wpseotab" ).removeClass( "active" );

					// Hide the Yoast tooltip when the element gets clicked.
					jQuery( this ).addClass( "yoast-tooltip-hidden" );

					var targetElem = jQuery( jQuery( this ).attr( "href" ) );
					targetElem.addClass( "active" );
					jQuery( this ).parent( "li" ).addClass( "active" );

					if ( jQuery( this ).hasClass( "scroll" ) ) {
						jQuery( "html, body" ).animate( {
							scrollTop: jQuery( targetElem ).offset().top,
						}, 500 );
					}
				} )
				.on( "mouseleave", "a.wpseo_tablink", function() {
					// The element can still have focus, ensure to hide the tooltip.
					jQuery( this ).addClass( "yoast-tooltip-hidden" );
				} )
				.on( "blur mouseenter", "a.wpseo_tablink", function() {
					// Make the element tooltip-able again.
					jQuery( this ).removeClass( "yoast-tooltip-hidden" );
				} );
		}

		if ( jQuery( ".wpseo-meta-section" ).length > 0 ) {
			jQuery( "#wpseo-meta-section-content, .wpseo-meta-section-react" ).addClass( "active" );

			jQuery( ".wpseo-metabox-sidebar li" ).filter( function() {
				return jQuery( this ).find( ".wpseo-meta-section-link" ).attr( "href" ) === "#wpseo-meta-section-content";
			} ).addClass( "active" );

			jQuery( "a.wpseo-meta-section-link" )
				.on( "click", function( ev ) {
					var targetTab = jQuery( this ).attr( "href" ),
						targetTabElement = jQuery( targetTab );

					ev.preventDefault();

					jQuery( ".wpseo-metabox-sidebar li" ).removeClass( "active" );
					jQuery( ".wpseo-meta-section" ).removeClass( "active" );
					jQuery( ".wpseo-meta-section-react.active" ).removeClass( "active" );

					// Hide the Yoast tooltip when the element gets clicked.
					jQuery( this ).addClass( "yoast-tooltip-hidden" );
					if ( targetTab === "#wpseo-meta-section-content" ) {
						jQuery( ".wpseo-meta-section-react" ).addClass( "active" );
					}

					targetTabElement.addClass( "active" );

					jQuery( this ).parent( "li" ).addClass( "active" );
				} )
				.on( "mouseleave", function() {
					// The element can still have focus, ensure to hide the tooltip.
					jQuery( this ).addClass( "yoast-tooltip-hidden" );
				} )
				.on( "blur mouseenter", function() {
					// Make the element tooltip-able again.
					jQuery( this ).removeClass( "yoast-tooltip-hidden" );
				} );
		}

		jQuery( ".wpseo-metabox-tabs" ).show();
		// End Tabs code.
	}

	window.wpseoInitTabs = wpseoInitTabs;
	/* eslint-disable-next-line camelcase */
	window.wpseo_init_tabs = wpseoInitTabs;

	/**
	 * @summary Adds select2 for selected fields.
	 *
	 * @returns {void}
	 */
	function initSelect2() {
		// Select2 for Yoast SEO Metabox Advanced tab
		$( "#yoast_wpseo_meta-robots-noindex" ).select2( { width: "100%", language: wpseoSelect2Locale } );
		$( "#yoast_wpseo_meta-robots-adv" ).select2( { width: "100%", language: wpseoSelect2Locale } );
	}

	jQuery( document ).ready( function() {
		jQuery( ".wpseo-meta-section" ).each( function( _, el ) {
			jQuery( el ).find( ".wpseo-metabox-tabs li:first" ).addClass( "active" );
			jQuery( el ).find( ".wpseotab:first" ).addClass( "active" );
		} );
		window.wpseo_init_tabs();

		initSelect2();
	} );
}( jQuery ) );
