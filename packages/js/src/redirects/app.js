import { __ } from "@wordpress/i18n";
import {  SidebarNavigation } from "@yoast/ui-library";
import { useLocation } from "react-router-dom";
import { Menu } from "./components";
import { AppRoutes } from "./routes";

/**
 * Main redirects application component with responsive sidebar navigation.
 *
 * @param {Object} [redirectsProps={}] - Props for premium redirects page.
 * @param {Object} [regexProps={}] - Props for premium regex redirects page.
 * @param {Object} [redirectMethodProps={}] - Props for premium redirect method page.
 * @returns {JSX.Element} The complete redirects application layout.
 */
const App = () => {
	const { pathname } = useLocation();

	return (
		<>
			<SidebarNavigation activePath={ pathname }>
				<SidebarNavigation.Mobile
					openButtonId="yst-button-open-redirects-navigation-mobile"
					closeButtonId="yst-button-close-redirects-navigation-mobile"
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
		</>
	);
};

export default App;
