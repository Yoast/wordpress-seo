import { Root } from "@yoast/externals/contexts";
import { renderReactRoot } from "../../helpers/reactRoot";
import { RenderInPortalIfElementExists } from "../components/render-in-portal-if-element-exists";
import ElementorSlot from "../components/slots/ElementorSlot";
import ElementorFill from "../containers/ElementorFill";

const REACT_ELEMENT_ID = "yoast-elementor-react-tab";

/**
 * Renders the Yoast tab React content.
 *
 * By adding the YOAST_TAB_ID to the document, the RenderInPortalIfElementExists will pick it up and render the Yoast tab.
 *
 * @returns {void}
 */
export const renderYoastTabReactContent = () => {
	// Safety check, already rendered.
	if ( document.getElementById( REACT_ELEMENT_ID ) ) {
		return;
	}

	// Get the current tab/controls.
	const root = document.getElementById( "elementor-panel-page-settings-controls" );
	if ( ! root ) {
		return;
	}

	// Hide the Elementor control, we just fill the full contents of the tab.
	const control = root.querySelector( ".elementor-control-yoast-seo-section" );
	if ( control ) {
		control.style.display = "none";
	}

	// Create our Yoast tab inside, being picked up by the MutationObserver of RenderInPortalIfElementExists.
	const element = document.createElement( "div" );
	element.id = REACT_ELEMENT_ID;
	element.className = "yoast yoast-elementor-panel__fills";
	root.appendChild( element );
};

/**
 * Renders the Yoast React root.
 * @returns {void}
 */
export const renderYoastReactRoot = () => {
	const elementorSidebarContext = { locationContext: "elementor-sidebar" };
	const root = document.createElement( "div" );
	root.id = "yoast-elementor-react-root";
	document.body.appendChild( root );

	renderReactRoot( root.id, (
		<Root context={ elementorSidebarContext }>
			<RenderInPortalIfElementExists id={ REACT_ELEMENT_ID }>
				<ElementorSlot />
				<ElementorFill />
			</RenderInPortalIfElementExists>
		</Root>
	) );
};
