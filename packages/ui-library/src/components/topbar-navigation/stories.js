import { BellIcon } from "@heroicons/react/outline";
import { CubeIcon } from "@heroicons/react/solid";
import TopbarNavigation from ".";

const links = [
	{ href: "#one", children: "One" },
	{ href: "#two", children: "Two" },
	{ href: "#three", children: "Three" },
];

export default {
	title: "2) Components/Topbar Navigation",
	component: TopbarNavigation,
	argTypes: {
		children: { control: "text" },
		activePath: { control: "text" },
	},
	parameters: {
		docs: {
			description: {
				component: "A topbar navigation component. Contains the subcomponents `Container`, `Topbar`, `Start`, `MobileButton`, `Center`, `LogoContainer`, `LinksContainer`, `Link`, `End`, `MobileContainer` and `MobileLink` and contains the hook `useTopbarNavigationContext`.",
			},
		},
	},
	args: {
		activePath: "#one",
	},
};

const Template = ( { activePath, children } ) => (
	<TopbarNavigation activePath={ activePath }>
		{ children }
	</TopbarNavigation>
);

export const Factory = Template.bind( {} );

Factory.args = {
	children: (
		<TopbarNavigation.Container>
			<TopbarNavigation.Topbar>
				<TopbarNavigation.Start>
					<TopbarNavigation.MobileMenuButton openButtonScreenReaderText="Open" closeButtonScreenReaderText="Close" />
				</TopbarNavigation.Start>
				<TopbarNavigation.Center>
					<TopbarNavigation.LogoContainer>
						<CubeIcon className="yst-h-8 yst-w-8 yst-text-primary-500" />
					</TopbarNavigation.LogoContainer>
					<TopbarNavigation.LinksContainer>
						{ links.map( ( { children, ...props }, index ) => (
							<TopbarNavigation.Link key={ `link-${ index }` } { ...props }>{ children }</TopbarNavigation.Link>
						) ) }
					</TopbarNavigation.LinksContainer>
				</TopbarNavigation.Center>
				<TopbarNavigation.End>
					<BellIcon className="yst-h-5 yst-w-5" />
				</TopbarNavigation.End>
			</TopbarNavigation.Topbar>
			<TopbarNavigation.MobileContainer>
				{ links.map( ( { children, ...props }, index ) => (
					<TopbarNavigation.MobileLink key={ `link-mobile-${ index }` } { ...props }>{ children }</TopbarNavigation.MobileLink>
				) ) }
			</TopbarNavigation.MobileContainer>
		</TopbarNavigation.Container>
	),
};
