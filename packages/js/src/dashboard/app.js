/* eslint-disable complexity */

import { Transition } from "@headlessui/react";
import { AdjustmentsIcon, BellIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { Paper, SidebarNavigation, Title, useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import FirstTimeConfigurationSteps from "../first-time-configuration/first-time-configuration-steps";
import { MenuItemLink, YoastLogo } from "../shared-admin/components";
import { useSelectDashboard } from "./hooks";

/**
 * @param {string} [idSuffix] Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The menu element.
 */
const Menu = ( { idSuffix = "" } ) => {
	const svgAriaProps = useSvgAria();
	const isPremium = useSelectDashboard( "selectPreference", [], "isPremium" );

	return <>
		<header className="yst-px-3 yst-mb-6 yst-space-y-6">
			<Link
				id={ `link-yoast-logo${ idSuffix }` }
				to="/"
				className="yst-inline-block yst-rounded-md focus:yst-ring-primary-500"
				aria-label={ `Yoast SEO${ isPremium ? " Premium" : "" }` }
			>
				<YoastLogo className="yst-w-40" { ...svgAriaProps } />
			</Link>
		</header>
		<div className="yst-px-0.5 yst-space-y-6">
			<ul className="yst-mt-1 yst-space-y-1">
				<MenuItemLink icon={ BellIcon } to="/" label={ __( "Alert center", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<MenuItemLink
					icon={ AdjustmentsIcon } to="/first-time-configuration"
					label={ __( "First-time configuration", "wordpress-seo" ) }
					idSuffix={ idSuffix }
				/>
			</ul>
		</div>
	</>;
};
Menu.propTypes = {
	idSuffix: PropTypes.string,
};
/**
 * @returns {JSX.Element} The dashboard content placeholder.
 */
const Content = () => {
	return <>
		<header className="yst-p-8 yst-border-b yst-border-slate-200">
			<div className="yst-max-w-screen-sm">
				<Title>{ __( "Alert center", "wordpress-seo" ) }</Title>
				<p className="yst-text-tiny yst-mt-3">
					{ __( "Monitor and manage potential SEO problems affecting your site and stay informed with important notifications and updates.", "wordpress-seo" ) }
				</p>
			</div>
		</header>
		<div className="yst-h-full yst-p-8">
			<div
				className="yst-max-w-6xl yst-grid yst-gap-6 yst-grid-cols-1 sm:yst-grid-cols-2 min-[783px]:yst-grid-cols-1 lg:yst-grid-cols-2 xl:yst-grid-cols-4"
			>
				Content
			</div>
		</div>
	</>;
};
/**
 * @returns {JSX.Element} The app component.
 */
const App = () => {
	const { pathname } = useLocation();
	const isPremium = useSelectDashboard( "selectPreference", [], "isPremium" );
	return (
		<SidebarNavigation activePath={ pathname }>
			<SidebarNavigation.Mobile
				openButtonId="button-open-dashboard-navigation-mobile"
				closeButtonId="button-close-dashboard-navigation-mobile"
				/* translators: Hidden accessibility text. */
				openButtonScreenReaderText={ __( "Open dashboard navigation", "wordpress-seo" ) }
				/* translators: Hidden accessibility text. */
				closeButtonScreenReaderText={ __( "Close dashboard navigation", "wordpress-seo" ) }
				aria-label={ __( "Dashboard navigation", "wordpress-seo" ) }
			>
				<Menu idSuffix="-mobile" />
			</SidebarNavigation.Mobile>
			<div className="yst-p-4 min-[783px]:yst-p-8 yst-flex yst-gap-4">
				<aside className="yst-sidebar yst-sidebar-nav yst-shrink-0 yst-hidden min-[783px]:yst-block yst-pb-6 yst-bottom-0 yst-w-56">
					<SidebarNavigation.Sidebar>
						<Menu />
					</SidebarNavigation.Sidebar>
				</aside>
				<div className={ classNames( "yst-flex yst-grow yst-flex-wrap", ! isPremium && "xl:yst-pr-[17.5rem]" ) }>
					<div className="yst-grow yst-space-y-6 yst-mb-8 xl:yst-mb-0">
						<Paper as="main">
							<Transition
								key={ pathname }
								appear={ true }
								show={ true }
								enter="yst-transition-opacity yst-delay-100 yst-duration-300"
								enterFrom="yst-opacity-0"
								enterTo="yst-opacity-100"
							>
								<Routes>
									<Route path="/" element={ <Content /> } />
									<Route path="/first-time-configuration" element={ <FirstTimeConfigurationSteps /> } />
								</Routes>
							</Transition>
						</Paper>
					</div>
				</div>
			</div>
		</SidebarNavigation>
	);
};

export default App;
