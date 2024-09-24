/* eslint-disable complexity */

import { Transition } from "@headlessui/react";
import { AdjustmentsIcon, BellIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { useMemo } from "@wordpress/element";
import { select } from "@wordpress/data";
import { addQueryArgs } from "@wordpress/url";
import { SidebarNavigation, useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { MenuItemLink, YoastLogo } from "../shared-admin/components";
import { useSelectDashboard } from "./hooks";
import { FirstTimeConfiguration, AlertCenter } from "./routes";
import { moveNotices } from "../helpers/moveNotices";
import Notice from "./tailwind-components/notice";
import WebinarPromoNotification from "../components/WebinarPromoNotification";
import { shouldShowWebinarPromotionNotificationInDashboard } from "../helpers/shouldShowWebinarPromotionNotification";

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
 * @returns {JSX.Element} The app component.
 */
const App = () => {
	const notices = useMemo( moveNotices, [] );

	const { pathname } = useLocation();
	const linkParams = select( "yoast-seo/settings" ).selectLinkParams();
	const webinarIntroSettingsUrl = addQueryArgs( "https://yoa.st/webinar-intro-settings", linkParams );

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
				<div className="yst-grow">
					{ shouldShowWebinarPromotionNotificationInDashboard( "yoast-seo/settings" ) && <WebinarPromoNotification store="yoast-seo/settings" url={ webinarIntroSettingsUrl } /> }
					{ notices.length > 0 && <div className="yst-space-y-2 yst-mb-8"> {
						notices.map( ( notice, index ) => (
							<Notice
								key={ index }
								id={ notice.id || "yoast-dashboard-notice-" + index }
								title={ notice.header }
								isDismissable={ notice.isDismissable }
							>
								{ notice.content }
							</Notice>
						) )
					}
					</div> }
					<div className="yst-space-y-6 yst-mb-8 xl:yst-mb-0">
						<main>
							<Transition
								key={ pathname }
								appear={ true }
								show={ true }
								enter="yst-transition-opacity yst-delay-100 yst-duration-300"
								enterFrom="yst-opacity-0"
								enterTo="yst-opacity-100"
							>
								<Routes>
									<Route path="/" element={ <AlertCenter /> } />
									<Route path="/first-time-configuration" element={ <FirstTimeConfiguration /> } />
								</Routes>
							</Transition>
						</main>
					</div>
				</div>
			</div>
		</SidebarNavigation>
	);
};

export default App;
