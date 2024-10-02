import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

/**
 * Represents a Menu Item.
 *
 * @param {JSX.ElementClass} [as="li"] The component.
 * @param {JSX.node} [children] The content.
 * @param {string} [className] The classname.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The menu.
 */
export const Item = ( { as: Component = "li", children, className, ...props } ) => {
	return (
		<Component
			className={ classNames( "yst-sidebar-navigation__item", className ) }
			{ ...props }
		>
			{ children }
		</Component>
	);
};

Item.displayName = "SidebarNavigation.Item";
Item.propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node,
	className: PropTypes.string,
};
