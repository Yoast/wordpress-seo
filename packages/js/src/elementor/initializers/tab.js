/* globals $e, elementor */
import { reduce } from "lodash";
import { registerElementorDataHookAfter } from "../helpers/hooks";
import { isFormId } from "../helpers/is-form-id";
import { renderYoastTabReactContent } from "./render-sidebar";

const TAB = {
	// If changing this id, also change it in the CSS.
	id: "yoast-seo-tab",
	title: "Yoast SEO",
};

const PAGE_SETTINGS = "panel/page-settings";

/**
 * Registers the Yoast tab to Elementor' page settings.
 *
 * This is an alternative to the PHP side registration.
 * This way we can verify the document ID matches our form ID before we add the tab.
 * As is done in the `editor/documents/load` hook' conditions.
 *
 * @returns {void}
 */
const registerYoastTab = () => {
	const { settings } = elementor.documents.getCurrent().config;

	// The tab configuration determines the tabs, including the tab order (even though it is an object).
	if ( ! settings.tabs[ TAB.id ] ) {
		settings.tabs = reduce( settings.tabs, ( tabs, title, id ) => {
			tabs[ id ] = title;
			if ( id === "settings" ) {
				// Insert our tab after the settings.
				tabs[ TAB.id ] = TAB.title;
			}
			return tabs;
		}, {} );
	}

	// The page settings component needs the tab too. Internally, this registers the route.
	if ( ! $e.components.get( PAGE_SETTINGS ).hasTab( TAB.id ) ) {
		$e.components.get( PAGE_SETTINGS ).addTab( TAB.id, { title: TAB.title } );
	}
};

/**
 * Adds a way to navigate to the Yoast tab from the Elementor settings panel.
 *
 * Note: this menu seems to no longer be reachable in the editor V2.
 *
 * @link https://developers.elementor.com/docs/editor/menu-panel/#extending-the-menu-panel
 *
 * @returns {void}
 */
const addLinkInMoreMenu = () => {
	elementor.getPanelView().getPages( "menu" ).view.addItem( {
		name: "yoast",
		icon: "yoast yoast-element-menu-icon",
		title: TAB.title,
		type: "page",
		callback: () => {
			try {
				$e.route( `${ PAGE_SETTINGS }/${ TAB.id }` );
			} catch ( error ) {
				// Note: this seems no longer needed with the "run:after" route listener.
				$e.route( `${ PAGE_SETTINGS }/settings` );
				$e.route( `${ PAGE_SETTINGS }/${ TAB.id }` );
			}
		},
	}, "more" );
};

/**
 * Initializes the Yoast tab.
 * @returns {void}
 */
export const initializeTab = () => {
	/**
	 * Register the Yoast tab when the Elementor document is loaded.
	 * But only if the document ID matches our form ID.
	 */
	registerElementorDataHookAfter(
		"editor/documents/load",
		"yoast-seo/register-tab",
		registerYoastTab,
		( { config } ) => isFormId( config.id )
	);

	/**
	 * Renders the Yoast tab React content when on the tab route.
	 */
	$e.routes.on( "run:after", ( command, route ) => {
		if ( route === `${ PAGE_SETTINGS }/${ TAB.id }` ) {
			renderYoastTabReactContent();
		}
	} );

	/**
	 * Create the tab on the initial page load.
	 * The "editor/documents/load" hook does not seem to run yet on the initial load.
	 * We could use elementor.on( "document:loaded" ), but that seems to be moved away from.
	 */
	registerYoastTab();

	// Adds a link in the more menu of the Elementor settings panel (route: `panel/menu` route).
	addLinkInMoreMenu();
};
