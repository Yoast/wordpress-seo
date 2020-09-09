import { SlotFillProvider } from "@wordpress/components";
import { createRef, Fragment, render } from "@wordpress/element";
import getL10nObject from "../analysis/getL10nObject";
import ElementorFill from "../containers/ElementorFill";
import TopLevelProviders from "../components/TopLevelProviders";
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
				<TopLevelProviders store={ store } theme={ theme } location="sidebar">
					<Fragment>
						<ElementorFill />
						<RegisteredComponentsContainer ref={ containerRef } />
					</Fragment>
				</TopLevelProviders>
			</SlotFillProvider>
		),
		document.getElementById( "wpseo-react-root" ),
	);

	registeredComponents.forEach( ( registered ) => {
		containerRef.current.registerComponent( registered.key, registered.Component );
	} );
}
