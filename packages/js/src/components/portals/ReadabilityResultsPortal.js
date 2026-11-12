import Portal from "./Portal";

/**
 * Renders a portal for the readability results in the editor.
 *
 * @param {Object} props Component props.
 * @param {string} props.target A target element ID in which to render the portal.
 * @param {wp.Element} props.children The child components.
 *
 * @returns {null|wp.Element} The element.
 */
export default function ReadabilityResultsPortal( { target, children } ) {
	return (
		<Portal target={ target }>
			{ children }
		</Portal>
	);
}
