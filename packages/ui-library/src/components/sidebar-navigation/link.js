import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { useNavigationContext } from "./index";

/**
 * @param {JSX.ElementClass} [as="a"] The component.
 * @param {string} [pathProp="href"] The key of the path in the props.
 * @param {?JSX.node} [children=null] The content.
 * @param {string} [className] The classname.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The element.
 */
export const Link = ( { as: Component = "a", pathProp = "href", children = null, className, ...props } ) => {
	const { activePath, setMobileMenuOpen } = useNavigationContext();

	const handleClick = useCallback( () => {
		setMobileMenuOpen( false );
		// eslint-disable-next-line react/prop-types
		if ( typeof props?.onClick === "function" ) {
			// eslint-disable-next-line react/prop-types
			props.onClick();
		}
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
};
