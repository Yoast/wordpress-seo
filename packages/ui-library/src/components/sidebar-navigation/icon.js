import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

/**
 * @param {JSX.ElementClass} [as="span"] The component.
 * @param {React.ReactNode} [children=null] The content.
 * @param {string} [className=""] The classname.
 * @param {...any} [props] Extra props.
 * @returns {JSX.Element} The element.
 */
export const Icon = ( { as: Component = "span", children = null, className = "", ...props } ) => {
	return (
		<Component
			className={ classNames( "yst-sidebar-navigation__icon", className ) }
			{ ...props }
		>
			{ children }
		</Component>
	);
};

Icon.displayName = "SidebarNavigation.Icon";
Icon.propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node,
	className: PropTypes.string,
};
