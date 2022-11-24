import SidebarNavigation from ".";
import PropTypes from "prop-types";
import {
	AdjustmentsIcon,
	ColorSwatchIcon,
	DesktopComputerIcon,
	NewspaperIcon,
} from "@heroicons/react/outline";
import React from 'react';

/**
 * @param {string} [idSuffix] Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The menu element.
 */
const Menu = ( { idSuffix = "" } ) => {
	
	return <>
		<div className="yst-px-0.5 yst-space-y-6">
			<SidebarNavigation.MenuItem
				id={ `menu-site-settings${ idSuffix && `-${ idSuffix }` }` }
				icon={ DesktopComputerIcon }
				label="General"
			>
				<SidebarNavigation.SubmenuItem to="/site-features" label="Site features" idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/site-basics" label="Site basics" idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/site-connections" label="Site connections" idSuffix={ idSuffix } />
			</SidebarNavigation.MenuItem>
			<SidebarNavigation.MenuItem
				id={ `menu-content-settings${ idSuffix && `-${ idSuffix }` }` }
				icon={ NewspaperIcon }
				label="Content types"
			>
			
			</SidebarNavigation.MenuItem>
			<SidebarNavigation.MenuItem
				id={ `menu-content-settings${ idSuffix && `-${ idSuffix }` }` }
				icon={ ColorSwatchIcon }
				label="Categories & tags"
			>
		
			</SidebarNavigation.MenuItem>
			<SidebarNavigation.MenuItem
				id={ `menu-advanced-settings${ idSuffix && `-${ idSuffix }` }` }
				icon={ AdjustmentsIcon }
				label="Advanced"
				defaultOpen={ false }
			>
				<SidebarNavigation.SubmenuItem to="/breadcrumbs" label="Breadcrumbs" idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/author-archives" label="Author archives" idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/date-archives" label="Date archives" idSuffix={ idSuffix } />
				
			</SidebarNavigation.MenuItem>
		</div>
	</>;
};

Menu.propTypes = {
	idSuffix: PropTypes.string,
};


export default {
	title: "2. Components/Sidebar Navigation",
	component: SidebarNavigation,
	argTypes: {
		children:  { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A sidebar navigation component.",
			},
		},
	},
	args: {
		children: "test",
	}
};


const Template = ( { children } ) => {
		<SidebarNavigation>
					{ children }
		</SidebarNavigation>
		
};

export const Factory = Template.bind( {} );

Factory.args = {
	children: <></>,

}

export const SidebarMenu = Template.bind( {} );

SidebarMenu.args = {
	children: (<div className="yst-p-4 min-[783px]:yst-p-8 yst-flex yst-gap-4">
	<aside className="yst-sidebar yst-sidebar-nav yst-shrink-0 yst-hidden min-[783px]:yst-block yst-pb-6 yst-bottom-0 yst-w-56">
		<SidebarNavigation.Sidebar>
			<Menu idSuffix="sidebar" />
		</SidebarNavigation.Sidebar>
	</aside>
</div>),
}

export const MobileMenu = Template.bind( {} );

MobileMenu.args = {
	children: (<SidebarNavigation.Mobile 
	openButtonScreenReaderText="Open sidebar"
	closeButtonScreenReaderText="Close sidebar"
	>
	<Menu idSuffix="mobile" />
	</SidebarNavigation.Mobile>),
}
