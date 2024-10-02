import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { useNavigationContext } from "./index";

/**
 * @param {JSX.ElementClass} [as="a"] The component.
 * @param {string} [pathProp="href"] The key of the path in the props.
 * @param {JSX.node} [children] The content.
 * @param {string} [className] The classname.
 * @param {Function} [onClick] The click handler. We wrap this to close the mobile menu on click.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The element.
 */
export const Link = ( { as: Component = "a", pathProp = "href", children, className, onClick, ...props } ) => {
	const { activePath, setMobileMenuOpen } = useNavigationContext();

	const handleClick = useCallback( () => {
		setMobileMenuOpen( false );
		onClick?.();
	}, [ setMobileMenuOpen ] );

	return (
		<Component
			className={ classNames(
				"yst-sidebar-navigation__link yst-group",
				activePath === props?.[ pathProp ] && "yst-sidebar-navigation__item--active",
				className,
			) }
			aria-current={ activePath === props?.[ pathProp ] ? "page" : null }
			{ ...props }
			onClick={ handleClick }
		>
			{ children }
		</Component>
	);
};

Link.displayName = "SidebarNavigation.Link";
Link.propTypes = {
	as: PropTypes.elementType,
	pathProp: PropTypes.string,
	children: PropTypes.node,
	className: PropTypes.string,
	onClick: PropTypes.func,
};
