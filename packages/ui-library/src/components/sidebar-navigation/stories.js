import { AdjustmentsIcon, ColorSwatchIcon, DesktopComputerIcon, HomeIcon, NewspaperIcon, UserIcon } from "@heroicons/react/outline";
import SidebarNavigation from ".";
import Table from "../../elements/table";
import {
	combinedMenu,
	component,
	menuItem,
	mobile, navigationContext,
	sidebar,
	submenuItem,
} from "./docs";

export default {
	title: "2) Components/Sidebar navigation",
	component: SidebarNavigation,
	argTypes: {
		children: { control: "text" },
		activePath: { control: "text" },
		to: {
			control: "text",
			description: "Path, url for `SubmenuItem`",
			table: {
				type: { summary: "string" },
			},
		},
		label: {
			control: "text",
			description: "Available for `MenuItem` and `SubmenuItem`",
			table: {
				type: { summary: "string" },
			},
		},
		defaultOpen: {
			control: "boolean",
			description: "Available for `MenuItem`",
			table: {
				type: { summary: "boolean" },
			},
		},
		icon: {
			control: "object",
			description: "Available for `MenuItem`",
			table: {
				type: { summary: "JSX Element" },
			},
		},
		id: {
			control: "text",
			description: "Available for `MenuItem`",
			table: {
				type: { summary: "string" },
			},
		},
		openButtonScreenReaderText: {
			control: "text",
			description: "Accessibility for `Mobile`",
			table: {
				type: { summary: "string" },
			},
		},
		closeButtonScreenReaderText: {
			control: "text",
			description: "Accessibility for `Mobile`",
			table: {
				type: { summary: "string" },
			},
		},

	},
	parameters: {
		docs: {
			description: {
				component,
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

export const Sidebar = Template.bind( {} );

Sidebar.parameters = { docs: { description: { story: sidebar } } };

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

export const MenuItem = Template.bind( {} );
MenuItem.storyName = "Menu item";
MenuItem.parameters = { docs: { description: { story: menuItem } } };

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

const iconClassName = "yst-flex-shrink-0 yst--ml-1 yst-mr-3 yst-h-6 yst-w-6 yst-text-slate-400 group-hover:yst-text-slate-500";
function ItemWithHomeIcon( { children, ...props } ) {
	return ( <a { ...props }><HomeIcon className={ iconClassName } />{ children }</a> );
}
function ItemWithSettingsIcon( { children, ...props } ) {
	return ( <a { ...props }><AdjustmentsIcon className={ iconClassName } />{ children }</a> );
}

export const SubmenuItem = Template.bind( {} );
SubmenuItem.storyName = "Sidebar with submenu item";
SubmenuItem.parameters = { docs: { description: { story: submenuItem } } };

SubmenuItem.args = {
	children: (
		<SidebarNavigation.Sidebar className="yst-w-1/3">
			<ul>
				<SidebarNavigation.SubmenuItem as={ ItemWithHomeIcon } href="#_home" label="Home" />
				<SidebarNavigation.SubmenuItem as={ ItemWithSettingsIcon } href="#_settings" label="Settings" />
			</ul>
		</SidebarNavigation.Sidebar>
	),
};

export const CombinedMenu = Template.bind( {} );
CombinedMenu.storyName = "Sidebar with both items";
CombinedMenu.parameters = { docs: { description: { story: combinedMenu } } };

CombinedMenu.args = {
	children: (
		<SidebarNavigation.Sidebar className="yst-w-1/3">
			<ul>
				<SidebarNavigation.SubmenuItem as={ ItemWithHomeIcon } href="#_home" label="Home" />
				<SidebarNavigation.SubmenuItem as={ ItemWithSettingsIcon } href="#_settings" label="Settings" />
				<li>
					<SidebarNavigation.MenuItem
						id="submenuitem-sidebar-2"
						icon={ UserIcon }
						label="Profile"
					>
						<SidebarNavigation.SubmenuItem href="#_subscriptions" label="Subscriptions" />
						<SidebarNavigation.SubmenuItem href="#_logout" label="Log out" />
					</SidebarNavigation.MenuItem>
				</li>
			</ul>
		</SidebarNavigation.Sidebar>
	),
};


export const Mobile = Template.bind( {} );

Mobile.parameters = { docs: { description: { story: mobile } } };

Mobile.args = {
	children: ( <SidebarNavigation.Mobile
		openButtonScreenReaderText="Open sidebar"
		closeButtonScreenReaderText="Close sidebar"
	>
		<div className="yst-m-4">Mobile menu</div>
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


export const NavigationContext = Template.bind( {} );
NavigationContext.storyName = "Navigation context";
NavigationContext.parameters = {
	docs: {
		description: {
			story: navigationContext,
		},
		transformSource: () => "import { useNavigationContext } from \"@yoast/ui-library\";\n\n" +
			"const { activePath, isMobileMenuOpen, setMobileMenuOpen } = useNavigationContext();",
	},
};
NavigationContext.args = {
	children: <Table>
		<Table.Head>
			<Table.Row>
				<Table.Header>Key</Table.Header>
				<Table.Header>Description</Table.Header>
			</Table.Row>
		</Table.Head>
		<Table.Body>
			<Table.Row>
				<Table.Cell>activePath</Table.Cell>
				<Table.Cell>Represents what path is active. Used to determine which SubmenuItem is active.</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell>isMobileMenuOpen</Table.Cell>
				<Table.Cell>Represents whether the mobile menu is currently open.</Table.Cell>
			</Table.Row>
			<Table.Row>
				<Table.Cell>setMobileMenuOpen</Table.Cell>
				<Table.Cell>Controls the mobile menu.</Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table>,
};
