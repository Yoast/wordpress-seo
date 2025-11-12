import { __ } from "@wordpress/i18n";
import { registerElementorDataHookAfter } from "../helpers/hooks";
import { isFormId } from "../helpers/is-form-id";
import { YoastPanelView } from "../components/YoastPanelView";

const TAB = {
	id: "yoast-seo-tab",
	title: __( "Yoast SEO", "wordpress-seo-premium" ),
};

const ELEMENTS_PANEL = "panel/elements";
export const REACT_PANEL_ELEMENT_ID = "yoast-elementor-react-panel";
const ELEMENTOR_ELEMENTS_NAVIGATION_ID = "elementor-panel-elements-navigation";
const ELEMENTOR_ELEMENTS_CONTENT_ID = "elementor-panel-elements-search-area";
const YOAST_PANEL_CONTENT_CLASS = "yoast yoast-elementor-panel__content";

/**
 * Shows the Yoast analysis menu in the Elementor Elements panel.
 *
 * @returns {void}
 */
export const showYoastPanelAnalysis = () => {
	// Find or create the content container.
	let contentContainer = document.getElementById( REACT_PANEL_ELEMENT_ID );

	if ( ! contentContainer ) {
		// Find the Elements navigation container.
		const elementsNavigation = document.getElementById( ELEMENTOR_ELEMENTS_NAVIGATION_ID );
		if ( ! elementsNavigation ) {
			return;
		}

		// Create the Yoast content container after the navigation.
		contentContainer = document.createElement( "div" );
		contentContainer.id = REACT_PANEL_ELEMENT_ID;
		contentContainer.className = YOAST_PANEL_CONTENT_CLASS;

		// Insert it after the navigation.
		elementsNavigation.parentNode.insertBefore( contentContainer, elementsNavigation.nextSibling );
	}

	// Show the Yoast content.
	contentContainer.style.display = "block";

	// Hide the default elements content.
	const elementsContent = document.getElementById( ELEMENTOR_ELEMENTS_CONTENT_ID );
	if ( elementsContent ) {
		elementsContent.style.display = "none";
	}
};

/**
 * Adds the Yoast SEO tab button to the Elements panel navigation.
 *
 * @returns {void}
 */
const addYoastTabToElementsNavigation = () => {
	const panelElements = window.$e.components.get( ELEMENTS_PANEL );
	if ( ! panelElements.hasTab( TAB.id ) ) {
		panelElements.addTab( TAB.id, { title: TAB.title } );
	}
};

/**
 * Registers the Elementor region for the Yoast panel.
 *
 * @param {Object} regions - The regions object.
 * @returns {Object} The modified regions object.
 */
const ElementorAddRegion = ( regions ) => {
	regions[ TAB.id ] = {
		region: regions.global.region,
		view: YoastPanelView,
		options: {},
	};
	return regions;
};

/**
 * Initializes the Yoast SEO tab in the Elements panel navigation.
 *
 * @returns {void}
 */
export const initializePanel = () => {
	/**
	 * Register the Yoast tab when the Elementor document is loaded.
	 * But only if the document ID matches our form ID.
	 */
	registerElementorDataHookAfter(
		"editor/documents/load",
		"yoast-seo/add-elements-tab",
		addYoastTabToElementsNavigation,
		( { config } ) => isFormId( config.id )
	);

	// Register the region filter.
	window.elementor.hooks.addFilter(
		"panel/elements/regionViews",
		ElementorAddRegion
	);

	// Handle route changes to show Yoast content.
	if ( window.$e && window.$e.routes ) {
		window.$e.routes.on( "run:after", ( command, route ) => {
			if ( route === `${ ELEMENTS_PANEL }/${ TAB.id }` ) {
				showYoastPanelAnalysis();
			}
		} );
	}

	// Also try to add the tab immediately if Elementor is already loaded.
	addYoastTabToElementsNavigation();
};
