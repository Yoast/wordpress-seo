import { Transition } from "@headlessui/react";
import { AdjustmentsIcon, BellIcon, ChartPieIcon } from "@heroicons/react/outline";
import { useDispatch, useSelect } from "@wordpress/data";
import { useCallback, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { Notifications, SidebarNavigation, useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Notice } from "./components";
import { STORE_NAME } from "./constants";
import WebinarPromoNotification from "../components/WebinarPromoNotification";
import { deleteMigratingNotices } from "../helpers/migrateNotices";
import { shouldShowWebinarPromotionNotificationInDashboard } from "../helpers/shouldShowWebinarPromotionNotification";
import { useNotificationCountSync, useSelectGeneralPage } from "./hooks";
import { MenuItemLink, YoastLogo } from "../shared-admin/components";
import { ROUTES } from "./routes";

/**
 * @param {string} [idSuffix] Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The menu element.
 */
const Menu = ( { idSuffix = "" } ) => {
	const svgAriaProps = useSvgAria();
	const isPremium = useSelectGeneralPage( "selectPreference", [], "isPremium" );

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
		<ul className="yst-mt-1 yst-px-0.5 yst-space-y-4">
			<MenuItemLink
				to={ ROUTES.dashboard }
				label={ <>
					<ChartPieIcon className="yst-sidebar-navigation__icon yst-w-6 yst-h-6" />
					{ __( "Dashboard", "wordpress-seo" ) }
				</> }
				idSuffix={ idSuffix }
				className="yst-gap-3"
			/>
			<MenuItemLink
				to={ ROUTES.alertCenter }
				label={ <>
					<BellIcon className="yst-sidebar-navigation__icon yst-w-6 yst-h-6" />
					{ __( "Alert center", "wordpress-seo" ) }
				</> }
				idSuffix={ idSuffix }
				className="yst-gap-3"
			/>
			<MenuItemLink
				to={ ROUTES.firstTimeConfiguration }
				label={ <>
					<AdjustmentsIcon className="yst-sidebar-navigation__icon yst-w-6 yst-h-6" />
					{ __( "First-time configuration", "wordpress-seo" ) }
				</> }
				idSuffix={ idSuffix }
				className="yst-gap-3"
			/>
		</ul>
	</>;
};
Menu.propTypes = {
	idSuffix: PropTypes.string,
};

/**
 * @returns {JSX.Element} The app component.
 */
const App = () => {
	const notices = useSelect( select => select( STORE_NAME ).selectNotices(), [] );

	useEffect( () => {
		deleteMigratingNotices( notices );
	}, [ notices ] );

	const { pathname } = useLocation();
	const alertToggleError = useSelectGeneralPage( "selectAlertToggleError", [], [] );
	const { setAlertToggleError } = useDispatch( STORE_NAME );
	useNotificationCountSync();

	const handleDismiss = useCallback( () => {
		setAlertToggleError( null );
	}, [ setAlertToggleError ] );

	const linkParams = useSelect( select => select( STORE_NAME ).selectLinkParams(), [] );
	const webinarIntroSettingsUrl = addQueryArgs( "https://yoa.st/webinar-intro-settings", linkParams );

	return (
		<>
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
									{ pathname !== ROUTES.firstTimeConfiguration && <div>
										{ shouldShowWebinarPromotionNotificationInDashboard( STORE_NAME ) &&
											<WebinarPromoNotification store={ STORE_NAME } url={ webinarIntroSettingsUrl } image={ null } />
										}
										{ notices.length > 0 && <div className={ notices.filter( notice => ! notice.isDismissed ).length > 0 ? "yst-space-y-3 yoast-general-page-notices" : "yst-hidden" }> {
											notices.map( ( notice, index ) =>
												<Notice
													key={ index }
													id={ notice.id || "yoast-general-page-notice-" + index }
													title={ notice.header }
													isDismissable={ notice.isDismissable }
													className={ notice.isDismissed ? "yst-hidden" : "" }
												>
													{ notice.content }
												</Notice>
											)
										}
										</div> }
									</div> }
									<Outlet />
								</Transition>
							</main>
						</div>
					</div>
				</div>
			</SidebarNavigation>
			<Notifications
				className="yst-mx-[calc(50%-50vw)] yst-transition-all lg:yst-left-44"
				position="bottom-left"
			>
				{ alertToggleError && <Notifications.Notification
					id="toggle-alert-error"
					title={ __( "Something went wrong", "wordpress-seo" ) }
					variant="error"
					dismissScreenReaderLabel={ __( "Dismiss", "wordpress-seo" ) }
					size="large"
					autoDismiss={ 4000 }
					onDismiss={ handleDismiss }
				>
					{ alertToggleError.type === "error"
						? __( "This problem can't be hidden at this time. Please try again later.", "wordpress-seo" )
						: __( "This notification can't be hidden at this time. Please try again later.", "wordpress-seo" )
					}
				</Notifications.Notification>
				}
			</Notifications>
		</>
	);
};

export default App;
