// eslint-disable-next-line no-unused-vars
/* globals elementor, $e*/
import { registerElementorDataHookAfter } from "../helpers/hooks";
import { isFormId } from "../helpers/is-form-id";

const TAB = {
	id: "yoast-seo-tab",
	title: "Yoast SEO",
};

const REACT_PANEL_ELEMENT_ID = "yoast-elementor-react-panel";

/**
 * Shows the Yoast analysis menu in the Elementor elements panel.
 *
 * @returns {void}
 */
const showYoastPanelAnalysis = () => {
	// Find or create the content container
	let contentContainer = document.getElementById( REACT_PANEL_ELEMENT_ID );

	if ( ! contentContainer ) {
		// Find the elements navigation container
		const elementsNavigation = document.getElementById( "elementor-panel-elements-navigation" );
		if ( ! elementsNavigation ) {
			return;
		}

		// Create the Yoast content container after the navigation
		contentContainer = document.createElement( "div" );
		contentContainer.id = REACT_PANEL_ELEMENT_ID;
		contentContainer.className = "yoast yoast-elementor-panel__content";

		// Insert it after the navigation
		elementsNavigation.parentNode.insertBefore( contentContainer, elementsNavigation.nextSibling );
	}

	// Show the Yoast content
	contentContainer.style.display = "block";

	// Hide the default elements content
	const elementsContent = document.getElementById( "elementor-panel-elements-search-area" );
	if ( elementsContent ) {
		elementsContent.style.display = "none";
	}
};

/**
 * Hides the Yoast panel content and shows the default Elements content.
 *
 * @returns {void}
 */
const hideYoastPanelContent = () => {
	const contentContainer = document.getElementById( REACT_PANEL_ELEMENT_ID );
	if ( contentContainer ) {
		contentContainer.style.display = "none";
	}

	// Show the default elements content
	const elementsContent = document.getElementById( "elementor-panel-elements-search-area" );
	if ( elementsContent ) {
		elementsContent.style.display = "block";
	}
};

/**
 * Creates and returns a Yoast SEO tab button element.
 *
 * @returns {HTMLElement} The tab button element.
 */
const createTabButton = () => {
	const tabButton = document.createElement( "button" );
	tabButton.className = "elementor-component-tab elementor-panel-navigation-tab";
	tabButton.setAttribute( "data-tab", TAB.id );
	tabButton.textContent = TAB.title;

	// Add click handler to show embedded content
	tabButton.addEventListener( "click", ( e ) => {
		e.preventDefault();
		e.stopPropagation();

		// Remove active class from all tabs
		const allTabs = document.querySelectorAll( ".elementor-panel-navigation-tab" );
		allTabs.forEach( tab => tab.classList.remove( "elementor-active" ) );

		// Add active class to Yoast tab
		tabButton.classList.add( "elementor-active" );

		// Show the Yoast content
		showYoastPanelAnalysis();
	} );

	return tabButton;
};

/**
 * Sets up click handlers for other tabs to hide Yoast content.
 *
 * @returns {void}
 */
const setupOtherTabsListeners = () => {
	const elementsNavigation = document.getElementById( "elementor-panel-elements-navigation" );
	if ( ! elementsNavigation ) {
		return;
	}

	// Find all other tabs (not Yoast)
	const otherTabs = elementsNavigation.querySelectorAll( `.elementor-panel-navigation-tab:not([data-tab="${ TAB.id }"])` );

	otherTabs.forEach( tab => {
		// Remove existing listener if any
		tab.removeEventListener( "click", hideYoastPanelContent );
		// Add listener to hide Yoast content when another tab is clicked
		tab.addEventListener( "click", hideYoastPanelContent );
	} );
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

	// Set up listeners for other tabs
	setupOtherTabsListeners();
};

/**
 * Sets up a watcher to re-add the tab if it's removed.
 * (Elementor recreates the navigation on certain actions.)
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
		// Very short debounce (5ms) to prevent redundant calls
		debounceTimeout = setTimeout( () => {
			addYoastTabToElementsNavigation();
		}, 5 );
	};

	/**
	 * Observes the panel content wrapper to catch navigation changes.
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
