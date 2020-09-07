import { SlotFillProvider } from "@wordpress/components";
import { createRef, Fragment, render } from "@wordpress/element";
import getL10nObject from "../analysis/getL10nObject";
import ElementorSlot from "../components/slots/ElementorSlot";
import ElementorFill from "../containers/ElementorFill";
import { RegisteredComponentsContainer } from "../helpers/classicEditor";

const registeredComponents = [];
let containerRef = null;

/**
 * Initializes the Yoast elementor editor integration.
 *
 * @param {object} store The Yoast editor store.
 *
 * @returns {void}
 */
export default function initElementorEditorIntegration( store ) {
	const localizedData = getL10nObject();
	containerRef = createRef();

	const theme = {
		isRtl: localizedData.isRtl,
	};

	render(
		(
			<SlotFillProvider>
				<Fragment>
					<ElementorSlot store={ store } theme={ theme } />
					<ElementorFill />
					<RegisteredComponentsContainer ref={ containerRef } />
				</Fragment>
			</SlotFillProvider>
		),
		document.getElementById( "wpseo-metabox-root" ),
	);

	registeredComponents.forEach( ( registered ) => {
		containerRef.current.registerComponent( registered.key, registered.Component );
	} );
}
