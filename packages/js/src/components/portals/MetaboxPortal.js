import MetaboxSlot from "../slots/MetaboxSlot";
import MetaboxFill from "../../containers/MetaboxFill";
import Portal from "./Portal";

/**
 * Renders the metabox portal.
 *
 * @param {Object} props Component props.
 * @param {string} props.target A target element ID in which to render the portal.
 * @param {Object} props.store The Redux store.
 * @param {Object} props.theme The theme to use.
 *
 * @returns {JSX.Element} The element.
 */
export default function MetaboxPortal( { target, store, theme } ) {
	return (
		<Portal target={ target }>
			<MetaboxSlot store={ store } theme={ theme } />
			<MetaboxFill store={ store } theme={ theme } />
		</Portal>
	);
}
