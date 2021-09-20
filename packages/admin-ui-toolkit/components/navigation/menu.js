import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { noop } from "lodash";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

/**
 * Menu item component.
 *
 * @param {Object} props The props object.
 * @param {string} props.item The navigation item object.
 * @param {boolean} props.item.isDefaultOpen Whether the menu item is open by default.
 * @param {function} props.handleClose Callback to close.
 *
 * @returns {Component} MenuItem component.
 */
const MenuItem = ( { item: { key, label, icon: Icon, children, isDefaultOpen }, handleClose } ) => {
	return (
		<Disclosure as="div" defaultOpen={ isDefaultOpen }>
			{ ( { open } ) => (
				<>
					<Disclosure.Button
						key={ key + "-button" }
						className="yst-flex yst-items-center yst-w-full yst-px-3 yst-py-2 yst-mb-1 yst-text-sm yst-font-medium yst-text-gray-800 yst-no-underline yst-rounded-md yst-group hover:yst-text-gray-900 hover:yst-bg-gray-50 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-indigo-500 active:yst-bg-gray-50 active:yst-text-gray-800"
					>
						{ Icon && (
							<Icon
								className="yst-w-6 yst-h-6 yst--ml-1 yst-mr-3 yst-text-gray-400 group-hover:yst-text-gray-500"
								aria-hidden="true"
							/>
						) }
						{ label }
						<ChevronDownIcon
							className={ classNames(
								open ? "yst-text-gray-400 yst-transform yst-rotate-180" : "yst-text-gray-300",
								"yst-ml-auto yst-w-5 yst-h-5 yst-text-gray-400 group-hover:yst-text-gray-500",
							) }
							aria-hidden="true"
						/>
					</Disclosure.Button>
					<Disclosure.Panel
						key={ key + "-panel" }
						className="yst-outline-none yst-ml-8 yst-space-y-1"
						as="ul"
					>
						{ children.map( ( subItem ) => {
							return <li key={ subItem.key }>
								<NavLink
									onClick={ handleClose }
									to={ `/${ subItem.target }` }
									activeClassName="yst-bg-gray-200 yst-text-gray-900"
									className="focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-indigo-500 yst-flex yst-items-center yst-px-3 yst-py-2 yst-text-sm yst-font-medium yst-no-underline yst-rounded-md yst-group hover:yst-text-gray-900 hover:yst-bg-gray-50 yst-text-gray-600"
									aria-current="page"
								>
									{ subItem.label }
								</NavLink>
							</li>;
						} ) }
					</Disclosure.Panel>
				</>
			) }
		</Disclosure>
	);
};

MenuItem.propTypes = {
	item: PropTypes.shape( {
		key: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		icon: PropTypes.elementType.isRequired,
		children: PropTypes.array.isRequired,
		isDefaultOpen: PropTypes.bool,
	} ).isRequired,
	handleClose: PropTypes.func.isRequired,
};

/**
 * The Menu component.
 *
 * @param {Object[]} menu An array of menu items.
 * @param {function} handleClose Callback to close.
 *
 * @returns {JSX.Element} The Menu component.
 */
export default function Menu( { menu, handleClose } ) {
	return (
		<nav className="yst-space-y-6">
			{ menu.map( ( item ) => {
				// Don't add the menu item if it has no children.
				if ( item.children.length === 0 ) {
					return null;
				}
				return <MenuItem key={ item.key } item={ item } handleClose={ handleClose } />;
			} ) }
		</nav>
	);
}

Menu.propTypes = {
	menu: PropTypes.array.isRequired,
	handleClose: PropTypes.func,
};

Menu.defaultProps = {
	handleClose: noop,
};
