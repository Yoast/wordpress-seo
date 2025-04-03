import { noop } from "lodash";
import PropTypes from "prop-types";
import React, { createContext, useContext, useState } from "react";
import { Collapsible } from "./collapsible";
import { Icon } from "./icon";
import { Item } from "./item";
import { Link } from "./link";
import { List } from "./list";
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

// Different types of navigation.
SidebarNavigation.Sidebar = Sidebar;
SidebarNavigation.Sidebar.displayName = "SidebarNavigation.Sidebar";
SidebarNavigation.Mobile = Mobile;
SidebarNavigation.Mobile.displayName = "SidebarNavigation.Mobile";

// "V1" components.
SidebarNavigation.MenuItem = MenuItem;
SidebarNavigation.MenuItem.displayName = "SidebarNavigation.MenuItem";
SidebarNavigation.SubmenuItem = SubmenuItem;
SidebarNavigation.SubmenuItem.displayName = "SidebarNavigation.SubmenuItem";

// "V2" building blocks.
SidebarNavigation.List = List;
SidebarNavigation.Item = Item;
SidebarNavigation.Collapsible = Collapsible;
SidebarNavigation.Link = Link;
SidebarNavigation.Icon = Icon;

export default SidebarNavigation;
