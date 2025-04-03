import { AdjustmentsIcon, ColorSwatchIcon, DesktopComputerIcon, NewspaperIcon } from "@heroicons/react/outline";
import { useArgs } from "@storybook/preview-api";
import React, { useCallback, useEffect } from "react";
import SidebarNavigation from ".";
import { InteractiveDocsPage } from "../../../.storybook/interactive-docs-page";
import Table from "../../elements/table";

const Template = ( args ) => {
	const [ , updateArgs ] = useArgs();

	const hashChangeHandler = useCallback( () => updateArgs( { activePath: document.location.hash } ), [ updateArgs ] );

	useEffect( () => {
		window.addEventListener( "hashchange", hashChangeHandler );
		hashChangeHandler();

		return () => window.removeEventListener( "hashchange", hashChangeHandler );
	}, [ hashChangeHandler ] );

	return <SidebarNavigation { ...args } />;
};

export const Factory = {
	render: Template.bind( {} ),
	args: {
		children: <SidebarNavigation.Sidebar className="yst-w-1/3">
			<ul className="yst-sidebar-navigation__list">
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
				<SidebarNavigation.SubmenuItem
					to="#item1"
					label={ <>
						<DesktopComputerIcon className="yst-sidebar-navigation__icon yst-h-6 yst-w-6" />
						Item 1 label
					</> }
					className="yst-gap-3"
				/>
			</ul>
		</SidebarNavigation.Sidebar>,
	},
};

export const MenuItem = {
	render: Template.bind( {} ),
	name: "Menu item",
	parameters: {
		docs: {
			description: {
				story: "The subcomponent `SidebarNavigation.MenuItem` accepts the subcomponents `SidebarNavigation.SubmenuItem` as children.",
			},
		},
	},
	args: {
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
	},
};

export const Sidebar = {
	render: Template.bind( {} ),
	parameters: {
		docs: {
			description: {
				story: "The subcomponent `SidebarNavigation.Sidebar` is a `<nav>` wrapper component. It's props are `className` and `children` (`MenuItem` subomponents).",
			},
		},
	},
	args: {
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
	},
};

export const Mobile = {
	render: Template.bind( {} ),
	parameters: {
		docs: {
			description: {
				story: "The subcomponent `SidebarNavigation.Mobile` is a wrapper component over the `MenuItem` subcomponents for mobile view.",
			},
		},
	},
	args: {
		children: ( <SidebarNavigation.Mobile
			openButtonScreenReaderText="Open sidebar"
			closeButtonScreenReaderText="Close sidebar"
		>
			<div className="yst-m-4">Mobile menu</div>
			<ul className="yst-sidebar-navigation__list">
				<SidebarNavigation.MenuItem
					id="submenuitem-mobile-1"
					icon={ AdjustmentsIcon }
					label="MenuItem 1 label"
					defaultOpen={ true }
				>
					<SidebarNavigation.SubmenuItem to="#1" label="SubmenuItem 1" />
					<SidebarNavigation.SubmenuItem to="#2" label="SubmenuItem 2" />
					<SidebarNavigation.SubmenuItem to="#3" label="SubmenuItem 3" />
				</SidebarNavigation.MenuItem>
				<SidebarNavigation.MenuItem
					id="submenuitem-mobile-2"
					icon={ ColorSwatchIcon }
					label="MenuItem 2 label"
					defaultOpen={ false }
				>
					<SidebarNavigation.SubmenuItem to="#4" label="SubmenuItem 4" />
					<SidebarNavigation.SubmenuItem to="#5" label="SubmenuItem 5" />
					<SidebarNavigation.SubmenuItem to="#6" label="SubmenuItem 6" />
				</SidebarNavigation.MenuItem>
				<SidebarNavigation.SubmenuItem
					to="#item1"
					label={ <>
						<DesktopComputerIcon className="yst-sidebar-navigation__icon yst-h-6 yst-w-6" />
						Item 1 label
					</> }
					className="yst-gap-3"
				/>
			</ul>
		</SidebarNavigation.Mobile> ),
	},
};

export const NavigationContext = {
	render: Template.bind( {} ),
	name: "Navigation context",
	parameters: {
		docs: {
			description: {
				story: "The `useNavigationContext` hook is exported. The context contains: `activePath`, `isMobileMenuOpen` and `setMobileMenuOpen` for if you need more control or create your own `SubmenuItem`.",
			},
			source: {
				transform: () => "import { useNavigationContext } from \"@yoast/ui-library\";\n\n" +
					"const { activePath, isMobileMenuOpen, setMobileMenuOpen } = useNavigationContext();",
			},
		},
	},
	args: {
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
	},
};

export const UsingBuildingBlocks = {
	render: Template.bind( {} ),
	name: "Using the smaller building blocks",
	parameters: {
		docs: {
			description: {
				story: "To allow for more flexibility, we provide `SidebarNavigation.List`, `SidebarNavigation.Item`, `SidebarNavigation.Collapsible`, `SidebarNavigation.Link` and `SidebarNavigation.Icon` to create your own combinations.",
			},
		},
	},
	args: {
		children: (
			<SidebarNavigation.Sidebar className="yst-w-1/3">
				<SidebarNavigation.List>
					<SidebarNavigation.Collapsible label="Collapsible 1" icon={ NewspaperIcon }>
						<SidebarNavigation.List isIndented={ true }>
							<SidebarNavigation.Item>
								<SidebarNavigation.Link href="#1">Link 1</SidebarNavigation.Link>
							</SidebarNavigation.Item>
							<SidebarNavigation.Item>
								<SidebarNavigation.Link href="#2">Link 2</SidebarNavigation.Link>
							</SidebarNavigation.Item>
							<SidebarNavigation.Item>
								<SidebarNavigation.Link href="#3">Link 3</SidebarNavigation.Link>
							</SidebarNavigation.Item>
						</SidebarNavigation.List>
					</SidebarNavigation.Collapsible>
					<SidebarNavigation.Collapsible label="Collapsible 2">
						<SidebarNavigation.List isIndented={ true }>
							<SidebarNavigation.Item>
								<SidebarNavigation.Link href="#4">Link 4</SidebarNavigation.Link>
							</SidebarNavigation.Item>
							<SidebarNavigation.Item>
								<SidebarNavigation.Link href="#5">Link 5</SidebarNavigation.Link>
							</SidebarNavigation.Item>
							<SidebarNavigation.Item>
								<SidebarNavigation.Link href="#6">Link 6</SidebarNavigation.Link>
							</SidebarNavigation.Item>
						</SidebarNavigation.List>
					</SidebarNavigation.Collapsible>
					<SidebarNavigation.Item>
						<SidebarNavigation.Link href="#7" className="yst-flex yst-gap-x-3">
							<SidebarNavigation.Icon as={ NewspaperIcon } className="yst-h-6 yst-w-6" />
							Link 7
						</SidebarNavigation.Link>
					</SidebarNavigation.Item>
				</SidebarNavigation.List>
			</SidebarNavigation.Sidebar>
		),
	},
};

export const NotUsingBuildingBlocks = {
	render: Template.bind( {} ),
	name: "Not using the smaller building blocks",
	parameters: {
		docs: {
			description: {
				story: "Here is the same example as the previous one, but without using the smaller building blocks. The `MenuItem` is a `Collapsible` with a `List`. The `SubmenuItem` is an `Item` with a `Link`.",
			},
		},
	},
	args: {
		children: (
			<SidebarNavigation.Sidebar className="yst-w-1/3">
				<ul className="yst-sidebar-navigation__list">
					<SidebarNavigation.MenuItem label="Collapsible 1" icon={ NewspaperIcon }>
						<SidebarNavigation.SubmenuItem href="#n1" label={ "Link 1" } />
						<SidebarNavigation.SubmenuItem href="#n2" label={ "Link 2" } />
						<SidebarNavigation.SubmenuItem href="#n3" label={ "Link 3" } />
					</SidebarNavigation.MenuItem>
					<SidebarNavigation.MenuItem label="Collapsible 2">
						<SidebarNavigation.SubmenuItem href="#n4" label={ "Link 4" } />
						<SidebarNavigation.SubmenuItem href="#n5" label={ "Link 5" } />
						<SidebarNavigation.SubmenuItem href="#n6" label={ "Link 6" } />
					</SidebarNavigation.MenuItem>
					<SidebarNavigation.SubmenuItem
						href="#n7"
						label={ <>
							<NewspaperIcon className="yst-sidebar-navigation__icon yst-h-6 yst-w-6" />
							Link 7
						</> }
						className="yst-flex yst-gap-x-3"
					/>
				</ul>
			</SidebarNavigation.Sidebar>
		),
	},
};

export default {
	title: "2) Components/Sidebar navigation",
	component: SidebarNavigation,
	argTypes: {
		children: { control: { disable: true } },
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
			description: "Available for `MenuItem` and `SubmenuItem`",
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
				component: "A sidebar navigation component. Contains the subcomponents `Sidebar`, `Mobile`, `MenuItem` and `SubmenuItem` and contains the hook `useNavigationContext`.",
			},
			page: () => <InteractiveDocsPage
				stories={ [
					MenuItem,
					Sidebar,
					Mobile,
					UsingBuildingBlocks,
					NotUsingBuildingBlocks,
					NavigationContext,
				] }
			/>,
		},
	},
};
