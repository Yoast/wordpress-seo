import { withSelect } from "@wordpress/data";
import PropTypes from "prop-types";
import ElementorFill from "../../containers/ElementorFill";
import ElementorSlot from "../slots/ElementorSlot";
import Portal from "./Portal";

/**
 * Renders the metabox portal.
 *
 * @param {string} target A target element ID in which to render the portal.
 *
 * @returns {null|wp.Element} The element.
 */
const ElementorPortal = ( { target } ) => (
	<Portal target={ target }>
		<ElementorSlot />
		<ElementorFill />
	</Portal>
);

ElementorPortal.propTypes = {
	target: PropTypes.string,
};

ElementorPortal.defaultProps = {
	target: "",
};

export default withSelect( ( select ) => {
	const { getElementorTarget } = select( "yoast-seo/editor" );

	return {
		target: getElementorTarget(),
	};
} )( ElementorPortal );
