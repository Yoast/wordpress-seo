import SocialMetadata from "../../containers/SocialMetadata";
import Portal from "./Portal";

/**
 * Renders a portal for the social metadata settings in an editor.
 *
 * @param {Object} props Component props.
 * @param {string} props.target A target element ID in which to render the portal.
 *
 * @returns {wp.Element} The social metadata collapsibles.
 */
export default function SocialMetadataPortal( { target } ) {
	return (
		<Portal target={ target }>
			<SocialMetadata />
		</Portal>
	);
}
