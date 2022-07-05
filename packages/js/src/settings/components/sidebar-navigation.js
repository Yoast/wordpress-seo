import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { Link } from "@yoast/ui-library";
import PropTypes from "prop-types";
// FIXME the hooks import should be: import { useToggleState } from "@yoast/ui-library/hooks";
import { useToggleState } from "../../../../ui-library/build/hooks";
import { ReactComponent as Logo } from "./yoast-logo.svg";

const MenuItem = ( { label, icon: Icon = null, subItems = [], defaultOpen = true } ) => {
	const [ isOpen, toggleOpen ] = useToggleState( defaultOpen );
	const MenuIcon = isOpen ? ChevronUpIcon : ChevronDownIcon;

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
				<MenuIcon className="yst-h-5 yst-w-5 yst-text-gray-400 group-hover:yst-text-gray-500" />
			</button>
			{ isOpen && <ul className="yst-ml-8 yst-space-y-1">
				{ subItems.map( ( { linkProps, label }, index ) => (
					<li key={ `sub-menu-item-${ index }` }>
						<Link
							className="yst-group yst-flex yst-items-center yst-px-3 yst-py-2 yst-text-sm yst-font-medium yst-text-gray-600 yst-rounded-md hover:yst-text-gray-900 hover:yst-bg-gray-50 yst-no-underline"
							{ ...linkProps }
						>
							{ label }
						</Link>
					</li>
				) ) }
			</ul> }
		</div>
	);
};

MenuItem.propTypes = {
	label: PropTypes.string.isRequired,
	icon: PropTypes.elementType,
	subItems: PropTypes.array,
	defaultOpen: PropTypes.bool,
};

const SidebarNavigation = ( { items = [] } ) => (
	<nav>
		<figure className="yst-w-44 yst-px-3 yst-mb-12">
			<Logo />
		</figure>
		{ items.map( ( props, index ) => <MenuItem key={ `menu-item-${ index }` } { ...props } /> ) }
	</nav>
);

SidebarNavigation.propTypes = {
	items: PropTypes.array,
};

export default SidebarNavigation;
