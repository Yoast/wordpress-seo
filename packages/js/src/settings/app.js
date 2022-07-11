/* eslint-disable */
import { AdjustmentsIcon, DesktopComputerIcon, NewspaperIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { Route, Routes, useLocation } from "react-router-dom";
import { SidebarNavigation, YoastLogo } from "./components";
import {
	AuthorArchives,
	Breadcrumbs,
	CrawlSettings,
	DateArchives,
	Formats,
	Homepage,
	Media,
	NotFoundPages,
	Posts,
	Rss,
	SearchPages,
	SiteDefaults,
	SitePreferences,
	SiteRepresentation,
	WebmasterTools,
} from "./routes";

/**
 * @returns {JSX.Element} The menu element.
 */
const Menu = () => {
	return <>
		<figure className="yst-w-44 yst-px-3 yst-mb-12">
			<YoastLogo />
		</figure>
		<SidebarNavigation.MenuItem id="menu:site-settings" icon={ DesktopComputerIcon } label={ __( "Site settings", "wordpress-seo" ) }>
			{/*<SidebarNavigation.SubmenuItem to="/site-representation" label={ __( "Site representation", "wordpress-seo" ) } />*/}
			<SidebarNavigation.SubmenuItem to="/site-defaults" label={ __( "Site defaults", "wordpress-seo" ) } />
			<SidebarNavigation.SubmenuItem to="/site-preferences" label={ __( "Site preferences", "wordpress-seo" ) } />
			<SidebarNavigation.SubmenuItem to="/webmaster-tools" label={ __( "Webmaster tools", "wordpress-seo" ) } />
			{/*<SidebarNavigation.SubmenuItem to="/breadcrumbs" label={ __( "Breadcrumbs", "wordpress-seo" ) } />*/ }
		</SidebarNavigation.MenuItem>
		{/*{ <SidebarNavigation.MenuItem id="menu:content-settings" icon={ NewspaperIcon } label={ __( "Content settings", "wordpress-seo" ) }>*/}
		{/*	<SidebarNavigation.SubmenuItem to="/homepage" label={ __( "Homepage", "wordpress-seo" ) } />*/}
		{/*	<SidebarNavigation.SubmenuItem to="/posts" label={ __( "Posts", "wordpress-seo" ) } />*/}
		{/*</SidebarNavigation.MenuItem> }*/}
		<SidebarNavigation.MenuItem id="menu:advanced-settings" icon={ AdjustmentsIcon } label={ __( "Advanced settings", "wordpress-seo" ) }>
			<SidebarNavigation.SubmenuItem to="/crawl-settings" label={ __( "Crawl settings", "wordpress-seo" ) } />
			{/*<SidebarNavigation.SubmenuItem to="/author-archives" label={ __( "Author archives", "wordpress-seo" ) } />*/ }
			{/*<SidebarNavigation.SubmenuItem to="/date-archives" label={ __( "Date archives", "wordpress-seo" ) } />*/ }
			{/*<SidebarNavigation.SubmenuItem to="/search-pages" label={ __( "Search pages", "wordpress-seo" ) } />*/ }
			{/*<SidebarNavigation.SubmenuItem to="/not-found-pages" label={ __( "404 pages", "wordpress-seo" ) } />*/ }
			{/*<SidebarNavigation.SubmenuItem to="/media" label={ __( "Media", "wordpress-seo" ) } />*/ }
			{/*<SidebarNavigation.SubmenuItem to="/formats" label={ __( "Formats", "wordpress-seo" ) } />*/ }
			<SidebarNavigation.SubmenuItem to="/rss" label={ __( "RSS", "wordpress-seo" ) } />
		</SidebarNavigation.MenuItem>
	</>;
};

/**
 * @returns {JSX.Element} The app component.
 */
const App = () => {
	const { pathname } = useLocation();

	return <SidebarNavigation activePath={ pathname }>
		<SidebarNavigation.Mobile
			openButtonScreenReaderText={ __( "Open sidebar", "wordpress-seo" ) }
			closeButtonScreenReaderText={ __( "Close sidebar", "wordpress-seo" ) }
		>
			<Menu />
		</SidebarNavigation.Mobile>
		<div className="yst-flex md:yst-gap-4 yst-p-4 md:yst-p-8">
			<aside className="yst-hidden md:yst-block yst-flex-shrink-0 yst-w-56 lg:yst-w-64">
				<SidebarNavigation.Sidebar>
					<Menu />
				</SidebarNavigation.Sidebar>
			</aside>
			<main className="yst-flex-grow">
				<Routes>
					{/*<Route path="author-archives" element={ <AuthorArchives /> } />*/}
					{/*<Route path="breadcrumbs" element={ <Breadcrumbs /> } />*/}
					<Route path="crawl-settings" element={ <CrawlSettings /> } />
					{/*<Route path="date-archives" element={ <DateArchives /> } />*/}
					{/*{ <Route path="homepage" element={ <Homepage /> } /> }*/}
					{/*<Route path="formats" element={ <Formats /> } />*/}
					{/*<Route path="media" element={ <Media /> } />*/}
					{/*<Route path="not-found-pages" element={ <NotFoundPages /> } />*/}
					{/*{ <Route path="posts" element={ <Posts /> } /> }*/}
					<Route path="rss" element={ <Rss /> } />
					{/*<Route path="search-pages" element={ <SearchPages /> } />*/}
					<Route path="site-defaults" element={ <SiteDefaults /> } />
					{/*<Route path="site-representation" element={ <SiteRepresentation /> } />*/}
					<Route path="site-preferences" element={ <SitePreferences /> } />
					<Route path="webmaster-tools" element={ <WebmasterTools /> } />
					<Route path="/" element={ <SitePreferences /> } />
				</Routes>
			</main>
		</div>
	</SidebarNavigation>;
};

export default App;

/* eslint-enable */
