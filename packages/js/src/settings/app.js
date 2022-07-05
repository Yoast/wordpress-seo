
import { AdjustmentsIcon, DesktopComputerIcon, NewspaperIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { useMemo } from "@wordpress/element";
import { trim } from "lodash";
import { Route, Routes, useLocation } from "react-router-dom";
import SidebarNavigation from "./components/sidebar-navigation";
import { ReactComponent as Logo } from "./components/yoast-logo.svg";
import {
	AuthorArchives,
	Breadcrumbs,
	DateArchives,
	Formats,
	Media,
	NotFoundPages,
	Rss,
	SearchPages,
	SiteDefaults,
	SitePreferences,
	SiteRepresentation,
	WebmasterTools,
} from "./routes";

/**
 * @returns {JSX.Element} The app component.
 */
const App = () => {
	const { pathname } = useLocation();
	const activePath = useMemo( () => trim( pathname, "/" ), [ pathname ] );

	return (
		<div className="yst-flex md:yst-gap-4 yst-mt-16 md:yst-mt-0 yst-p-4 md:yst-p-8">
			<aside className="yst-hidden md:yst-block yst-flex-shrink-0 yst-w-56 lg:yst-w-64">
				<figure className="yst-w-44 yst-px-3 yst-mb-12">
					<Logo />
				</figure>
				<SidebarNavigation activePath={ activePath }>
					<SidebarNavigation.MenuItem id="menu:site-settings" icon={ DesktopComputerIcon } label={ __( "Site settings", "wordpress-seo" ) }>
						<SidebarNavigation.SubmenuItem to="site-representation" label={ __( "Site representation", "wordpress-seo" ) } />
						<SidebarNavigation.SubmenuItem to="site-defaults" label={ __( "Site defaults", "wordpress-seo" ) } />
						<SidebarNavigation.SubmenuItem to="site-preferences" label={ __( "Site preferences", "wordpress-seo" ) } />
						<SidebarNavigation.SubmenuItem to="webmaster-tools" label={ __( "Webmaster tools", "wordpress-seo" ) } />
						<SidebarNavigation.SubmenuItem to="breadcrumbs" label={ __( "Breadcrumbs", "wordpress-seo" ) } />
					</SidebarNavigation.MenuItem>
					<SidebarNavigation.MenuItem id="menu:content-settings" icon={ NewspaperIcon } label={ __( "Content settings", "wordpress-seo" ) }>
						Content settings
					</SidebarNavigation.MenuItem>
					<SidebarNavigation.MenuItem id="menu:advanced-settings" icon={ AdjustmentsIcon } label={ __( "Advanced settings", "wordpress-seo" ) }>
						<SidebarNavigation.SubmenuItem to="author-archives" label={ __( "Author archives", "wordpress-seo" ) } />
						<SidebarNavigation.SubmenuItem to="date-archives" label={ __( "Date archives", "wordpress-seo" ) } />
						<SidebarNavigation.SubmenuItem to="search-pages" label={ __( "Search pages", "wordpress-seo" ) } />
						<SidebarNavigation.SubmenuItem to="not-found-pages" label={ __( "404 pages", "wordpress-seo" ) } />
						<SidebarNavigation.SubmenuItem to="media" label={ __( "Media", "wordpress-seo" ) } />
						<SidebarNavigation.SubmenuItem to="formats" label={ __( "Formats", "wordpress-seo" ) } />
						<SidebarNavigation.SubmenuItem to="rss" label={ __( "RSS", "wordpress-seo" ) } />
					</SidebarNavigation.MenuItem>
				</SidebarNavigation>
			</aside>
			<main className="yst-flex-grow">
				<Routes>
					<Route path="author-archives" element={ <AuthorArchives /> } />
					<Route path="breadcrumbs" element={ <Breadcrumbs /> } />
					<Route path="date-archives" element={ <DateArchives /> } />
					<Route path="formats" element={ <Formats /> } />
					<Route path="media" element={ <Media /> } />
					<Route path="not-found-pages" element={ <NotFoundPages /> } />
					<Route path="rss" element={ <Rss /> } />
					<Route path="search-pages" element={ <SearchPages /> } />
					<Route path="site-defaults" element={ <SiteDefaults /> } />
					<Route path="site-representation" element={ <SiteRepresentation /> } />
					<Route path="site-preferences" element={ <SitePreferences /> } />
					<Route path="webmaster-tools" element={ <WebmasterTools /> } />
					<Route path="/" element={ <SitePreferences /> } />
				</Routes>
			</main>
		</div>
	);
};

export default App;
