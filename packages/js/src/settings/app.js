/* eslint-disable */
import { AdjustmentsIcon, ChevronDownIcon, ChevronUpIcon, ColorSwatchIcon, DesktopComputerIcon, NewspaperIcon } from "@heroicons/react/outline";
import { useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Badge, ChildrenLimiter, ErrorBoundary, useBeforeUnload } from "@yoast/ui-library";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { map } from "lodash";
import PropTypes from "prop-types";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ErrorFallback, Notifications, SidebarNavigation, SidebarRecommendations, YoastLogo } from "./components";
import TaxonomyPostTypeBadges from "./components/taxonomy-post-type-badges";
import { useRouterScrollRestore } from "./hooks";
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
 * @param {Object} taxonomy The taxonomy to render submenu item for.
 * @param {string} [idSuffix] Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The TaxonomySubmenuItem element.
 */
const TaxonomySubmenuItem = ( { taxonomy, idSuffix = "" } ) => {
	const hasPostTypeBadge = useSelectSettings( "selectTaxonomyHasPostTypeBadge", [ taxonomy.name ], taxonomy.name );

	return (
		<SidebarNavigation.SubmenuItem
			to={ `/taxonomy/${ taxonomy.route }` }
			label={ <div className="yst-flex yst-w-full yst-justify-between yst-items-center">
				<span>{ taxonomy.label }</span>
				{ hasPostTypeBadge && <div className="yst-flex yst-flex-wrap yst-justify-end yst-gap-1.5">
					<TaxonomyPostTypeBadges name={ taxonomy.name } />
				</div> }
			</div> }
			idSuffix={ idSuffix }
		/>
	);
};

TaxonomySubmenuItem.propTypes = {
	taxonomy: PropTypes.object.isRequired,
	idSuffix: PropTypes.string,
};

/**
 * @param {Object[]} postTypes The post types to present.
 * @param {Object[]} taxonomies The taxonomies to present.
 * @param {string} [idSuffix] Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The menu element.
 */
const Menu = ( { postTypes, taxonomies, idSuffix = "" } ) => {
	const renderMoreOrLessButton = useCallback( ( { show, toggle, ariaProps } ) => {
		const ChevronIcon = useMemo( () => show ? ChevronUpIcon : ChevronDownIcon, [ show ] );

		return <button
			className="yst-group yst-flex yst-w-full yst-items-center yst-justify-between yst-gap-3 yst-px-3 yst-py-2 yst-text-sm yst-font-medium yst-text-gray-600 yst-rounded-md yst-no-underline hover:yst-text-gray-900 hover:yst-bg-gray-50 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-primary-500"
			onClick={ toggle }
			{ ...ariaProps }
		>
			<span className="yst-flex yst-items-center yst-gap-2">
				<ChevronIcon className="yst-flex-shrink-0 yst-h-4 yst-w-4 yst-text-gray-400 group-hover:yst-text-gray-500 yst-stroke-3" />
				{ show ? __( "Show less", "wordpress-seo" ) : __( "Show more", "wordpress-seo" ) }
			</span>
		</button>;
	}, [] );

	return <>
		<header className="yst-sticky yst-top-0">
			<div className="yst-bg-gray-100">
				<figure className="yst-w-44 yst-px-3">
					<YoastLogo />
				</figure>
			</div>
			<div className="yst-h-8 yst-bg-gradient-to-b yst-from-gray-100" />
		</header>
		<div className="yst-space-y-6">
			<SidebarNavigation.MenuItem
				id={ `menu-site-settings${ idSuffix && `-${ idSuffix }` }` }
				icon={ DesktopComputerIcon }
				label={ __( "General", "wordpress-seo" ) }
			>
				<SidebarNavigation.SubmenuItem
					to="/site-representation"
					label={ __( "Site representation", "wordpress-seo" ) }
					idSuffix={ idSuffix }
				/>
				<SidebarNavigation.SubmenuItem to="/site-defaults" label={ __( "Site defaults", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/site-preferences" label={ __( "Site preferences", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/webmaster-tools" label={ __( "Webmaster tools", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/breadcrumbs" label={ __( "Breadcrumbs", "wordpress-seo" ) } idSuffix={ idSuffix } />
			</SidebarNavigation.MenuItem>
			<SidebarNavigation.MenuItem
				id={ `menu-content-settings${ idSuffix && `-${ idSuffix }` }` }
				icon={ NewspaperIcon }
				label={ __( "Content types", "wordpress-seo" ) }
			>
				<ChildrenLimiter limit={ 5 } renderButton={ renderMoreOrLessButton }>
					<SidebarNavigation.SubmenuItem to="/homepage" label={ __( "Homepage", "wordpress-seo" ) } idSuffix={ idSuffix } />
					{ map( postTypes, ( { name, route, label } ) => (
						<SidebarNavigation.SubmenuItem
							key={ `link-post-type-${ name }` } to={ `/post-type/${ route }` } label={ label }
							idSuffix={ idSuffix }
						/>
					) ) }
				</ChildrenLimiter>
			</SidebarNavigation.MenuItem>
			<SidebarNavigation.MenuItem
				id={ `menu-content-settings${ idSuffix && `-${ idSuffix }` }` }
				icon={ ColorSwatchIcon }
				label={ __( "Categories & tags", "wordpress-seo" ) }
			>
				<ChildrenLimiter limit={ 5 } renderButton={ renderMoreOrLessButton }>
					{ map( taxonomies, taxonomy => <TaxonomySubmenuItem key={ `link-taxonomy-${ taxonomy.name }` } taxonomy={ taxonomy } /> ) }
				</ChildrenLimiter>
			</SidebarNavigation.MenuItem>
			<SidebarNavigation.MenuItem
				id={ `menu-advanced-settings${ idSuffix && `-${ idSuffix }` }` }
				icon={ AdjustmentsIcon }
				label={ __( "Advanced", "wordpress-seo" ) }
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
				<SidebarNavigation.SubmenuItem to="/media" label={ __( "Media pages", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/formats" label={ __( "Formats", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/rss" label={ __( "RSS", "wordpress-seo" ) } idSuffix={ idSuffix } />
			</SidebarNavigation.MenuItem>
		</div>
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
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );

	useRouterScrollRestore();

	const { dirty } = useFormikContext();
	useBeforeUnload(
		dirty,
		__( "There are unsaved changes on this page. Leaving means that those changes will be lost. Are you sure you want to leave this page?", "wordpress-seo" ),
	);

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
				<div className={ classNames(
					"yst-p-4 md:yst-p-8 md:yst-pl-[17rem] lg:yst-pl-[19rem]",
					! isPremium && "xl:yst-pr-[22rem]",
				) }>
					<aside
						className="yst-sidebar yst-sidebar-nav yst-overflow-auto yst-hidden md:yst-block yst-fixed yst-pb-8 yst-pr-2 yst-bottom-0 yst-w-56 lg:yst-w-64">
						<SidebarNavigation.Sidebar className="yst-px-0.5">
							<Menu postTypes={ postTypes } taxonomies={ taxonomies } />
						</SidebarNavigation.Sidebar>
					</aside>
					<main className="yst-rounded-lg yst-bg-white yst-shadow">
						<ErrorBoundary FallbackComponent={ ErrorFallback }>
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
						</ErrorBoundary>
					</main>
					{ ! isPremium && <SidebarRecommendations /> }
				</div>
			</SidebarNavigation>
		</>
	);
};

export default App;
/* eslint-enable */
