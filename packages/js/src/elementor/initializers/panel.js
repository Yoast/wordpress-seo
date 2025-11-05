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
	let currentObserver = null;
	let lastNavigationElement = null;

	// Watch for changes to the navigation and re-add if needed
	const createObserver = () => {
		return new MutationObserver( () => {
			// Debounce to avoid excessive re-adding
			if ( debounceTimeout ) {
				clearTimeout( debounceTimeout );
			}
			debounceTimeout = setTimeout( () => {
				addYoastTabToElementsNavigation();
			}, 50 );
		} );
	};

	// Also use polling as a fallback to ensure tab persists
	const pollForTab = () => {
		const elementsNavigation = document.getElementById( "elementor-panel-elements-navigation" );
		if ( elementsNavigation ) {
			// Check if the navigation element has changed (been recreated)
			if ( elementsNavigation !== lastNavigationElement ) {
				// Disconnect old observer if it exists
				if ( currentObserver ) {
					currentObserver.disconnect();
				}

				// Create and attach new observer to the new element
				currentObserver = createObserver();
				currentObserver.observe( elementsNavigation, {
					childList: true,
					subtree: false,
				} );
				lastNavigationElement = elementsNavigation;
			}

			const existingTab = elementsNavigation.querySelector( `[data-tab="${ TAB.id }"]` );
			if ( ! existingTab ) {
				addYoastTabToElementsNavigation();
			}
		}
	};

	// Poll every 50ms to ensure tab stays visible
	setInterval( pollForTab, 50 );

	// Start observing once the navigation is available
	const checkNavigation = () => {
		const elementsNavigation = document.getElementById( "elementor-panel-elements-navigation" );
		if ( elementsNavigation ) {
			// Add the tab immediately once navigation is found
			addYoastTabToElementsNavigation();

			// Then start observing for future changes
			currentObserver = createObserver();
			currentObserver.observe( elementsNavigation, {
				childList: true,
				subtree: false,
			} );
			lastNavigationElement = elementsNavigation;
		} else {
			setTimeout( checkNavigation, 100 );
		}
	};

	checkNavigation();
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
