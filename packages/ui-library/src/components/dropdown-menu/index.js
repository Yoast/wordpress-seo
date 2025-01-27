import { DotsVerticalIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Button } from "../../index";

/**
 * The button Item for the dropdown menu.
 *
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
 *
 * @param {JSX.node} children Content of the menu.
 * @param {JSX.node} [menuButtonContent] Content of the menu button.
 * @param {string} [className] CSS class.
 * @returns
 */
export const DropdownMenu = ( { children, menuTrigger, screenReaderTriggerLabel = "Open menu", className } ) => {
	return (
		<Menu as="div" className={ classNames( "yst-dropdown-menu", className ) }>
			{ menuTrigger
				? <Menu.Button { ...menuTrigger } />
				: <Menu.Button className={ "yst-dropdown-menu__button" }>
					<DotsVerticalIcon
						className="yst-h-4 hover:yst-text-slate-600"
					/>
					<span className="yst-sr-only">{ screenReaderTriggerLabel }</span>
				</Menu.Button> }
			<Transition
				as={ Fragment }
				enter="yst-transition yst-ease-out yst-duration-100"
				enterFrom="yst-transform yst-opacity-0 yst-cale-95"
				enterTo="yst-transform yst-opacity-100 yst-scale-100"
				leave="yst-transition yst-ease-in yst-duration-75"
				leaveFrom="yst-transform yst-opacity-100 yst-scale-100"
				leaveTo="yst-transform yst-opacity-0 yst-scale-95"
			>
				<Menu.Items className="yst-dropdown-menu__list">
					{ children }
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

DropdownMenu.propTypes = {
	children: PropTypes.node.isRequired,
	menuTrigger: PropTypes.node,
	screenReaderTriggerLabel: PropTypes.string,
	className: PropTypes.string,
};

DropdownMenu.Item = Menu.Item;
DropdownMenu.Item.displayName = "DropdownMenu.Item";

DropdownMenu.ButtonItem = MenuButtonItem;
DropdownMenu.ButtonItem.displayName = "DropdownMenu.ButtonItem";

DropdownMenu.displayName = "DropdownMenu";
