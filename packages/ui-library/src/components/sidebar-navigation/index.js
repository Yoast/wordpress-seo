import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { createContext, useContext } from "@wordpress/element";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useToggleState } from "../../hooks";

const SidebarNavigationContext = createContext( { activePath: "" } );

/**
 * @returns {Object} The sidebar navigation context.
 */
const useSidebarNavigationContext = () => useContext( SidebarNavigationContext );

/**
 * @param {string} label The label.
 * @param {JSX.Element} [icon] Optional icon to put before the label.
 * @param {JSX.node} [children] Optional sub menu.
 * @param {boolean} [defaultOpen] Whether the sub menu starts opened.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The menu item element.
 */
const MenuItem = ( { label, icon: Icon = null, children = null, defaultOpen = true, ...props } ) => {
	const [ isOpen, toggleOpen ] = useToggleState( defaultOpen );
	const ChevronIcon = isOpen ? ChevronUpIcon : ChevronDownIcon;

	return (
		<div>
			<button
				className="yst-group yst-flex yst-w-full yst-items-center yst-justify-between yst-text-sm yst-font-medium yst-text-gray-800 yst-rounded-md yst-no-underline yst-px-3 yst-py-2 yst-mb-1 hover:yst-text-gray-900 hover:yst-bg-gray-50 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-primary-500"
				onClick={ toggleOpen }
				{ ...props }
			>
				<span className="yst-flex yst-items-center">
					{ Icon && <Icon className="yst-flex-shrink-0 yst--ml-1 yst-mr-3 yst-h-6 yst-w-6 yst-text-gray-400 group-hover:yst-text-gray-500" /> }
					{ label }
				</span>
				<ChevronIcon className="yst-h-4 yst-w-4 yst-text-gray-400 group-hover:yst-text-gray-500 yst-stroke-3" />
			</button>
			{ isOpen && children && <ul className="yst-ml-8 yst-space-y-1">
				{ children }
			</ul> }
		</div>
	);
};

MenuItem.propTypes = {
	label: PropTypes.string.isRequired,
	icon: PropTypes.elementType,
	defaultOpen: PropTypes.bool,
	children: PropTypes.node,
};

/**
 * @param {string} label The label.
 * @param {JSX.ElementClass} [as] The field component.
 * @param {string} [pathProp] The key of the path in the props. Defaults to `href`.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The submenu item element.
 */
const SubmenuItem = ( { as: Component = "a", pathProp = "href", label, ...props } ) => {
	const { activePath } = useSidebarNavigationContext();

	return (
		<li>
			<Component
				className={ classNames(
					"yst-group yst-flex yst-items-center yst-px-3 yst-py-2 yst-text-sm yst-font-medium yst-rounded-md hover:yst-text-gray-900 hover:yst-bg-gray-50 yst-no-underline focus:yst-outline-none",
					activePath === props[ pathProp ] ? "yst-bg-gray-200 yst-text-gray-900" : "yst-text-gray-600",
				) }
				{ ...props }
			>
				{ label }
			</Component>
		</li>
	);
};

SubmenuItem.propTypes = {
	as: PropTypes.elementType,
	pathProp: PropTypes.string,
	label: PropTypes.node.isRequired,
	isActive: PropTypes.bool,
};

/**
 * @param {string} activePath The path of the active menu item.
 * @param {JSX.node} children The menu items.
 * @returns {JSX.Element} The sidebar navigation element.
 */
const SidebarNavigation = ( { activePath = "", children } ) => (
	<SidebarNavigationContext.Provider value={ { activePath } }>
		<nav className="yst-space-y-6">{ children }</nav>
	</SidebarNavigationContext.Provider>
);

SidebarNavigation.propTypes = {
	activePath: PropTypes.string,
	children: PropTypes.node.isRequired,
};

SidebarNavigation.MenuItem = MenuItem;
SidebarNavigation.SubmenuItem = SubmenuItem;

export default SidebarNavigation;
