import { createContext, useContext } from "@wordpress/element";
import PropTypes from "prop-types";
import MenuItem from "./menu-item";
import Mobile from "./mobile";
import Sidebar from "./sidebar";
import SubmenuItem from "./submenu-item";

const NavigationContext = createContext( { activePath: "" } );

/**
 * @returns {Object} The navigation context.
 */
export const useNavigationContext = () => useContext( NavigationContext );


/**
 * @param {string} activePath The path of the active menu item.
 * @param {JSX.node} children The menu(s).
 * @returns {JSX.Element} The navigation element.
 */
const SidebarNavigation = ( { activePath = "", children } ) => (
	<NavigationContext.Provider value={ { activePath } }>
		{ children }
	</NavigationContext.Provider>
);

SidebarNavigation.propTypes = {
	activePath: PropTypes.string,
	children: PropTypes.node.isRequired,
};

SidebarNavigation.Sidebar = Sidebar;
SidebarNavigation.Mobile = Mobile;
SidebarNavigation.MenuItem = MenuItem;
SidebarNavigation.SubmenuItem = SubmenuItem;

export default SidebarNavigation;
