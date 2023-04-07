import { Disclosure } from "@headlessui/react";
import { createContext, useContext } from "@wordpress/element";
import { noop } from "lodash";
import PropTypes from "prop-types";
import Center from "./center";
import Container from "./container";
import End from "./end";
import Link from "./link";
import LinksContainer from "./links-container";
import LogoContainer from "./logo-container";
import MobileContainer from "./mobile-container";
import MobileMenuButton from "./mobile-menu-button";
import MobileLink from "./mobile-link";
import Start from "./start";
import Topbar from "./topbar";

export const TopbarNavigationContext = createContext( {
	activePath: "",
	isMobileMenuOpen: false,
	setMobileMenuOpen: noop,
} );

/**
 * @returns {Object} The navigation context.
 */
export const useTopbarNavigationContext = () => useContext( TopbarNavigationContext );

/**
 * @param {string} activePath The path of the active menu item.
 * @param {JSX.node} children The menu(s).
 * @returns {JSX.Element} The navigation element.
 */
const TopbarNavigation = ( { activePath = "", children } ) => {
	return (
		<Disclosure as="nav" className="yst-bg-white yst-shadow">
			{ ( { open, close } ) => (
				<TopbarNavigationContext.Provider value={ { activePath, isMobileMenuOpen: open, setMobileMenuOpen: close } }>
					{ children }
				</TopbarNavigationContext.Provider>
			) }
		</Disclosure>
	);
};

TopbarNavigation.propTypes = {
	activePath: PropTypes.string,
	children: PropTypes.node.isRequired,
};

TopbarNavigation.Container = Container;
TopbarNavigation.Container.displayName = "TopbarNavigation.Container";
TopbarNavigation.Topbar = Topbar;
TopbarNavigation.Topbar.displayName = "TopbarNavigation.Topbar";
TopbarNavigation.Start = Start;
TopbarNavigation.Start.displayName = "TopbarNavigation.Start";
TopbarNavigation.MobileMenuButton = MobileMenuButton;
TopbarNavigation.MobileMenuButton.displayName = "TopbarNavigation.MobileMenuButton";
TopbarNavigation.Center = Center;
TopbarNavigation.Center.displayName = "TopbarNavigation.Center";
TopbarNavigation.LogoContainer = LogoContainer;
TopbarNavigation.LogoContainer.displayName = "TopbarNavigation.LogoContainer";
TopbarNavigation.LinksContainer = LinksContainer;
TopbarNavigation.LinksContainer.displayName = "TopbarNavigation.LinksContainer";
TopbarNavigation.Link = Link;
TopbarNavigation.Link.displayName = "TopbarNavigation.Link";
TopbarNavigation.End = End;
TopbarNavigation.End.displayName = "TopbarNavigation.End";
TopbarNavigation.MobileContainer = MobileContainer;
TopbarNavigation.MobileContainer.displayName = "TopbarNavigation.MobileContainer";
TopbarNavigation.MobileLink = MobileLink;
TopbarNavigation.MobileLink.displayName = "TopbarNavigation.MobileLink";

export default TopbarNavigation;
