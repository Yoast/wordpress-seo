import { ChevronDownIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useToggleState } from "../../hooks";
import { Icon } from "./icon";

/**
 * @param {JSX.ElementClass} [as="div"] The component.
 * @param {string} label The label.
 * @param {JSX.ElementClass} [icon] Optional icon to put before the label.
 * @param {JSX.node} [children] The content.
 * @param {boolean} [defaultOpen] Whether the sub menu starts opened.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The element.
 */
export const Collapsible = ( { as: Component = "div", label, icon, children, defaultOpen = true, ...props } ) => {
	const [ isOpen, toggleOpen ] = useToggleState( defaultOpen );

	return (
		<Component className="yst-sidebar-navigation__collapsible">
			<button
				type="button"
				className="yst-sidebar-navigation__collapsible-button yst-group"
				onClick={ toggleOpen }
				aria-expanded={ isOpen }
				{ ...props }
			>
				{ icon && <Icon as={ icon } className="yst-h-6 yst-w-6" /> }
				{ label }
				<Icon
					as={ ChevronDownIcon }
					className={ classNames(
						"yst-ms-auto yst-h-4 yst-w-4 yst-stroke-3",
						isOpen && "yst-rotate-180",
					) }
				/>
			</button>
			{ isOpen && children }
		</Component>
	);
};

Collapsible.displayName = "SidebarNavigation.Collapsible";
Collapsible.propTypes = {
	as: PropTypes.elementType,
	icon: PropTypes.elementType,
	label: PropTypes.string.isRequired,
	defaultOpen: PropTypes.bool,
	children: PropTypes.node,
};
