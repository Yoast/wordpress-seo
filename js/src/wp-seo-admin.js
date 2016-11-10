/* global wpseoAdminL10n, ajaxurl, tb_remove, wpseoSelect2Locale */

import initializeAlgoliaSearch from "./kb-search/wp-seo-kb-search-init";
import a11ySpeak from "a11y-speak";

( function() {
	"use strict";

	/**
	 * Detects the wrong use of variables in title and description templates
	 *
	 * @param {element} e
	 */
	function wpseoDetectWrongVariables( e ) {
		var warn = false;
		var error_id = "";
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
			error_id = e.attr( "id" ) + "-" + variable + "-warning";
			if ( e.val().search( "%%" + variable + "%%" ) !== -1 ) {
				e.addClass( "wpseo-variable-warning-element" );
				var msg = wpseoAdminL10n.variable_warning.replace( "%s", "%%" + variable + "%%" );
				if ( jQuery( "#" + error_id ).length ) {
					jQuery( "#" + error_id ).html( msg );
				}
				else {
					e.after( ' <div id="' + error_id + '" class="wpseo-variable-warning">' + msg + "</div>" );
				}

				a11ySpeak( wpseoAdminL10n.variable_warning.replace( "%s", variable ), "assertive" );

				warn = true;
			}
			else {
				if ( jQuery( "#" + error_id ).length ) {
					jQuery( "#" + error_id ).remove();
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
	 * @param {string} option The option to update
	 * @param {string} newval The new value for the option
	 * @param {string} hide The ID of the element to hide on success
	 * @param {string} nonce The nonce for the action
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
	 * Do the kill blocking files action
	 *
	 * @param {string} nonce
	 */
	function wpseoKillBlockingFiles( nonce ) {
		jQuery.post( ajaxurl, {
			action: "wpseo_kill_blocking_files",
			_ajax_nonce: nonce,
		} ).done( function( response ) {
			var noticeContainer = jQuery( ".yoast-notice-blocking-files" ),
				noticeParagraph = jQuery( "#blocking_files" );

			noticeParagraph.html( response.data.message );
			// Make the notice focusable and move focue on it so screen readers will read out its content.
			noticeContainer.attr( "tabindex", "-1" ).focus();

			if ( response.success ) {
				noticeContainer.removeClass( "notice-error" ).addClass( "notice-success" );
			} else {
				noticeContainer.addClass( "yoast-blocking-files-error" );
			}
		} );
	}

	/**
	 * Copies the meta description for the homepage
	 */
	function wpseoCopyHomeMeta() {
		jQuery( "#og_frontpage_desc" ).val( jQuery( "#meta_description" ).val() );
	}

	/**
	 * Makes sure we store the action hash so we can return to the right hash
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
	 * When the hash changes, get the base url from the action and then add the current hash
	 */
	jQuery( document ).on( "ready", wpseoSetTabHash );

	/**
	 * Add a Facebook admin for via AJAX.
	 */
	function wpseo_add_fb_admin() {
		var target_form = jQuery( "#TB_ajaxContent" );

		jQuery.post(
			ajaxurl,
			{
				_wpnonce: target_form.find( "input[name=fb_admin_nonce]" ).val(),
				admin_name: target_form.find( "input[name=fb_admin_name]" ).val(),
				admin_id: target_form.find( "input[name=fb_admin_id]" ).val(),
				action: "wpseo_add_fb_admin",
			},
			function( response ) {
				var resp = jQuery.parseJSON( response );

				target_form.find( "p.notice" ).remove();

				switch ( resp.success ) {
					case 1:

						target_form.find( "input[type=text]" ).val( "" );

						jQuery( "#user_admin" ).append( resp.html );
						jQuery( "#connected_fb_admins" ).show();
						tb_remove();
						break;
					case 0 :
						target_form.find( ".form-wrap" ).prepend( resp.html );
						break;
				}
			}
		);
	}

	/**
	 * Adds select2 for selected fields.
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
		jQuery( "#post_types-post-maintax" ).select2( {
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
	 */
	function setInitialActiveTab() {
		var activeTabId = window.location.hash.replace( "#top#", "" );
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
	window.wpseoKillBlockingFiles = wpseoKillBlockingFiles;
	window.wpseoCopyHomeMeta = wpseoCopyHomeMeta;
	window.wpseo_add_fb_admin = wpseo_add_fb_admin;
	window.wpseoSetTabHash = wpseoSetTabHash;

	jQuery( document ).ready( function() {

		initializeAlgoliaSearch();

		// Toggle the XML sitemap section.
		jQuery( "#enablexmlsitemap" ).change( function() {
			jQuery( "#sitemapinfo" ).toggle( jQuery( this ).is( ":checked" ) );
		} ).change();

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

		// Toggle the Format-based archives section.
		jQuery( "#disable-post_format" ).change( function() {
			jQuery( "#post_format-titles-metas" ).toggle( jQuery( this ).is( ":not(:checked)" ) );
		} ).change();

		// Toggle the Breadcrumbs section.
		jQuery( "#breadcrumbs-enable" ).change( function() {
			jQuery( "#breadcrumbsinfo" ).toggle( jQuery( this ).is( ":checked" ) );
		} ).change();

		// Toggle the Author / user sitemap section.
		jQuery( "#disable_author_sitemap" ).find( "input:radio" ).change( function() {
			if ( jQuery( this ).is( ":checked" ) ) {
				jQuery( "#xml_user_block" ).toggle( jQuery( this ).val() === "off" );
			}
		} ).change();

		// Toggle the Redirect ugly URLs to clean permalinks section.
		jQuery( "#cleanpermalinks" ).change( function() {
			jQuery( "#cleanpermalinksdiv" ).toggle( jQuery( this ).is( ":checked" ) );
		} ).change();

		// Handle the settings pages tabs.
		jQuery( "#wpseo-tabs" ).find( "a" ).click( function() {
			jQuery( "#wpseo-tabs" ).find( "a" ).removeClass( "nav-tab-active" );
			jQuery( ".wpseotab" ).removeClass( "active" );

			var id = jQuery( this ).attr( "id" ).replace( "-tab", "" );
			jQuery( "#" + id ).addClass( "active" );
			jQuery( this ).addClass( "nav-tab-active" );
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
		jQuery( ".template" ).change( function() {
			wpseoDetectWrongVariables( jQuery( this ) );
		} ).change();

		// XML sitemaps "Fix it" button.
		jQuery( "#blocking_files .button" ).on( "click", function() {
			wpseoKillBlockingFiles( jQuery( this ).data( "nonce" ) );
		} );

		// Prevent form submission when pressing Enter on the switch-toggles.
		jQuery( ".switch-yoast-seo input" ).on( "keydown", function( event ) {
			if ( "keydown" === event.type && 13 === event.which ) {
				event.preventDefault();
			}
		} );

		setInitialActiveTab();
		initSelect2();
	} );
}() );
