import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

/**
 * @param {JSX.ElementClass} [as="ul"] The component.
 * @param {JSX.node} [children] The content.
 * @param {boolean} [isIndented=false] Whether the list is indented.
 * @param {string} [className] The classname.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The element.
 */
export const List = ( { as: Component = "ul", children, isIndented = false, className, ...props } ) => {
	return (
		<Component
			role="list"
			className={ classNames(
				"yst-sidebar-navigation__list",
				isIndented && "yst-sidebar-navigation__list--indented",
				className,
			) }
			{ ...props }
		>
			{ children }
		</Component>
	);
};

List.displayName = "SidebarNavigation.List";
List.propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node,
	isIndented: PropTypes.bool,
	className: PropTypes.string,
};
