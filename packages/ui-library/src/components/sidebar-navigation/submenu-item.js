import PropTypes from "prop-types";
import React from "react";
import { Item } from "./item";
import { Link } from "./link";

/**
 * @param {JSX.node} label The label.
 * @param {JSX.ElementClass} [as] The field component.
 * @param {string} [pathProp] The key of the path in the props. Defaults to `href`.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The submenu item element.
 */
const SubmenuItem = ( { as = "a", pathProp = "href", label, ...props } ) => (
	<Item>
		<Link as={ as } pathProp={ pathProp } { ...props }>
			{ label }
		</Link>
	</Item>
);

SubmenuItem.propTypes = {
	as: PropTypes.elementType,
	pathProp: PropTypes.string,
	label: PropTypes.node.isRequired,
	isActive: PropTypes.bool,
};

export default SubmenuItem;
