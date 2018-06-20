/* global wpseoAdminGlobalL10n, ajaxurl, wpseoSelect2Locale */

import a11ySpeak from "a11y-speak";

( function() {
	"use strict";

	/**
	 * Detects the wrong use of variables in title and description templates
	 *
	 * @param {element} e The element to verify.
	 *
	 * @returns {void}
	 */
	function wpseoDetectWrongVariables( e ) {
		var warn = false;
		var errorId = "";
		var wrongVariables = [];
		var authorVariables = [ "userid", "name", "user_description" ];
		var dateVariables = [ "date" ];
		var postVariables = [ "title", "parent_title", "excerpt", "excerpt_only", "caption", "focuskw", "pt_single", "pt_plural", "modified", "id" ];
		var specialVariables = [ "term404", "searchphrase" ];
		var taxonomyVariables = [ "term_title", "term_description" ];
		var taxonomyPostVariables = [ "category", "category_description", "tag", "tag_description" ];
		if ( e.hasClass( "posttype-template" ) ) {
			wrongVariables = wrongVariables.concat( specialVariables, taxonomyVariables );
		}
		else if ( e.hasClass( "homepage-template" ) ) {
			wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, specialVariables, taxonomyVariables, taxonomyPostVariables );
		}
		else if ( e.hasClass( "taxonomy-template" ) ) {
			wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, specialVariables );
		}
		else if ( e.hasClass( "author-template" ) ) {
			wrongVariables = wrongVariables.concat( postVariables, dateVariables, specialVariables, taxonomyVariables, taxonomyPostVariables );
		}
		else if ( e.hasClass( "date-template" ) ) {
			wrongVariables = wrongVariables.concat( authorVariables, postVariables, specialVariables, taxonomyVariables, taxonomyPostVariables );
		}
		else if ( e.hasClass( "search-template" ) ) {
			wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, taxonomyVariables, taxonomyPostVariables, [ "term404" ] );
		}
		else if ( e.hasClass( "error404-template" ) ) {
			wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, taxonomyVariables, taxonomyPostVariables, [ "searchphrase" ] );
		}
		jQuery.each( wrongVariables, function( index, variable ) {
			errorId = e.attr( "id" ) + "-" + variable + "-warning";
			if ( e.val().search( "%%" + variable + "%%" ) !== -1 ) {
				e.addClass( "wpseo-variable-warning-element" );
				var msg = wpseoAdminGlobalL10n.variable_warning.replace( "%s", "%%" + variable + "%%" );
				if ( jQuery( "#" + errorId ).length ) {
					jQuery( "#" + errorId ).html( msg );
				}
				else {
					e.after( ' <div id="' + errorId + '" class="wpseo-variable-warning">' + msg + "</div>" );
				}

				a11ySpeak( wpseoAdminGlobalL10n.variable_warning.replace( "%s", variable ), "assertive" );

				warn = true;
			}
			else {
				if ( jQuery( "#" + errorId ).length ) {
					jQuery( "#" + errorId ).remove();
				}
			}
		}
		);
		if ( warn === false ) {
			e.removeClass( "wpseo-variable-warning-element" );
		}
	}

	/**
	 * Sets a specific WP option
	 *
	 * @param {string} option The option to update.
	 * @param {string} newval The new value for the option.
	 * @param {string} hide   The ID of the element to hide on success.
	 * @param {string} nonce  The nonce for the action.
	 *
	 * @returns {void}
	 */
	function setWPOption( option, newval, hide, nonce ) {
		jQuery.post( ajaxurl, {
			action: "wpseo_set_option",
			option: option,
			newval: newval,
			_wpnonce: nonce,
		}, function( data ) {
			if ( data ) {
				jQuery( "#" + hide ).hide();
			}
		}
		);
	}

	/**
	 * Copies the meta description for the homepage.
	 *
	 * @returns {void}
	 */
	function wpseoCopyHomeMeta() {
		jQuery( "#copy-home-meta-description" ).on( "click", function() {
			jQuery( "#og_frontpage_desc" ).val( jQuery( "#meta_description" ).val() );
		} );
	}

	/**
	 * Makes sure we store the action hash so we can return to the right hash
	 *
	 * @returns {void}
	 */
	function wpseoSetTabHash() {
		var conf = jQuery( "#wpseo-conf" );
		if ( conf.length ) {
			var currentUrl = conf.attr( "action" ).split( "#" )[ 0 ];
			conf.attr( "action", currentUrl + window.location.hash );
		}
	}

	/**
	 * When the hash changes, get the base url from the action and then add the current hash
	 */
	jQuery( window ).on( "hashchange", wpseoSetTabHash );

	/**
	 * Adds select2 for selected fields.
	 *
	 * @returns {void}
	 */
	function initSelect2() {
		var select2Width = "400px";

		// Select2 for General settings: your info: company or person. Width is the same as the width for the other fields on this page.
		jQuery( "#company_or_person" ).select2( {
			width: select2Width,
			language: wpseoSelect2Locale,
		} );

		// Select2 for Twitter card meta data in Settings
		jQuery( "#twitter_card_type" ).select2( {
			width: select2Width,
			language: wpseoSelect2Locale,
		} );

		// Select2 for taxonomy breadcrumbs in Advanced
		jQuery( "#breadcrumbs select" ).select2( {
			width: select2Width,
			language: wpseoSelect2Locale,
		} );

		// Select2 for profile in Search Console
		jQuery( "#profile" ).select2( {
			width: select2Width,
			language: wpseoSelect2Locale,
		} );
	}

	/**
	 * Set the initial active tab in the settings pages.
	 *
	 * @returns {void}
	 */
	function setInitialActiveTab() {
		var activeTabId = window.location.hash.replace( "#top#", "" );
		/* In some cases, the second # gets replace by %23, which makes the tab
		 * switching not work unless we do this. */
		if ( activeTabId.search( "#top" ) !== -1 ) {
			activeTabId = window.location.hash.replace( "#top%23", "" );
		}
		/*
		 * WordPress uses fragment identifiers for its own in-page links, e.g.
		 * `#wpbody-content` and other plugins may do that as well. Also, facebook
		 * adds a `#_=_` see PR 506. In these cases and when it's empty, default
		 * to the first tab.
		 */
		if ( "" === activeTabId || "#" === activeTabId.charAt( 0 ) ) {
			/*
			 * Reminder: jQuery attr() gets the attribute value for only the first
			 * element in the matched set so this will always be the first tab id.
			 */
			activeTabId = jQuery( ".wpseotab" ).attr( "id" );
		}

		jQuery( "#" + activeTabId ).addClass( "active" );
		jQuery( "#" + activeTabId + "-tab" ).addClass( "nav-tab-active" ).click();
	}

	window.wpseoDetectWrongVariables = wpseoDetectWrongVariables;
	window.setWPOption = setWPOption;
	window.wpseoCopyHomeMeta = wpseoCopyHomeMeta;
	// eslint-disable-next-line
	window.wpseoSetTabHash = wpseoSetTabHash;

	jQuery( document ).ready( function() {
		/**
		 * When the hash changes, get the base url from the action and then add the current hash.
		 */
		wpseoSetTabHash();

		// Toggle the Author archives section.
		jQuery( "#disable-author input[type='radio']" ).change( function() {
			// The value on is disabled, off is enabled.
			if ( jQuery( this ).is( ":checked" ) ) {
				jQuery( "#author-archives-titles-metas-content" ).toggle( jQuery( this ).val() === "off" );
			}
		} ).change();

		// Toggle the Date archives section.
		jQuery( "#disable-date input[type='radio']" ).change( function() {
			// The value on is disabled, off is enabled.
			if ( jQuery( this ).is( ":checked" ) ) {
				jQuery( "#date-archives-titles-metas-content" ).toggle( jQuery( this ).val() === "off" );
			}
		} ).change();

		// Toggle the Media section.
		jQuery( "#disable-attachment input[type='radio']" ).change( function() {
			// The value on is disabled, off is enabled.
			if ( jQuery( this ).is( ":checked" ) ) {
				jQuery( "#media_settings" ).toggle( jQuery( this ).val() === "off" );
			}
		} ).change();

		// Toggle the Format-based archives section.
		jQuery( "#disable-post_format" ).change( function() {
			jQuery( "#post_format-titles-metas" ).toggle( jQuery( this ).is( ":not(:checked)" ) );
		} ).change();

		// Toggle the Breadcrumbs section.
		jQuery( "#breadcrumbs-enable" ).change( function() {
			jQuery( "#breadcrumbsinfo" ).toggle( jQuery( this ).is( ":checked" ) );
		} ).change();

		// Handle the settings pages tabs.
		jQuery( "#wpseo-tabs" ).find( "a" ).click( function() {
			jQuery( "#wpseo-tabs" ).find( "a" ).removeClass( "nav-tab-active" );
			jQuery( ".wpseotab" ).removeClass( "active" );

			var id = jQuery( this ).attr( "id" ).replace( "-tab", "" );
			var activeTab = jQuery( "#" + id );
			activeTab.addClass( "active" );
			jQuery( this ).addClass( "nav-tab-active" );
			if ( activeTab.hasClass( "nosave" ) ) {
				jQuery( "#submit" ).hide();
			} else {
				jQuery( "#submit" ).show();
			}
		} );

		// Handle the Company or Person select.
		jQuery( "#company_or_person" ).change( function() {
			var companyOrPerson = jQuery( this ).val();
			if ( "company" === companyOrPerson ) {
				jQuery( "#knowledge-graph-company" ).show();
				jQuery( "#knowledge-graph-person" ).hide();
			}
			else if ( "person" === companyOrPerson ) {
				jQuery( "#knowledge-graph-company" ).hide();
				jQuery( "#knowledge-graph-person" ).show();
			}
			else {
				jQuery( "#knowledge-graph-company" ).hide();
				jQuery( "#knowledge-graph-person" ).hide();
			}
		} ).change();

		// Check correct variables usage in title and description templates.
		jQuery( ".template" ).on( "input", function() {
			wpseoDetectWrongVariables( jQuery( this ) );
		} );

		// Prevent form submission when pressing Enter on the switch-toggles.
		jQuery( ".switch-yoast-seo input" ).on( "keydown", function( event ) {
			if ( "keydown" === event.type && 13 === event.which ) {
				event.preventDefault();
			}
		} );

		// Allow collapsing of the content types sections.
		jQuery( ".toggleable-container-trigger" ).on( "click", ( event ) => {
			event.preventDefault();

			let target = jQuery( event.target );

			target.find( "span" ).toggleClass( "dashicons-arrow-up-alt2 dashicons-arrow-down-alt2" );
			target.parent().siblings( ".toggleable-container" ).toggleClass( "toggleable-container-hidden" );
		} );

		wpseoCopyHomeMeta();
		setInitialActiveTab();
		initSelect2();
	} );
}() );
