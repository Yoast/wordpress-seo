/* Browser:true */
import createCustomEvent from "../helpers/createCustomEvent";

/**
 * @summary Initializes the metabox tabs script.
 * @param {object} jQuery jQuery
 * @returns {void}
 */
export default function initTabs( jQuery ) {
	/**
	 * Focuses and triggers a click on a tab element.
	 *
	 * @param {object} tab The tab DOM element.
	 *
	 * @returns {void}
	 */
	function wpseoAriaTabFocusAndClick( tab ) {
		if ( ! tab ) {
			return;
		}

		// The tab is a DOM element: no need for jQuery methods.
		tab.focus();
		tab.click();
	}

	/**
	 * Sets all the tabs to be not focusable and semantically not selected.
	 *
	 * @param {object} tabs The tabs jQuery collection.
	 *
	 * @returns {void}
	 */
	function wpseoDeactivateAriaTabs( tabs ) {
		tabs
			.attr( {
				"aria-selected": "false",
				tabIndex: "-1",
			} );
	}

	/**
	 * Sets a single tab to be focusable and semantically selected.
	 *
	 * @param {object} tab  The tab to activate DOM element.
	 * @param {object} tabs The tabs jQuery collection.
	 *
	 * @returns {void}
	 */
	function wpseoAriaTabSetActiveAttributes( tab, tabs ) {
		if ( ! tab ) {
			return;
		}

		wpseoDeactivateAriaTabs( tabs );

		// The tab is a DOM element: no need for jQuery methods.
		tab.removeAttribute( "tabindex" );
		tab.setAttribute( "aria-selected", "true" );
	}

	/* eslint-disable complexity */
	/**
	 * Switch tabs in the ARIA tabbed interface.
	 *
	 * @param {object} event       jQuery event object.
	 * @param {object} tabs        The tabs as a jQuery collection.
	 *
	 * @returns {void}
	 */
	function wpseoAriaTabsSwitch( event, tabs ) {
		const key   = event.which;
		const index = tabs.index( jQuery( event.target ) );

		switch ( key ) {
			// Space bar: Activate current targeted tab.
			case 32: {
				event.preventDefault();
				wpseoAriaTabFocusAndClick( tabs[ index ] );
				break;
			}
			// End key: Activate last tab.
			case 35: {
				event.preventDefault();
				wpseoAriaTabFocusAndClick( tabs[ tabs.length - 1 ] );
				break;
			}
			// Home key: Activate first tab.
			case 36: {
				event.preventDefault();
				wpseoAriaTabFocusAndClick( tabs[ 0 ] );
				break;
			}
			// Left and up keys: Activate previous tab.
			case 37:
			case 38: {
				event.preventDefault();
				const indexForPreviousTab = ( index - 1 ) < 0 ? tabs.length - 1 : index - 1;
				wpseoAriaTabFocusAndClick( tabs[ indexForPreviousTab ] );
				break;
			}
			// Right and down keys: Activate next tab.
			case 39:
			case 40: {
				event.preventDefault();
				const indexForNextTab = ( index + 1 ) === tabs.length ? 0 : index + 1;
				wpseoAriaTabFocusAndClick( tabs[ indexForNextTab ] );
				break;
			}
		}
	}
	/* eslint-enable complexity */

	/**
	 * Initializes the ARIA tabbed interface.
	 *
	 * @returns {void}
	 */
	function wpseoAriaTabsInit() {
		const tablist     = jQuery( ".yoast-aria-tabs" );
		const tabs        = tablist.find( "[role='tab']" );
		const orientation = tablist.attr( "aria-orientation" ) || "horizontal";

		// Set up initial attributes.
		tabs.attr( {
			"aria-selected": false,
			tabIndex: "-1",
		} );
		// Set up the initially active tab.
		tabs.filter( ".yoast-active-tab" )
			.removeAttr( "tabindex" )
			.attr( "aria-selected", "true" );

		tabs.on( "keydown", function( event ) {
			// Return if not Spacebar, End, Home, or Arrow keys.
			if ( [ 32, 35, 36, 37, 38, 39, 40 ].indexOf( event.which ) === -1 ) {
				return;
			}

			// Make Up and Down arrow keys do nothing with horizontal tabs.
			if ( orientation === "horizontal" && [ 38, 40 ].indexOf( event.which ) !== -1 ) {
				return;
			}

			// Make Left and Right arrow keys do nothing with vertical tabs.
			if ( orientation === "vertical" && [ 37, 39 ].indexOf( event.which ) !== -1 ) {
				return;
			}

			wpseoAriaTabsSwitch( event, tabs );
		} );
	}

	/**
	 * Initializes the meta box tabs, adds event handlers, and manages the tabs visibility.
	 *
	 * @returns {void}
	 */
	function wpseoInitTabs() {
		// When there's only one add-on tab, change its link to a span element.
		var addonsTabsLinks = jQuery( "#wpseo-meta-section-addons .wpseo_tablink" );
		if ( addonsTabsLinks.length === 1 ) {
			addonsTabsLinks.replaceWith( "<span class='" + addonsTabsLinks[ 0 ].className + "'>" + addonsTabsLinks.text() + "</span>" );
		}

		// Tabs within the main tabs, e.g.: Facebook, Twitter, Video, and News.
		if ( jQuery( ".wpseo-metabox-tabs-div" ).length > 0 ) {
			jQuery( ".wpseo-metabox-tabs" )
				.on( "click", "a.wpseo_tablink", function( ev ) {
					ev.preventDefault();

					jQuery( ".wpseo-meta-section.active .wpseo-metabox-tabs li" ).removeClass( "active" );
					jQuery( ".wpseo-meta-section.active .wpseotab" ).removeClass( "active" );

					var targetElem = jQuery( jQuery( this ).attr( "href" ) );
					targetElem.addClass( "active" );
					jQuery( this ).parent( "li" ).addClass( "active" );

					// Not used at the moment.
					if ( jQuery( this ).hasClass( "scroll" ) ) {
						jQuery( "html, body" ).animate( {
							scrollTop: jQuery( targetElem ).offset().top,
						}, 500 );
					}
				} );
		}

		// Main tabs.
		if ( jQuery( ".wpseo-meta-section" ).length > 0 ) {
			const tabLinks = jQuery( ".wpseo-meta-section-link" );

			// Set active classes on the SEO tab.
			jQuery( ".wpseo-metabox-menu li" ).filter( function() {
				return jQuery( this ).find( ".wpseo-meta-section-link" ).attr( "href" ) === "#wpseo-meta-section-content";
			} )
				.addClass( "active" )
				.find( "[role='tab']" ).addClass( "yoast-active-tab" );


			// Set active classes on the SEO panel.
			jQuery( "#wpseo-meta-section-content, .wpseo-meta-section-react" ).addClass( "active" );

			tabLinks
				.on( "click", function( ev ) {
					var tabId = jQuery( this ).attr( "id" ),
						targetTab = jQuery( this ).attr( "href" ),
						targetTabElement = jQuery( targetTab );

					ev.preventDefault();

					jQuery( ".wpseo-metabox-menu li" )
						.removeClass( "active" )
						.find( "[role='tab']" ).removeClass( "yoast-active-tab" );
					jQuery( ".wpseo-meta-section" ).removeClass( "active" );
					jQuery( ".wpseo-meta-section-react.active" ).removeClass( "active" );

					if ( targetTab === "#wpseo-meta-section-content" ) {
						jQuery( ".wpseo-meta-section-react" ).addClass( "active" );
					}

					targetTabElement.addClass( "active" );

					jQuery( this ).parent( "li" )
						.addClass( "active" )
						.find( "[role='tab']" ).addClass( "yoast-active-tab" );

					// Dispatch custom vanilla JS meta tab change event for usage in non jQuery code.
					const metaSectionTabChangeEvent = createCustomEvent( "YoastSEO:metaTabChange", { metaTabId: tabId } );
					window.dispatchEvent( metaSectionTabChangeEvent );

					// Make the clicked tab focusable and set it to aria-selected=true.
					wpseoAriaTabSetActiveAttributes( this, tabLinks );
				} );
		}

		jQuery( ".wpseo-metabox-tabs" ).show();
		// End Tabs code.
	}

	window.wpseoInitTabs = wpseoInitTabs;
	/* eslint-disable-next-line camelcase */
	window.wpseo_init_tabs = wpseoInitTabs;

	// Set up the first tab and panel within the main tabs.
	jQuery( ".wpseo-meta-section" ).each( function( index, el ) {
		jQuery( el ).find( ".wpseo-metabox-tabs li:first" ).addClass( "active" );
		jQuery( el ).find( ".wpseotab:first" ).addClass( "active" );
	} );

	// Initialize both the main tabs and the tabs within the main tabs.
	window.wpseo_init_tabs();

	wpseoAriaTabsInit();
}
