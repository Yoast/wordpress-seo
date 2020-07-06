/* global wpseoAdminGlobalL10n, ajaxurl, wpseoScriptData */

import a11ySpeak from "a11y-speak";

/**
 * @summary Initializes the admin script.
 * @param {object} jQuery jQuery
 * @returns {void}
 */
export default function initAdmin( jQuery ) {
	/**
	 * Utility function to check whether the given element is fully visible withing the viewport.
	 *
	 * @returns {HTMLElement} Whether the element is fully visible in the viewport.
	 */
	jQuery.fn._wpseoIsInViewport = function() {
		const elementTop = jQuery( this ).offset().top;
		const elementBottom = elementTop + jQuery( this ).outerHeight();

		const viewportTop = jQuery( window ).scrollTop();
		const viewportBottom = viewportTop + jQuery( window ).height();

		return elementTop > viewportTop && elementBottom < viewportBottom;
	};

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
		} else if ( e.hasClass( "homepage-template" ) ) {
			wrongVariables = wrongVariables.concat(
				authorVariables, dateVariables, postVariables, specialVariables, taxonomyVariables, taxonomyPostVariables
			);
		} else if ( e.hasClass( "taxonomy-template" ) ) {
			wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, specialVariables );
		} else if ( e.hasClass( "author-template" ) ) {
			wrongVariables = wrongVariables.concat( postVariables, dateVariables, specialVariables, taxonomyVariables, taxonomyPostVariables );
		} else if ( e.hasClass( "date-template" ) ) {
			wrongVariables = wrongVariables.concat( authorVariables, postVariables, specialVariables, taxonomyVariables, taxonomyPostVariables );
		} else if ( e.hasClass( "search-template" ) ) {
			wrongVariables = wrongVariables.concat(
				authorVariables, dateVariables, postVariables, taxonomyVariables, taxonomyPostVariables, [ "term404" ]
			);
		} else if ( e.hasClass( "error404-template" ) ) {
			wrongVariables = wrongVariables.concat(
				authorVariables, dateVariables, postVariables, taxonomyVariables, taxonomyPostVariables, [ "searchphrase" ]
			);
		}
		jQuery.each( wrongVariables, function( index, variable ) {
			errorId = e.attr( "id" ) + "-" + variable + "-warning";
			// Disable reason: legacy code, will be removed at some point.
			/* eslint-disable no-negated-condition */
			if ( e.val().search( "%%" + variable + "%%" ) !== -1 ) {
				e.addClass( "wpseo-variable-warning-element" );
				var msg = wpseoAdminGlobalL10n.variable_warning.replace( "%s", "%%" + variable + "%%" );
				if ( jQuery( "#" + errorId ).length ) {
					jQuery( "#" + errorId ).html( msg );
				} else {
					e.after( ' <div id="' + errorId + '" class="wpseo-variable-warning">' + msg + "</div>" );
				}

				a11ySpeak( wpseoAdminGlobalL10n.variable_warning.replace( "%s", variable ), "assertive" );

				warn = true;
			} else {
				if ( jQuery( "#" + errorId ).length ) {
					jQuery( "#" + errorId ).remove();
				}
			}
			/* eslint-enable no-negated-condition */
		} );
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
		var select2Width = "300px";

		// Select2 for taxonomy breadcrumbs in Advanced
		jQuery( "#breadcrumbs select" ).select2( {
			width: select2Width,
			language: wpseoScriptData.userLanguageCode,
			dropdownCssClass: "yoast-select__dropdown",
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
		jQuery( "#" + activeTabId + "-tab" ).click();
	}

	/**
	 * Hides or shows the Author without posts toggle.
	 *
	 * @param {bool} visible Whether or not the authors without posts toggle should be visible.
	 *
	 * @returns {void}
	 */
	function setAuthorsWithoutPostsToggleVisibilty( visible ) {
		/**
		 * Get the container surrounding the toggle.
		 */
		const toggleContainer = jQuery( "#noindex-author-noposts-wpseo-container" );

		if ( visible ) {
			toggleContainer.show();
		} else {
			toggleContainer.hide();
		}
	}

	window.wpseoDetectWrongVariables = wpseoDetectWrongVariables;
	window.setWPOption = setWPOption;
	window.wpseoCopyHomeMeta = wpseoCopyHomeMeta;
	// eslint-disable-next-line
	window.wpseoSetTabHash = wpseoSetTabHash;

	/**
	 * Toggles the company and person detailled controls on/off.
	 *
	 * @returns {void}
	 */
	function togglePersonCompany() {
		if ( jQuery( "#company_or_person-company" ).is( ":checked" ) ) {
			jQuery( "#knowledge-graph-company" ).show();
			jQuery( "#knowledge-graph-person" ).hide();
			return;
		}

		if ( jQuery( "#company_or_person-person" ).is( ":checked" ) ) {
			jQuery( "#knowledge-graph-person" ).show();
			jQuery( "#knowledge-graph-company" ).hide();
			return;
		}

		jQuery( "#knowledge-graph-person" ).hide();
		jQuery( "#knowledge-graph-company" ).hide();
	}

	jQuery( document ).ready( function() {
		/**
		 * When the hash changes, get the base url from the action and then add the current hash.
		 */
		wpseoSetTabHash();

		jQuery( ".yoast-toggle--inactive" ).click( function() {
			jQuery( this ).parent().find( "input" ).prop( "checked", false ).change();
		} );

		jQuery( ".yoast-toggle--active" ).click( function() {
			jQuery( this ).parent().find( "input" ).prop( "checked", true ).change();
		} );

		// Toggle the Author archives section.
		jQuery( "#disable-author" ).change( function() {
			jQuery( "#author-archives-titles-metas-content" ).toggle( jQuery( this ).is( ":not(:checked)" ) );
		} ).change();

		const authorArchivesDisabled = jQuery( "#noindex-author-wpseo-off" );
		const authorArchivesEnabled  = jQuery( "#noindex-author-wpseo-on" );

		if ( ! authorArchivesDisabled.is( ":checked" ) ) {
			setAuthorsWithoutPostsToggleVisibilty( false );
		}

		// Disable Author archives without posts when Show author archives is toggled off.
		authorArchivesEnabled.change( () => {
			if ( ! jQuery( this ).is( ":checked" ) ) {
				setAuthorsWithoutPostsToggleVisibilty( false );
			}
		} );

		// Enable Author archives without posts when Show author archives is toggled on.
		authorArchivesDisabled.change( () => {
			if ( ! jQuery( this ).is( ":checked" ) ) {
				setAuthorsWithoutPostsToggleVisibilty( true );
			}
		} );

		// Toggle the Twitter card settings.
		jQuery( "#twitter" ).change( function() {
			jQuery( "#wpseo-twitter-settings" ).toggle( jQuery( this ).is( ":checked" ) );
		} ).change();

		// Toggle the Date archives section.
		jQuery( "#disable-date" ).change( function() {
			jQuery( "#date-archives-titles-metas-content" ).toggle( jQuery( this ).is( ":not(:checked)" ) );
		} ).change();

		// Toggle the Media section.
		jQuery( "#disable-attachment" ).change( function() {
			jQuery( "#media_settings" ).toggle( jQuery( this ).is( ":checked" ) );
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
		jQuery( ".yoast-tabs__list-item-link" ).click( function() {
			jQuery( ".yoast-tabs__list-item-link" ).closest( ".yoast-tabs__list-item" ).removeClass( "yoast-tabs__list-item--active" );
			jQuery( ".wpseotab" ).removeClass( "active" );

			var id = jQuery( this ).attr( "id" ).replace( "-tab", "" );
			var activeTab = jQuery( "#" + id );
			activeTab.addClass( "active" );
			jQuery( this ).closest( ".yoast-tabs__list-item" ).addClass( "yoast-tabs__list-item--active" );
			if ( activeTab.hasClass( "nosave" ) ) {
				jQuery( "#wpseo-submit-container" ).hide();
			} else {
				jQuery( "#wpseo-submit-container" ).show();
			}

			jQuery( window ).trigger( "yoast-seo-tab-change" );
		} );

		jQuery( "#company_or_person-company" ).change( togglePersonCompany );
		jQuery( "#company_or_person-person" ).change( togglePersonCompany ).change();

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
		jQuery( "body" ).on( "click", "button.toggleable-container-trigger", ( event ) => {
			const target = jQuery( event.currentTarget );
			const toggleableContainer = target.parent().siblings( ".toggleable-container" );

			toggleableContainer.toggleClass( "toggleable-container-hidden" );
			target
				.attr( "aria-expanded", ! toggleableContainer.hasClass( "toggleable-container-hidden" ) )
				.find( "span" ).toggleClass( "dashicons-arrow-up-alt2 dashicons-arrow-down-alt2" );
		} );

		const opengraphToggle = jQuery( "#opengraph" );
		const facebookSettingsContainer = jQuery( "#wpseo-opengraph-settings" );
		if ( opengraphToggle.length && facebookSettingsContainer.length ) {
			facebookSettingsContainer.toggle( opengraphToggle[ 0 ].checked );

			opengraphToggle.change( ( event ) => {
				facebookSettingsContainer.toggle( event.target.checked );
			} );
		}

		wpseoCopyHomeMeta();
		setInitialActiveTab();
		initSelect2();
	} );
}
