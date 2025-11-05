// eslint-disable-next-line no-unused-vars
/* globals elementor, $e*/
import { registerElementorDataHookAfter } from "../helpers/hooks";
import { isFormId } from "../helpers/is-form-id";

const TAB = {
	id: "yoast-seo-tab",
	title: "Yoast SEO",
};

const PAGE_SETTINGS = "panel/page-settings";

/**
 * Creates and returns a Yoast SEO tab button element.
 *
 * @returns {HTMLElement} The tab button element.
 */
const createTabButton = () => {
	const tabButton = document.createElement( "div" );
	tabButton.className = "elementor-component-tab elementor-panel-navigation-tab";
	tabButton.setAttribute( "data-tab", TAB.id );
	tabButton.textContent = TAB.title;

	// Add click handler to route to the Yoast tab
	tabButton.addEventListener( "click", ( e ) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			// Route to the Yoast SEO tab in Page/Post Settings
			$e.route( `${ PAGE_SETTINGS }/${ TAB.id }` );
		} catch ( error ) {
			// Fallback: try the double route approach
			try {
				$e.route( `${ PAGE_SETTINGS }/settings` );
				setTimeout( () => {
					$e.route( `${ PAGE_SETTINGS }/${ TAB.id }` );
				}, 50 );
			} catch ( fallbackError ) {
				console.error( "Yoast SEO: Could not route to tab:", fallbackError );
			}
		}
	} );

	return tabButton;
};

/**
 * Adds the Yoast SEO tab button to the Elements panel navigation.
 *
 * @returns {void}
 */
const addYoastTabToElementsNavigation = () => {
	const elementsNavigation = document.getElementById( "elementor-panel-elements-navigation" );
	if ( ! elementsNavigation ) {
		return;
	}

	// Check if already added
	if ( elementsNavigation.querySelector( `[data-tab="${ TAB.id }"]` ) ) {
		return;
	}

	// Create and append the tab button
	const tabButton = createTabButton();
	elementsNavigation.appendChild( tabButton );
};

/**
 * Sets up a watcher to re-add the tab if it's removed.
 *
 * @returns {void}
 */
const setupNavigationWatcher = () => {
	let debounceTimeout = null;

	/**
	 * Handles navigation changes with minimal debounce for instant response.
	 */
	const handleNavigationChange = () => {
		if ( debounceTimeout ) {
			clearTimeout( debounceTimeout );
		}
		// Very short debounce (5ms) to prevent rapid-fire while feeling instant
		debounceTimeout = setTimeout( () => {
			addYoastTabToElementsNavigation();
		}, 5 );
	};

	/**
	 * Observes the panel content wrapper to catch navigation recreation.
	 */
	const observePanelContent = () => {
		const panelContent = document.getElementById( "elementor-panel-content-wrapper" );
		if ( ! panelContent ) {
			setTimeout( observePanelContent, 100 );
			return;
		}

		// Observer watches the entire panel for navigation changes
		// eslint-disable-next-line complexity
		const observer = new MutationObserver( ( mutations ) => {
			for ( const mutation of mutations ) {
				// Check if navigation element was added (recreated)
				if ( mutation.addedNodes.length > 0 ) {
					for ( const node of mutation.addedNodes ) {
						if ( node.id === "elementor-panel-elements-navigation" ||
							 ( node.querySelector && node.querySelector( "#elementor-panel-elements-navigation" ) ) ) {
							handleNavigationChange();
							return;
						}
					}
				}
				// Check if navigation's children were modified
				if ( mutation.target.id === "elementor-panel-elements-navigation" ) {
					handleNavigationChange();
					return;
				}
			}
		} );

		// Watch entire panel subtree for any changes
		observer.observe( panelContent, {
			childList: true,
			subtree: true,
		} );

		// Add tab immediately on initialization
		addYoastTabToElementsNavigation();
	};

	observePanelContent();
};

/**
 * Initializes the Yoast SEO tab in the Elements panel navigation.
 *
 * @returns {void}
 */
export const initializePanel = () => {
	/**
	 * Set up the navigation watcher when the Elementor document is loaded.
	 * But only if the document ID matches our form ID.
	 */
	registerElementorDataHookAfter(
		"editor/documents/load",
		"yoast-seo/add-elements-tab",
		setupNavigationWatcher,
		( { config } ) => isFormId( config.id )
	);

	/**
	 * Set up the watcher on the initial page load.
	 */
	setupNavigationWatcher();
};
