import { DotsVerticalIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Button } from "../../index";

/**
 * The item for the dropdown menu that renders as ui library Button with tertiary variant.
 *
 * @param {JSX.node} children Content of the button.
 * @param {string} [className=""] CSS class.
 * @param {...any} [props] Additional props.
 *
 * @returns {JSX.Element} Button item component.
 */
const ButtonItem = ( { children, className = "", ...props } ) => {
	return (
		<Menu.Item>
			{ ( { active } ) => (
				<Button
					variant="tertiary"
					{ ...props }
					className={ classNames( "yst-dropdown-menu__item--button",
						active ? "yst-bg-slate-100" : "",
						className ) }
				>{ children }</Button>
			) }
		</Menu.Item>
	);
};

ButtonItem.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 * Dropdown menu icon trigger.
 *
 * @param {string} [className=""] CSS class.
 * @param {string} [screenReaderTriggerLabel] Screen reader label for the menu trigger.
 * @param {React.ComponentType} [Icon=DotsVerticalIcon] Icon component.
 * @param {...any} [props] Additional props.
 *
 * @returns {JSX.Element} Menu trigger component.
 */
const IconTrigger = ( { className = "", screenReaderTriggerLabel, Icon = DotsVerticalIcon, ...props } ) => (
	<Menu.Button { ...props } className={ classNames( "yst-dropdown-menu__icon-trigger", className ) }>
		{ ( { open } ) => <>
			<Icon
				className={ classNames( "yst-h-6 yst-w-6 hover:yst-text-slate-600",
					open ? "yst-text-slate-600" : "",
				) }
			/>
			<span className="yst-sr-only">{ screenReaderTriggerLabel }</span>
		</> }
	</Menu.Button>
);

IconTrigger.propTypes = {
	className: PropTypes.string,
	screenReaderTriggerLabel: PropTypes.string.isRequired,
	Icon: PropTypes.node,
};

/**
 * Dropdown menu list.
 *
 * @param {JSX.node} children Content of the menu.
 * @param {string} [className=""] CSS class.
 * @param {...any} [props] Additional props.
 *
 * @returns {JSX.Element} Menu list component.
 */
const List = ( { children, className = "", ...props } ) => {
	return (
		<Transition
			as={ Fragment }
			enter="yst-transition yst-ease-out yst-duration-100"
			enterFrom="yst-transform yst-opacity-0 yst-scale-95"
			enterTo="yst-transform yst-opacity-100 yst-scale-100"
			leave="yst-transition yst-ease-in yst-duration-75"
			leaveFrom="yst-transform yst-opacity-100 yst-scale-100"
			leaveTo="yst-transform yst-opacity-0 yst-scale-95"
		>
			<Menu.Items { ...props } className={ classNames( "yst-dropdown-menu__list", className ) }>
				{ children }
			</Menu.Items>
		</Transition>
	);
};

List.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

/**
 *
 * @param {JSX.node} children Content of the menu.
 * @param {object} props The menu props.
 *
 * @returns {JSX.Element} Dropdown menu component.
 */
export const DropdownMenu = ( { children, ...props } ) => {
	return (
		<Menu { ...props }>
			{ children }
		</Menu>
	);
};

DropdownMenu.propTypes = {
	children: PropTypes.node.isRequired,
};

DropdownMenu.Item = Menu.Item;
DropdownMenu.Item.displayName = "DropdownMenu.Item";

DropdownMenu.ButtonItem = ButtonItem;
DropdownMenu.ButtonItem.displayName = "DropdownMenu.ButtonItem";

DropdownMenu.IconTrigger = IconTrigger;
DropdownMenu.IconTrigger.displayName = "DropdownMenu.IconTrigger";

DropdownMenu.Trigger = Menu.Button;
DropdownMenu.Trigger.displayName = "DropdownMenu.Trigger";

DropdownMenu.List = List;
DropdownMenu.List.displayName = "DropdownMenu.List";

DropdownMenu.displayName = "DropdownMenu";
