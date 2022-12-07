import SidebarNavigation from ".";
import {
	AdjustmentsIcon,
	ColorSwatchIcon,
	DesktopComputerIcon,
	NewspaperIcon,
} from "@heroicons/react/outline";


export default {
	title: "2. Components/Sidebar Navigation",
	component: SidebarNavigation,
	argTypes: {
		children: { control: "text" },
		activePath: { control: "text" },
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
	},
};


const Template = ( { children, activePath } ) => {
	return (
		<SidebarNavigation activePath={ activePath }>
			{ children }
		</SidebarNavigation> );
};


export const Factory = Template.bind( {} );

Factory.args = {
	children: <SidebarNavigation.Sidebar className="yst-w-1/3">

		<SidebarNavigation.MenuItem
			id={ "menu-item-default-1" }
			icon={ DesktopComputerIcon }
			label="MenuItem 1 label"
		>
			<SidebarNavigation.SubmenuItem to="#sub1" label="SubmenuItem 1 label" />
			<SidebarNavigation.SubmenuItem to="#sub2" label="SubmenuItem 2 label" />
			<SidebarNavigation.SubmenuItem to="#sub3" label="SubmenuItem 3 label" />
		</SidebarNavigation.MenuItem>
		<SidebarNavigation.MenuItem
			id={ "menu-item-default-2" }
			icon={ AdjustmentsIcon }
			label="MenuItem 2 label"
			defaultOpen={ false }
		>
			<SidebarNavigation.SubmenuItem to="#sub1" label="SubmenuItem 1 label" />
			<SidebarNavigation.SubmenuItem to="#sub2" label="SubmenuItem 2 label" />
			<SidebarNavigation.SubmenuItem to="#sub3" label="SubmenuItem 3 label" />

		</SidebarNavigation.MenuItem>
		<SidebarNavigation.MenuItem
			id={ "menu-item-default-3" }
			icon={ NewspaperIcon }
			label="MenuItem 3 label"
			defaultOpen={ false }
		>
			<SidebarNavigation.SubmenuItem to="#sub1" label="SubmenuItem 1 label" />
			<SidebarNavigation.SubmenuItem to="#sub2" label="SubmenuItem 2 label" />
			<SidebarNavigation.SubmenuItem to="#sub3" label="SubmenuItem 3 label" />

		</SidebarNavigation.MenuItem>
	</SidebarNavigation.Sidebar>,
};

export const MenuItem = Template.bind( {} );

MenuItem.parameters = { docs: { description: { story: "The subcomponent `SidebarNavigation.MenuItem` accepts the subcomponents `SidebarNavigation.SubmenuItem` as children." } } };

MenuItem.args = {
	children: (
		<SidebarNavigation.MenuItem
			id={ "menuitem" }
			icon={ ColorSwatchIcon }
			label="MenuItem label"
			defaultOpen={ true }
		>
			<SidebarNavigation.SubmenuItem to="#1" label="SubmenuItem 1" />
			<SidebarNavigation.SubmenuItem to="#2" label="SubmenuItem 2" />
			<SidebarNavigation.SubmenuItem to="#3" label="SubmenuItem 3" />

		</SidebarNavigation.MenuItem>
	),
};


export const Sidebar = Template.bind( {} );

Sidebar.parameters = { docs: { description: { story: "The subcomponent `SidebarNavigation.Sidebar` is a `<nav>` wrapper component. It's props are `className` and `children` (`MenuItem` subomponents)." } } };

Sidebar.args = {
	children: (
		<SidebarNavigation.Sidebar className="yst-w-1/3">
			<SidebarNavigation.MenuItem
				id={ "submenuitem-sidebar-1" }
				icon={ NewspaperIcon }
				label="MenuItem 1 label"
				defaultOpen={ false }
			>
				<SidebarNavigation.SubmenuItem to="#1" label="SubmenuItem 1" />
				<SidebarNavigation.SubmenuItem to="#2" label="SubmenuItem 2" />
				<SidebarNavigation.SubmenuItem to="#3" label="SubmenuItem 3" />

			</SidebarNavigation.MenuItem>
			<SidebarNavigation.MenuItem
				id={ "submenuitem-sidebar-2" }
				icon={ ColorSwatchIcon }
				label="MenuItem 2 label"
				defaultOpen={ false }
			>
				<SidebarNavigation.SubmenuItem to="#1" label="SubmenuItem 1" />
				<SidebarNavigation.SubmenuItem to="#2" label="SubmenuItem 2" />
				<SidebarNavigation.SubmenuItem to="#3" label="SubmenuItem 3" />

			</SidebarNavigation.MenuItem>
		</SidebarNavigation.Sidebar>
	),
};


export const Mobile = Template.bind( {} );

Mobile.parameters = { docs: { description: { story: "The subcomponent `SidebarNavigation.Mobile` is a wrapper component over the `MenuItem` subcomponents for mobile view." } } };

Mobile.args = {
	children: ( <SidebarNavigation.Mobile
		openButtonScreenReaderText="Open sidebar"
		closeButtonScreenReaderText="Close sidebar"
	>
		<div className="yst-m-4">MobileMenu</div>
		<SidebarNavigation.MenuItem
			id={ "submenuitem-mobile" }
			icon={ AdjustmentsIcon }
			label="MenuItem label"
			defaultOpen={ true }
		>
			<SidebarNavigation.SubmenuItem to="#1" label="SubmenuItem 1" />
			<SidebarNavigation.SubmenuItem to="#2" label="SubmenuItem 2" />
			<SidebarNavigation.SubmenuItem to="#3" label="SubmenuItem 3" />

		</SidebarNavigation.MenuItem>
	</SidebarNavigation.Mobile> ),
};
