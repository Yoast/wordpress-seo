import PropTypes from "prop-types";
import React from "react";
import { Collapsible } from "./collapsible";
import { List } from "./list";

/**
 * @param {string} label The label.
 * @param {JSX.Element} [icon] Optional icon to put before the label.
 * @param {JSX.node} [children] Optional sub menu.
 * @param {boolean} [defaultOpen] Whether the sub menu starts opened.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The element.
 */
const MenuItem = ( { label, icon: Icon = null, children = null, defaultOpen = true, ...props } ) => {
	return (
		<Collapsible label={ label } icon={ Icon } defaultOpen={ defaultOpen } { ...props }>
			<List isIndented={ true }>
				{ children }
			</List>
		</Collapsible>
	);
};

MenuItem.propTypes = {
	label: PropTypes.string.isRequired,
	icon: PropTypes.elementType,
	defaultOpen: PropTypes.bool,
	children: PropTypes.node,
};

export default MenuItem;
