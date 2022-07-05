import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { Link, useToggleState } from "@yoast/ui-library";
import classNames from "classnames";
import PropTypes from "prop-types";

const MenuItem = ( { label, icon: Icon = null, children = null, defaultOpen = true } ) => {
	const [ isOpen, toggleOpen ] = useToggleState( defaultOpen );
	const ChevronIcon = isOpen ? ChevronUpIcon : ChevronDownIcon;

	return (
		<div>
			<button
				className="yst-group yst-flex yst-w-full yst-items-center yst-justify-between yst-text-sm yst-font-medium yst-text-gray-800 yst-rounded-md yst-no-underline yst-px-3 yst-py-2 yst-mb-1 hover:yst-text-gray-900 hover:yst-bg-gray-50 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-primary-500"
				onClick={ toggleOpen }
			>
			<span className="yst-flex yst-items-center">
				{ Icon && <Icon className="yst-flex-shrink-0 yst--ml-1 yst-mr-3 yst-h-6 yst-w-6 yst-text-gray-400 group-hover:yst-text-gray-500" /> }
				{ label }
			</span>
				<ChevronIcon className="yst-h-5 yst-w-5 yst-text-gray-400 group-hover:yst-text-gray-500" />
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
	subItems: PropTypes.array,
	defaultOpen: PropTypes.bool,
	children: PropTypes.node,
};

const SubmenuItem = ( { children, label, isActive = false, ...props } ) => (
	<li>
		<Link
			className={ classNames(
				"yst-group yst-flex yst-items-center yst-px-3 yst-py-2 yst-text-sm yst-font-medium yst-rounded-md hover:yst-text-gray-900 hover:yst-bg-gray-50 yst-no-underline",
				isActive ? "yst-bg-gray-200 yst-text-gray-900" : "yst-text-gray-600",
			) }
			{ ...props }
		>
			{ label || children }
		</Link>
	</li>
);

SubmenuItem.propTypes = {
	children: PropTypes.node,
	label: PropTypes.node,
	isActive: PropTypes.bool,
};

const SidebarNavigation = ( { activePath = "", children } ) => <nav>{ children }</nav>;

SidebarNavigation.propTypes = {
	activePath: PropTypes.string,
	children: PropTypes.node.isRequired,
};

SidebarNavigation.MenuItem = MenuItem;
SidebarNavigation.SubmenuItem = SubmenuItem;

export default SidebarNavigation;
