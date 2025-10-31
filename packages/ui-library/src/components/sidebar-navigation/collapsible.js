import { ChevronDownIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { useCallback, useEffect } from "react";
import { useToggleState } from "../../hooks";
import { Icon } from "./icon";
import { useNavigationContext } from "./index";

/**
 * @param {JSX.ElementClass} [as="div"] The component.
 * @param {string} label The label.
 * @param {JSX.ElementClass?} [icon=null] Optional icon to put before the label.
 * @param {React.ReactNode} [children=null] The content.
 * @param {boolean} [defaultOpen=true] Whether the sub menu starts opened.
 * @param {string} id The id.
 * @param {...any} [props] Extra props.
 * @returns {JSX.Element} The element.
 */
export const Collapsible = ( {
	as: Component = "div",
	label,
	icon = null,
	children = null,
	defaultOpen = true,
	id,
	...props
} ) => {
	const [ isOpen, toggleOpen, , setOpen ] = useToggleState( defaultOpen );
	const { history, addToHistory, removeFromHistory } = useNavigationContext();
	const handleClick = useCallback( () => {
		toggleOpen();
		isOpen ? removeFromHistory( id ) : addToHistory( id );
	}, [ toggleOpen, id, isOpen, addToHistory, removeFromHistory ] );

	useEffect( () => {
		history.includes( id );
		if ( history.includes( id ) ) {
			setOpen();
		}
	}, [ history, id, setOpen ] );

	return (
		<Component className="yst-sidebar-navigation__collapsible">
			<button
				type="button"
				className="yst-sidebar-navigation__collapsible-button yst-group"
				onClick={ handleClick }
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
	id: PropTypes.string.isRequired,
};
