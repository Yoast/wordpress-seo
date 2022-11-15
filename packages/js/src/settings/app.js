import { Transition } from "@headlessui/react";
import {
	AdjustmentsIcon,
	ArrowNarrowRightIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	ColorSwatchIcon,
	DesktopComputerIcon,
	NewspaperIcon,
} from "@heroicons/react/outline";
import { Fragment, useCallback, useEffect, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Button, ChildrenLimiter, ErrorBoundary, Title, useBeforeUnload, usePrevious, useSvgAria, useToggleState } from "@yoast/ui-library";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { map } from "lodash";
import PropTypes from "prop-types";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ErrorFallback, Notifications, Search, SidebarNavigation, SidebarRecommendations, YoastLogo } from "./components";
import { useRouterScrollRestore, useSelectSettings } from "./hooks";
import {
	AuthorArchives,
	Breadcrumbs,
	CrawlSettings,
	DateArchives,
	FormatArchives,
	Homepage,
	Media,
	PostType,
	Rss,
	SiteBasics,
	SiteConnections,
	SiteFeatures,
	SiteRepresentation,
	SpecialPages,
	Taxonomy,
} from "./routes";

/**
 * @param {Object[]} postTypes The post types to present.
 * @param {Object[]} taxonomies The taxonomies to present.
 * @param {string} [idSuffix] Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The menu element.
 */
const Menu = ( { postTypes, taxonomies, idSuffix = "" } ) => {
	const svgAriaProps = useSvgAria();

	const renderMoreOrLessButton = useCallback( ( { show, toggle, ariaProps } ) => {
		const ChevronIcon = useMemo( () => show ? ChevronUpIcon : ChevronDownIcon, [ show ] );

		return (
			<div className="yst-relative">
				<hr className="yst-absolute yst-inset-x-0 yst-top-1/2 yst-bg-slate-200" />
				<button
					className="yst-relative yst-flex yst-items-center yst-gap-2 yst-px-2.5 yst-py-1 yst-mx-auto yst-text-xs yst-font-medium yst-text-slate-700 yst-bg-slate-50 yst-rounded-full yst-border yst-border-slate-300 hover:yst-bg-white hover:yst-text-slate-800 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-primary-500 focus:yst-ring-offset-2"
					onClick={ toggle }
					{ ...ariaProps }
				>
					{ show ? __( "Show less", "wordpress-seo" ) : __( "Show more", "wordpress-seo" ) }
					<ChevronIcon
						className="yst-h-4 yst-w-4 yst-flex-shrink-0 yst-text-slate-400 group-hover:yst-text-slate-500 yst-stroke-3"
						{ ...svgAriaProps }
					/>
				</button>
			</div>
		);
	}, [] );

	return <>
		<header className="yst-px-3 yst-mb-6 yst-space-y-6">
			<Link to="/" className="yst-inline-block">
				<YoastLogo className="yst-w-40" { ...svgAriaProps } />
			</Link>
			<Search />
		</header>
		<div className="yst-px-0.5 yst-space-y-6">
			<SidebarNavigation.MenuItem
				id={ `menu-site-settings${ idSuffix && `-${ idSuffix }` }` }
				icon={ DesktopComputerIcon }
				label={ __( "General", "wordpress-seo" ) }
			>
				<SidebarNavigation.SubmenuItem to="/site-features" label={ __( "Site features", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/site-basics" label={ __( "Site basics", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem
					to="/site-representation"
					label={ __( "Site representation", "wordpress-seo" ) }
					idSuffix={ idSuffix }
				/>
				<SidebarNavigation.SubmenuItem to="/site-connections" label={ __( "Site connections", "wordpress-seo" ) } idSuffix={ idSuffix } />
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
							key={ `link-post-type-${ name }` }
							to={ `/post-type/${ route }` }
							label={ label }
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
					{ map( taxonomies, taxonomy => (
						<SidebarNavigation.SubmenuItem
							to={ `/taxonomy/${ taxonomy.route }` }
							label={ taxonomy.label }
							idSuffix={ idSuffix }
						/>
					) ) }
				</ChildrenLimiter>
			</SidebarNavigation.MenuItem>
			<SidebarNavigation.MenuItem
				id={ `menu-advanced-settings${ idSuffix && `-${ idSuffix }` }` }
				icon={ AdjustmentsIcon }
				label={ __( "Advanced", "wordpress-seo" ) }
				defaultOpen={ false }
			>
				<SidebarNavigation.SubmenuItem
					to="/crawl-optimization"
					label={
						<span className="yst-inline-flex yst-items-center yst-gap-1.5">
							{ __( "Crawl optimization", "wordpress-seo" ) }
							<Badge variant="upsell">Premium</Badge>
						</span>
					}
					idSuffix={ idSuffix }
				/>
				<SidebarNavigation.SubmenuItem to="/breadcrumbs" label={ __( "Breadcrumbs", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/author-archives" label={ __( "Author archives", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/date-archives" label={ __( "Date archives", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/format-archives" label={ __( "Format archives", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/special-pages" label={ __( "Special pages", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/media" label={ __( "Media pages", "wordpress-seo" ) } idSuffix={ idSuffix } />
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
 * @returns {JSX.Element} The element.
 */
const PremiumUpsellList = () => {
	const getPremiumLink = useSelectSettings( "selectLink", [], "https://yoa.st/17h" );

	return (
		<div className="yst-p-6 xl:yst-max-w-3xl yst-rounded-lg yst-bg-white yst-shadow">
			<Title as="h2" size="4" className="yst-text-xl yst-text-primary-500">
				{ sprintf(
					/* translators: %s expands to "Yoast SEO" Premium */
					__( "Upgrade to %s", "wordpress-seo" ),
					"Yoast SEO Premium"
				) }
			</Title>
			<ul className="yst-grid yst-grid-cols-1 sm:yst-grid-cols-2 yst-gap-x-6 yst-list-disc yst-pl-[1em] yst-list-outside yst-text-slate-800 yst-mt-6">
				<li>
					<span className="yst-font-semibold">{ __( "Multiple keyphrases", "wordpress-seo" ) }</span>
					:&nbsp;
					{ __( "Increase your SEO reach", "wordpress-seo" ) }
				</li>
				<li>
					<span className="yst-font-semibold">{ __( "No more dead links", "wordpress-seo" ) }</span>
					:&nbsp;
					{ __( "Easy redirect manager", "wordpress-seo" ) }
				</li>
				<li><span className="yst-font-semibold">{ __( "Superfast internal linking suggestions", "wordpress-seo" ) }</span></li>
				<li>
					<span className="yst-font-semibold">{ __( "Social media preview", "wordpress-seo" ) }</span>
					:&nbsp;
					{ __( "Facebook & Twitter", "wordpress-seo" ) }
				</li>
				<li><span className="yst-font-semibold">{ __( "24/7 email support", "wordpress-seo" ) }</span></li>
				<li><span className="yst-font-semibold">{ __( "No ads!", "wordpress-seo" ) }</span></li>
			</ul>
			<Button
				as="a" variant="upsell" size="large" href={ getPremiumLink }
				className="yst-gap-2 yst-mt-4"
			>
				{ sprintf(
					/* translators: %s expands to "Yoast SEO" Premium */
					__( "Get %s", "wordpress-seo" ),
					"Yoast SEO Premium"
				) }
				<ArrowNarrowRightIcon className="yst-w-4 yst-h-4" />
			</Button>
		</div>
	);
};

/**
 * @returns {JSX.Element} The Route Transition Effect.
 */
const RouteTransitionEffect = () => {
	const { pathname } = useLocation();
	const previousPathname = usePrevious( pathname );
	const [ hasRouteChanged, , , setHasRouteChangedTrue, setHasRouteChangedFalse ] = useToggleState( false );

	useEffect( () => {
		if ( pathname !== previousPathname ) {
			setHasRouteChangedTrue();
		}
	}, [ pathname, previousPathname, setHasRouteChangedTrue ] );

	return (
		<Transition
			as={ Fragment }
			show={ hasRouteChanged }
			afterEnter={ setHasRouteChangedFalse }
			enter="yst-transition-opacity yst-duration-150"
			enterFrom="yst-opacity-0"
			enterTo="yst-opacity-50"
			leave="yst-transition-opacity yst-duration-150"
			leaveFrom="yst-opacity-50"
			leaveTo="yst-opacity-0"
		>
			<div className="yst-absolute yst-inset-0 yst-bg-white yst-select-none yst-rounded-lg" />
		</Transition>
	);
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
		__( "There are unsaved changes on this page. Leaving means that those changes will be lost. Are you sure you want to leave this page?", "wordpress-seo" )
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
				<div className="yst-p-4 md:yst-p-8 yst-flex yst-gap-4">
					<aside className="yst-sidebar yst-sidebar-nav yst-shrink-0 yst-hidden md:yst-block yst-pb-6 yst-bottom-0 yst-w-56 lg:yst-w-64">
						<SidebarNavigation.Sidebar>
							<Menu postTypes={ postTypes } taxonomies={ taxonomies } />
						</SidebarNavigation.Sidebar>
					</aside>
					<div className={ classNames( "yst-flex yst-grow yst-flex-wrap", ! isPremium && "xl:yst-pr-[20.5rem]" ) }>
						<div className="yst-grow yst-space-y-6 yst-mb-6 xl:yst-mb-0">
							<main className="yst-relative yst-rounded-lg yst-bg-white yst-shadow">
								<ErrorBoundary FallbackComponent={ ErrorFallback }>
									<Routes>
										<Route path="author-archives" element={ <AuthorArchives /> } />
										<Route path="breadcrumbs" element={ <Breadcrumbs /> } />
										<Route path="crawl-optimization" element={ <CrawlSettings /> } />
										<Route path="date-archives" element={ <DateArchives /> } />
										<Route path="homepage" element={ <Homepage /> } />
										<Route path="format-archives" element={ <FormatArchives /> } />
										<Route path="media" element={ <Media /> } />
										<Route path="rss" element={ <Rss /> } />
										<Route path="site-basics" element={ <SiteBasics /> } />
										<Route path="site-connections" element={ <SiteConnections /> } />
										<Route path="site-representation" element={ <SiteRepresentation /> } />
										<Route path="site-features" element={ <SiteFeatures /> } />
										<Route path="special-pages" element={ <SpecialPages /> } />
										<Route path="post-type">
											{ map( postTypes, postType => (
												<Route
													key={ `route-post-type-${ postType.name }` }
													path={ postType.route }
													element={ <PostType { ...postType } /> }
												/>
											) ) }
										</Route>
										<Route path="taxonomy">
											{ map( taxonomies, taxonomy => (
												<Route
													key={ `route-taxonomy-${ taxonomy.name }` }
													path={ taxonomy.route }
													element={ <Taxonomy { ...taxonomy } /> }
												/>
											) ) }
										</Route>
										<Route path="*" element={ <Navigate to="/site-features" replace={ true } /> } />
									</Routes>
									<RouteTransitionEffect />
								</ErrorBoundary>
							</main>
							{ ! isPremium && <PremiumUpsellList /> }
						</div>
						{ ! isPremium && <SidebarRecommendations /> }
					</div>
				</div>
			</SidebarNavigation>
		</>
	);
};

export default App;
