import { AdjustmentsIcon, ColorSwatchIcon, DesktopComputerIcon, NewspaperIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { Badge } from "@yoast/ui-library";
import { map } from "lodash";
import PropTypes from "prop-types";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Notifications, SidebarNavigation, YoastLogo } from "./components";
import { useRouterScrollRestore } from "./hooks";
import useTaxonomyPostTypeBadges from "./hooks/use-taxonomy-post-type-badges";
import {
	AuthorArchives,
	Breadcrumbs,
	CrawlSettings,
	DateArchives,
	Formats,
	Homepage,
	Media,
	NotFoundPages,
	PostType,
	Rss,
	SearchPages,
	SiteDefaults,
	SitePreferences,
	SiteRepresentation,
	Taxonomy,
	WebmasterTools,
} from "./routes";
import { useSelectSettings } from "./store";

/**
 * @param {Object} props The props.
 * @param {string} props.taxonomyName The taxonomy name to render submenu item for.
 * @param {string} props.idSuffix Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The TaxonomySubmenuItem element.
 */
const TaxonomySubmenuItem = ( { taxonomyName, idSuffix = "" } ) => {
	const taxonomy = useSelectSettings( "selectTaxonomy", [ taxonomyName ], taxonomyName );
	const badges = useTaxonomyPostTypeBadges( taxonomyName );

	return (
		<SidebarNavigation.SubmenuItem
			to={ `/taxonomy/${ taxonomy.route }` }
			label={ <div className="yst-flex yst-w-full yst-justify-between yst-items-center">
				<span>{ taxonomy.label }</span>
				{ badges && <div className="yst-flex yst-flex-wrap yst-justify-end yst-gap-1.5">{ badges }</div> }
			</div> }
			idSuffix={ idSuffix }
		/>
	);
};

TaxonomySubmenuItem.propTypes = {
	taxonomyName: PropTypes.string.isRequired,
	idSuffix: PropTypes.string,
};

/**
 * @param {Object[]} postTypes The post types to present.
 * @param {Object[]} taxonomies The taxonomies to present.
 * @param {string} [idSuffix] Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The menu element.
 */
const Menu = ( { postTypes, taxonomies, idSuffix = "" } ) => {
	return <>
		<figure className="yst-w-44 yst-px-3 yst-mb-12">
			<YoastLogo />
		</figure>
		<SidebarNavigation.MenuItem
			id={ `menu-site-settings${ idSuffix && `-${ idSuffix }` }` }
			icon={ DesktopComputerIcon }
			label={ __( "Site settings", "wordpress-seo" ) }
		>
			<SidebarNavigation.SubmenuItem to="/site-representation" label={ __( "Site representation", "wordpress-seo" ) } idSuffix={ idSuffix } />
			<SidebarNavigation.SubmenuItem to="/site-defaults" label={ __( "Site defaults", "wordpress-seo" ) } idSuffix={ idSuffix } />
			<SidebarNavigation.SubmenuItem to="/site-preferences" label={ __( "Site preferences", "wordpress-seo" ) } idSuffix={ idSuffix } />
			<SidebarNavigation.SubmenuItem to="/webmaster-tools" label={ __( "Webmaster tools", "wordpress-seo" ) } idSuffix={ idSuffix } />
			<SidebarNavigation.SubmenuItem to="/breadcrumbs" label={ __( "Breadcrumbs", "wordpress-seo" ) } idSuffix={ idSuffix } />
		</SidebarNavigation.MenuItem>
		<SidebarNavigation.MenuItem
			id={ `menu-content-settings${ idSuffix && `-${ idSuffix }` }` }
			icon={ NewspaperIcon }
			label={ __( "Content settings", "wordpress-seo" ) }
		>
			<SidebarNavigation.SubmenuItem to="/homepage" label={ __( "Homepage", "wordpress-seo" ) } idSuffix={ idSuffix } />
			{ map( postTypes, ( { name, route, label } ) => (
				<SidebarNavigation.SubmenuItem
					key={ `link-post-type-${ name }` } to={ `/post-type/${ route }` } label={ label }
					idSuffix={ idSuffix }
				/>
			) ) }
		</SidebarNavigation.MenuItem>
		<SidebarNavigation.MenuItem
			id={ `menu-content-settings${ idSuffix && `-${ idSuffix }` }` }
			icon={ ColorSwatchIcon }
			label={ __( "Taxonomy settings", "wordpress-seo" ) }
		>
			{ map( taxonomies, ( { name } ) => <TaxonomySubmenuItem key={ `link-taxonomy-${ name }` } taxonomyName={ name } /> ) }
		</SidebarNavigation.MenuItem>
		<SidebarNavigation.MenuItem
			id={ `menu-advanced-settings${ idSuffix && `-${ idSuffix }` }` }
			icon={ AdjustmentsIcon }
			label={ __( "Advanced settings", "wordpress-seo" ) }
		>
			<SidebarNavigation.SubmenuItem
				to="/crawl-optimization"
				label={
					<span className="yst-inline-flex yst-items-center yst-gap-1.5">
						{ __( "Crawl optimization", "wordpress-seo" ) }
						<Badge variant="info">{ __( "Beta", "wordpress-seo" ) }</Badge>
					</span>
				}
				idSuffix={ idSuffix }
			/>
			<SidebarNavigation.SubmenuItem to="/author-archives" label={ __( "Author archives", "wordpress-seo" ) } idSuffix={ idSuffix } />
			<SidebarNavigation.SubmenuItem to="/date-archives" label={ __( "Date archives", "wordpress-seo" ) } idSuffix={ idSuffix } />
			<SidebarNavigation.SubmenuItem to="/search-pages" label={ __( "Search pages", "wordpress-seo" ) } idSuffix={ idSuffix } />
			<SidebarNavigation.SubmenuItem to="/not-found-pages" label={ __( "404 pages", "wordpress-seo" ) } idSuffix={ idSuffix } />
			<SidebarNavigation.SubmenuItem to="/media" label={ __( "Media", "wordpress-seo" ) } idSuffix={ idSuffix } />
			<SidebarNavigation.SubmenuItem to="/formats" label={ __( "Formats", "wordpress-seo" ) } idSuffix={ idSuffix } />
			<SidebarNavigation.SubmenuItem to="/rss" label={ __( "RSS", "wordpress-seo" ) } idSuffix={ idSuffix } />
		</SidebarNavigation.MenuItem>
	</>;
};

Menu.propTypes = {
	postTypes: PropTypes.object.isRequired,
	taxonomies: PropTypes.object.isRequired,
	idSuffix: PropTypes.string,
};

/**
 * @returns {JSX.Element} The app component.
 */
const App = () => {
	const { pathname } = useLocation();
	const postTypes = useSelectSettings( "selectPostTypes" );
	const taxonomies = useSelectSettings( "selectTaxonomies" );
	useRouterScrollRestore();

	return (
		<>
			<Notifications />
			<SidebarNavigation activePath={ pathname }>
				<SidebarNavigation.Mobile
					openButtonScreenReaderText={ __( "Open sidebar", "wordpress-seo" ) }
					closeButtonScreenReaderText={ __( "Close sidebar", "wordpress-seo" ) }
				>
					<Menu idSuffix="mobile" postTypes={ postTypes } taxonomies={ taxonomies } />
				</SidebarNavigation.Mobile>
				<div className="yst-flex md:yst-gap-4 yst-p-4 md:yst-p-8">
					<aside className="yst-hidden md:yst-block yst-flex-shrink-0 yst-w-56 lg:yst-w-64">
						<SidebarNavigation.Sidebar>
							<Menu postTypes={ postTypes } taxonomies={ taxonomies } />
						</SidebarNavigation.Sidebar>
					</aside>
					<main className="yst-flex-grow">
						<Routes>
							<Route path="author-archives" element={ <AuthorArchives /> } />
							<Route path="breadcrumbs" element={ <Breadcrumbs /> } />
							<Route path="crawl-optimization" element={ <CrawlSettings /> } />
							<Route path="date-archives" element={ <DateArchives /> } />
							<Route path="homepage" element={ <Homepage /> } />
							<Route path="formats" element={ <Formats /> } />
							<Route path="media" element={ <Media /> } />
							<Route path="not-found-pages" element={ <NotFoundPages /> } />
							<Route path="rss" element={ <Rss /> } />
							<Route path="search-pages" element={ <SearchPages /> } />
							<Route path="site-defaults" element={ <SiteDefaults /> } />
							<Route path="site-representation" element={ <SiteRepresentation /> } />
							<Route path="site-preferences" element={ <SitePreferences /> } />
							<Route path="webmaster-tools" element={ <WebmasterTools /> } />
							<Route path="post-type">
								{ map( postTypes, postType => (
									<Route
										key={ `route-post-type-${ postType.name }` } path={ postType.route }
										element={ <PostType { ...postType } /> }
									/>
								) ) }
							</Route>
							<Route path="taxonomy">
								{ map( taxonomies, taxonomy => (
									<Route
										key={ `route-taxonomy-${ taxonomy.name }` } path={ taxonomy.route }
										element={ <Taxonomy { ...taxonomy } /> }
									/>
								) ) }
							</Route>
							<Route path="*" element={ <Navigate to="/site-preferences" replace={ true } /> } />
						</Routes>
					</main>
				</div>
			</SidebarNavigation>
		</>
	);
};

export default App;
