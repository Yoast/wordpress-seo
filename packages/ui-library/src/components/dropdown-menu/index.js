import { DotsVerticalIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Button } from "../../index";

/**
 * The button Item for the dropdown menu.
 *
 * @param {JSX.node} children Content of the button.
 * @param {string} [className] CSS class.
 *
 * @returns {JSX.Element} Button component.
 */
const MenuButtonItem = ( { children, className, ...props } ) => {
	return (
		<Menu.Item
			as={ Button }
			variant="tertiary"
			{ ...props }
			className={ classNames( "yst-dropdown-menu__item yst-dropdown-menu__item--button",
				className ) }
		>
			{ children }

		</Menu.Item>
	);
};

MenuButtonItem.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * Dropdown menu icon trigger.
 *
 * @param {string} [className] CSS class.
 * @param {string} [screenReaderTriggerLabel] Screen reader label.
 * @param {JSX.node} [Icon] Icon component.
 *
 * @returns {JSX.Element} Menu trigger component.
 */
const DropdownMenuIconTrigger = ( { className, screenReaderTriggerLabel = "Open menu", Icon = DotsVerticalIcon, ...props } ) => (
	<Menu.Button className={ classNames( "yst-dropdown-menu__icon-trigger", className ) } { ...props }>
		{ ( { open } ) => <>
			<Icon
				className={ classNames( "yst-h-4 hover:yst-text-slate-600",
					open ? "yst-text-slate-600" : "",
				) }
			/>
			<span className="yst-sr-only">{ screenReaderTriggerLabel }</span>
		</> }
	</Menu.Button>
);

DropdownMenuIconTrigger.propTypes = {
	className: PropTypes.string,
	screenReaderTriggerLabel: PropTypes.string,
	Icon: PropTypes.node,
};

/**
 * Dropdown menu list.
 *
 * @param {JSX.node} children Content of the menu.
 *
 * @returns {JSX.Element} Menu component.
 */
const DropdownMenuList = ( { children, className } ) => {
	return (
		<Transition
			as={ Fragment }
			enter="yst-transition yst-ease-out yst-duration-100"
			enterFrom="yst-transform yst-opacity-0 yst-cale-95"
			enterTo="yst-transform yst-opacity-100 yst-scale-100"
			leave="yst-transition yst-ease-in yst-duration-75"
			leaveFrom="yst-transform yst-opacity-100 yst-scale-100"
			leaveTo="yst-transform yst-opacity-0 yst-scale-95"
		>
			<Menu.Items className={ classNames( "yst-dropdown-menu__list", className ) }>
				{ children }
			</Menu.Items>
		</Transition>
	);
};

DropdownMenuList.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 *
 * @param {JSX.node} children Content of the menu.
 * @param {string} [className] CSS class.
 * @returns
 */
export const DropdownMenu = ( { children, className } ) => {
	return (
		<Menu as="div" className={ classNames( "yst-dropdown-menu", className ) }>
			{ children }
		</Menu>
	);
};

DropdownMenu.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

DropdownMenu.Item = Menu.Item;
DropdownMenu.Item.displayName = "DropdownMenu.Item";

DropdownMenu.ButtonItem = MenuButtonItem;
DropdownMenu.ButtonItem.displayName = "DropdownMenu.ButtonItem";

DropdownMenu.IconTrigger = DropdownMenuIconTrigger;
DropdownMenu.IconTrigger.displayName = "DropdownMenu.IconTrigger";

DropdownMenu.Trigger = Menu.Button;
DropdownMenu.Trigger.displayName = "DropdownMenu.Trigger";

DropdownMenu.List = DropdownMenuList;
DropdownMenu.List.displayName = "DropdownMenu.List";

DropdownMenu.displayName = "DropdownMenu";
