import { createContext, useContext, useState } from "@wordpress/element";
import { noop } from "lodash";
import PropTypes from "prop-types";
import MenuItem from "./menu-item";
import Mobile from "./mobile";
import Sidebar from "./sidebar";
import SubmenuItem from "./submenu-item";

export const NavigationContext = createContext( {
	activePath: "",
	isMobileMenuOpen: false,
	setMobileMenuOpen: noop,
} );

/**
 * @returns {Object} The navigation context.
 */
export const useNavigationContext = () => useContext( NavigationContext );

/**
 * @param {string} activePath The path of the active menu item.
 * @param {JSX.node} children The menu(s).
 * @returns {JSX.Element} The navigation element.
 */
const SidebarNavigation = ( { activePath = "", children } ) => {
	const [ isMobileMenuOpen, setMobileMenuOpen ] = useState( false );

	return (
		<NavigationContext.Provider value={ { activePath, isMobileMenuOpen, setMobileMenuOpen } }>
			{ children }
		</NavigationContext.Provider>
	);
};

SidebarNavigation.propTypes = {
	activePath: PropTypes.string,
	children: PropTypes.node.isRequired,
};

SidebarNavigation.Sidebar = Sidebar;
SidebarNavigation.Mobile = Mobile;
SidebarNavigation.MenuItem = MenuItem;
SidebarNavigation.SubmenuItem = SubmenuItem;

export default SidebarNavigation;
