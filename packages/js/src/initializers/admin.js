/* global wpseoAdminGlobalL10n, ajaxurl, wpseoScriptData, ClipboardJS */

import a11ySpeak from "a11y-speak";
import { debounce } from "lodash-es";
import LoginPopup from "../helpers/loginPopup";
import { getAuthorizationUrl, authenticate, trackAllKeyphrases } from "../helpers/wincherEndpoints";

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
			jQuery( "#open_graph_frontpage_desc" ).val( jQuery( "#meta_description" ).val() );
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

		// Select2 for Twitter card meta data in Settings
		jQuery( "#twitter_card_type" ).select2( {
			width: select2Width,
			language: wpseoScriptData.userLanguageCode,
		} );

		// Select2 for taxonomy breadcrumbs in Advanced
		jQuery( "#breadcrumbs select" ).select2( {
			width: select2Width,
			language: wpseoScriptData.userLanguageCode,
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
		jQuery( "#" + activeTabId + "-tab" ).addClass( "nav-tab-active" ).trigger( "click" );
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

	/**
	 * Add a resize and scroll listener and determine whether the fixed submit button should be shown.
	 *
	 * @returns {void}
	 */
	function setFixedSubmitButtonVisibility() {
		const floatContainer = jQuery( "#wpseo-submit-container-float" );
		const fixedContainer = jQuery( "#wpseo-submit-container-fixed" );

		if ( ! floatContainer.length || ! fixedContainer.length ) {
			return;
		}

		/**
		 * Hides the fixed button at the bottom of the viewport if the submit button at the bottom of the page is visible.
		 *
		 * @returns {void}
		 */
		function onViewportChange() {
			if ( floatContainer._wpseoIsInViewport() ) {
				fixedContainer.hide();
			} else {
				fixedContainer.show();
			}
		}

		jQuery( window ).on( "resize scroll", debounce( onViewportChange, 100 ) );
		jQuery( window ).on( "yoast-seo-tab-change", onViewportChange );

		const messages = jQuery( ".wpseo-message" );
		if ( messages.length ) {
			window.setTimeout( () => {
				messages.fadeOut();
			}, 5000 );
		}

		onViewportChange();
	}

	/**
	 * Toggles a warning under the xml sitemap feature toggle when it is disabled.
	 *
	 * @returns {void}
	 */
	function initXmlSitemapsWarning() {
		const radioButtons = jQuery( "#enable_xml_sitemap input[type=radio]" );

		if ( ! radioButtons.length ) {
			return;
		}

		const xmlSitemapWarning = jQuery( "#yoast-seo-sitemaps-disabled-warning" );

		jQuery( "#enable_xml_sitemap input[type=radio]" ).on( "change", function() {
			if ( this.value === "off" ) {
				xmlSitemapWarning.show();
			} else {
				xmlSitemapWarning.hide();
			}
		} );
	}

	/**
	 * Initializes the Copy to clipboard button for the Zapier API Key.
	 *
	 * @returns {void}
	 */
	function initCopyZapierKeyToClipboard() {
		if ( typeof ClipboardJS !== "undefined" ) {
			const copyZapierKeyToClipboard = new ClipboardJS( "#copy-zapier-api-key" );

			/**
			 * Copies the Zapier API Key to the clipboard.
			 *
			 * @param {MouseEvent} event The click event on the Copy button.
			 *
			 * @return {void}
			 */
			copyZapierKeyToClipboard.on( "success", function( event ) {
				// Clear the selection and move focus back to the trigger.
				event.clearSelection();
				// Handle ClipboardJS focus bug, see https://github.com/zenorocha/clipboard.js/issues/680
				jQuery( event.trigger ).trigger( "focus" );
			} );
		}
	}

	// Variable to store the popup reference in.
	let wincherPopup = null;

	/**
	 * Performs the adding of exisitng keywords to Wincher request.
	 *
	 * @returns {void}
	 */
	async function addExistingKeyphrasesRequest() {
		jQuery( "#wincher-track-all-keyohrases-success, #wincher-track-all-keyohrases-error" ).hide();

		const data = await trackAllKeyphrases();

		if ( data.status === 201 ) {
			jQuery( "#wincher-track-all-keyphrases-success" ).show();
		}

		if ( data.status === 400 ) {
			jQuery( "#wincher-track-all-limit" ).text( data.results.limit );
			jQuery( "#wincher-track-all-keyphrases-error" ).show();
		}

		if ( data.status === 403 || data.status === 404 ) {
			jQuery( "#wincher-website-error" ).show();
		}
	}

	/**
	 * Get the tokens using the provided code after user has granted authorization.
	 *
	 * @param {Object} data The message data.
	 *
	 * @returns {void}
	 */
	async function performAuthenticationRequest( data ) {
		const response = await authenticate( data );

		if ( response.status !== 200 ) {
			return;
		}

		const popup = wincherPopup.getPopup();

		if ( popup ) {
			popup.close();
		}

		jQuery( "#wincher-login-success" ).show();
		// We need to set the value so that it's not reset on save.
		jQuery( "#hidden_wincher_website_id" ).val( data.websiteId );

		await addExistingKeyphrasesRequest();
	}

	/**
	 * Fires when the user wants to connect to Wincher.
	 *
	 * @returns {void}
	 */
	async function onConnect() {
		if ( wincherPopup && ! wincherPopup.isClosed() ) {
			wincherPopup.focus();
			return;
		}

		const { url } = await getAuthorizationUrl();

		wincherPopup = new LoginPopup(
			url,
			{
				success: {
					type: "wincher:oauth:success",
					callback: async( data ) => await performAuthenticationRequest( data ),
				},
				error: {
					type: "wincher:oauth:error",
					callback: () => {},
				},
			},
			{
				title: "Wincher_login",
				width: 500,
				height: 700,
			}
		);

		wincherPopup.createPopup();
	}

	/**
	 * Adds the existing keyphrases to Wincher.
	 *
	 * @returns {void}
	 */
	async function addExistingKeyphrasesToWincher() {
		// Check if we're logged in first.
		if ( ! wpseoAdminGlobalL10n.wincher_is_logged_in ) {
			onConnect();

			return;
		}

		await addExistingKeyphrasesRequest();
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
		jQuery( "#disable-author input[type='radio']" ).on( "change", function() {
			// The value on is disabled, off is enabled.
			if ( jQuery( this ).is( ":checked" ) ) {
				jQuery( "#author-archives-titles-metas-content" ).toggle( jQuery( this ).val() === "off" );
			}
		} ).trigger( "change" );

		const authorArchivesDisabled = jQuery( "#noindex-author-wpseo-off" );
		const authorArchivesEnabled  = jQuery( "#noindex-author-wpseo-on" );

		if ( ! authorArchivesDisabled.is( ":checked" ) ) {
			setAuthorsWithoutPostsToggleVisibilty( false );
		}

		// Disable Author archives without posts when Show author archives is toggled off.
		authorArchivesEnabled.on( "change", () => {
			if ( ! jQuery( this ).is( ":checked" ) ) {
				setAuthorsWithoutPostsToggleVisibilty( false );
			}
		} );

		// Enable Author archives without posts when Show author archives is toggled on.
		authorArchivesDisabled.on( "change", () => {
			if ( ! jQuery( this ).is( ":checked" ) ) {
				setAuthorsWithoutPostsToggleVisibilty( true );
			}
		} );

		// Toggle the Date archives section.
		jQuery( "#disable-date input[type='radio']" ).on( "change", function() {
			// The value on is disabled, off is enabled.
			if ( jQuery( this ).is( ":checked" ) ) {
				jQuery( "#date-archives-titles-metas-content" ).toggle( jQuery( this ).val() === "off" );
			}
		} ).trigger( "change" );

		// Toggle the Media section.
		jQuery( "#disable-attachment input[type='radio']" ).on( "change", function() {
			// The value on is disabled, off is enabled.
			if ( jQuery( this ).is( ":checked" ) ) {
				jQuery( "#media_settings" ).toggle( jQuery( this ).val() === "off" );
			}
		} ).trigger( "change" );

		// Toggle the Format-based archives section.
		jQuery( "#disable-post_format" ).on( "change", function() {
			jQuery( "#post_format-titles-metas" ).toggle( jQuery( this ).is( ":not(:checked)" ) );
		} ).trigger( "change" );

		// Toggle the Zapier connection section.
		jQuery( "#zapier_integration_active input[type='radio']" ).on( "change", function() {
			// The value on is enabled, off is disabled.
			if ( jQuery( this ).is( ":checked" ) ) {
				jQuery( "#zapier-connection" ).toggle( jQuery( this ).val() === "on" );
			}
		} ).trigger( "change" );

		// Toggle the Wincher section.
		jQuery( "#wincher_integration_active input[type='radio']" ).change( function() {
			// The value on is enabled, off is disabled.
			if ( jQuery( this ).is( ":checked" ) ) {
				jQuery( "#wincher-connection" ).toggle( jQuery( this ).val() === "on" );
			}
		} ).change();

		// Handle the settings pages tabs.
		jQuery( "#wpseo-tabs" ).find( "a" ).on( "click", function() {
			jQuery( "#wpseo-tabs" ).find( "a" ).removeClass( "nav-tab-active" );
			jQuery( ".wpseotab" ).removeClass( "active" );

			var id = jQuery( this ).attr( "id" ).replace( "-tab", "" );
			var activeTab = jQuery( "#" + id );
			activeTab.addClass( "active" );
			jQuery( this ).addClass( "nav-tab-active" );
			if ( activeTab.hasClass( "nosave" ) ) {
				jQuery( "#wpseo-submit-container" ).hide();
			} else {
				jQuery( "#wpseo-submit-container" ).show();
			}

			jQuery( window ).trigger( "yoast-seo-tab-change" );
		} );

		// Handle the Company or Person select.
		jQuery( "#company_or_person" ).on( "change", function() {
			var companyOrPerson = jQuery( this ).val();
			if ( "company" === companyOrPerson ) {
				jQuery( "#knowledge-graph-company" ).show();
				jQuery( "#knowledge-graph-person" ).hide();
			} else if ( "person" === companyOrPerson ) {
				jQuery( "#knowledge-graph-company" ).hide();
				jQuery( "#knowledge-graph-person" ).show();
			} else {
				jQuery( "#knowledge-graph-company" ).hide();
				jQuery( "#knowledge-graph-person" ).hide();
			}
		} ).trigger( "change" );

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

		jQuery( "#wincher-track-all-keyphrases" ).on( "click", ( event ) => {
			event.preventDefault();

			addExistingKeyphrasesToWincher();
		} );

		jQuery( "#wincher-track-all-website-error-link" ).on( "click", ( event ) => {
			event.preventDefault();

			onConnect();
		} );

		const opengraphToggle = jQuery( "#opengraph" );
		const facebookSettingsContainer = jQuery( "#wpseo-opengraph-settings" );
		if ( opengraphToggle.length && facebookSettingsContainer.length ) {
			facebookSettingsContainer.toggle( opengraphToggle[ 0 ].checked );

			opengraphToggle.on( "change", ( event ) => {
				facebookSettingsContainer.toggle( event.target.checked );
			} );
		}

		wpseoCopyHomeMeta();
		setInitialActiveTab();
		initSelect2();
		initXmlSitemapsWarning();
		// Should be called after the initial active tab has been set.
		setFixedSubmitButtonVisibility();
		initCopyZapierKeyToClipboard();
	} );
}
