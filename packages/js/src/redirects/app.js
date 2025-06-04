import { useDispatch } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Notifications, SidebarNavigation } from "@yoast/ui-library";
import { useLocation } from "react-router-dom";
import { Menu } from "./components";
import { STORE_NAME } from "./constants";
import { useSelectRedirects } from "./hooks";
import { AppRoutes } from "./routes";

/**
 * @returns {JSX.Element} The app component.
 */
const App = () => {
	const { pathname } = useLocation();
	const alertToggleError = useSelectRedirects( "selectAlertToggleError", [], [] );
	const { setAlertToggleError } = useDispatch( STORE_NAME );

	const handleDismiss = useCallback( () => {
		setAlertToggleError( null );
	}, [ setAlertToggleError ] );

	return (
		<>
			<SidebarNavigation activePath={ pathname }>
				<SidebarNavigation.Mobile
					openButtonId="button-open-redirects-navigation-mobile"
					closeButtonId="button-close-redirects-navigation-mobile"
					/* translators: Hidden accessibility text. */
					openButtonScreenReaderText={ __( "Open redirects navigation", "wordpress-seo" ) }
					/* translators: Hidden accessibility text. */
					closeButtonScreenReaderText={ __( "Close redirects navigation", "wordpress-seo" ) }
					aria-label={ __( "Redirects navigation", "wordpress-seo" ) }
				>
					<Menu idSuffix="-mobile" />
				</SidebarNavigation.Mobile>
				<div className="yst-p-4 min-[783px]:yst-p-8 yst-flex yst-gap-4">
					<aside className="yst-sidebar yst-sidebar-nav yst-shrink-0 yst-hidden min-[783px]:yst-block yst-pb-6 yst-bottom-0 yst-w-56">
						<SidebarNavigation.Sidebar>
							<Menu />
						</SidebarNavigation.Sidebar>
					</aside>
					<div className="yst-paper yst-grow yst-max-w-page">
						<div className="yst-space-y-6 yst-mb-8 xl:yst-mb-0">
							<main>
								<AppRoutes />
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
