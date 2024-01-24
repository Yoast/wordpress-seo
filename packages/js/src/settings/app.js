/* eslint-disable react/jsx-max-depth */
import { Transition } from "@headlessui/react";
import { AdjustmentsIcon, ArrowNarrowRightIcon, ColorSwatchIcon, DesktopComputerIcon, NewspaperIcon } from "@heroicons/react/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { createInterpolateElement, useCallback, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Button, ChildrenLimiter, ErrorBoundary, Paper, Title, useBeforeUnload, useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { map } from "lodash";
import PropTypes from "prop-types";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { getPremiumBenefits } from "../helpers/get-premium-benefits";
import { ErrorFallback, Notifications, Search, SidebarNavigation, SidebarRecommendations, YoastLogo } from "./components";
import { useRouterScrollRestore, useSelectSettings } from "./hooks";
import {
	AuthorArchives,
	Breadcrumbs,
	CrawlSettings,
	DateArchives,
	FormatArchives,
	Homepage,
	MediaPages,
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
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );

	const renderMoreOrLessButton = useCallback( ( { show, toggle, ariaProps } ) => {
		const ChevronIcon = useMemo( () => show ? ChevronUpIcon : ChevronDownIcon, [ show ] );

		return (
			<div className="yst-relative">
				<hr className="yst-absolute yst-inset-x-0 yst-top-1/2 yst-bg-slate-200" />
				<button
					type="button"
					className="yst-relative yst-flex yst-items-center yst-gap-1.5 yst-px-2.5 yst-py-1 yst-mx-auto yst-text-xs yst-font-medium yst-text-slate-700 yst-bg-slate-50 yst-rounded-full yst-border yst-border-slate-300 hover:yst-bg-white hover:yst-text-slate-800 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-primary-500 focus:yst-ring-offset-2"
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
			<Link
				id={ `link-yoast-logo${ idSuffix }` }
				to="/"
				className="yst-inline-block yst-rounded-md focus:yst-ring-primary-500"
				aria-label={ `Yoast SEO${ isPremium ? " Premium" : "" }` }
			>
				<YoastLogo className="yst-w-40" { ...svgAriaProps } />
			</Link>
			<Search buttonId={ `button-search${ idSuffix }` } />
		</header>
		<div className="yst-px-0.5 yst-space-y-6">
			<SidebarNavigation.MenuItem
				id={ `menu-general${ idSuffix }` }
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
				id={ `menu-content-types${ idSuffix }` }
				icon={ NewspaperIcon }
				label={ __( "Content types", "wordpress-seo" ) }
			>
				<ChildrenLimiter limit={ 5 } renderButton={ renderMoreOrLessButton }>
					<SidebarNavigation.SubmenuItem to="/homepage" label={ __( "Homepage", "wordpress-seo" ) } idSuffix={ idSuffix } />
					{ map( postTypes, ( { name, route, label, isNew } ) => (
						<SidebarNavigation.SubmenuItem
							key={ `link-post-type-${ name }` }
							to={ `/post-type/${ route }` }
							label={ <span className="yst-inline-flex yst-items-center yst-gap-1.5">
								{ label }
								{ isNew && <Badge variant="info">{ __( "New", "wordpress-seo" ) }</Badge> }
							</span> }
							idSuffix={ idSuffix }
						/>
					) ) }
				</ChildrenLimiter>
			</SidebarNavigation.MenuItem>
			<SidebarNavigation.MenuItem
				id={ `menu-categories-and-tags${ idSuffix }` }
				icon={ ColorSwatchIcon }
				label={ __( "Categories & tags", "wordpress-seo" ) }
			>
				<ChildrenLimiter limit={ 5 } renderButton={ renderMoreOrLessButton }>
					{ map( taxonomies, taxonomy => (
						<SidebarNavigation.SubmenuItem
							key={ `link-taxonomy-${ taxonomy.name }` }
							to={ `/taxonomy/${ taxonomy.route }` }
							label={ <span className="yst-inline-flex yst-items-center yst-gap-1.5">
								{ taxonomy.label }
								{ taxonomy.isNew && <Badge variant="info">{ __( "New", "wordpress-seo" ) }</Badge> }
							</span> }
							idSuffix={ idSuffix }
						/>
					) ) }
				</ChildrenLimiter>
			</SidebarNavigation.MenuItem>
			<SidebarNavigation.MenuItem
				id={ `menu-advanced${ idSuffix }` }
				icon={ AdjustmentsIcon }
				label={ __( "Advanced", "wordpress-seo" ) }
				defaultOpen={ false }
			>
				<SidebarNavigation.SubmenuItem
					to="/crawl-optimization"
					label={ __( "Crawl optimization", "wordpress-seo" ) }
					idSuffix={ idSuffix }
				/>
				<SidebarNavigation.SubmenuItem to="/breadcrumbs" label={ __( "Breadcrumbs", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/author-archives" label={ __( "Author archives", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/date-archives" label={ __( "Date archives", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/format-archives" label={ __( "Format archives", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/special-pages" label={ __( "Special pages", "wordpress-seo" ) } idSuffix={ idSuffix } />
				<SidebarNavigation.SubmenuItem to="/media-pages" label={ __( "Media pages", "wordpress-seo" ) } idSuffix={ idSuffix } />
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
	const premiumLink = useSelectSettings( "selectLink", [], "https://yoa.st/17h" );
	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );
	const promotions = useSelectSettings( "selectPreference", [], "promotions", [] );
	const isBlackFriday = promotions.includes( "black-friday-2023-promotion" );

	return (
		<Paper as="div" className="xl:yst-max-w-3xl">
			{ isBlackFriday && <div className="yst-rounded-t-lg yst-h-9 yst-flex yst-justify-between yst-items-center yst-bg-black yst-text-amber-300 yst-px-4 yst-text-lg yst-border-b yst-border-amber-300 yst-border-solid yst-font-semibold">
				<div>{ __( "BLACK FRIDAY", "wordpress-seo" ) }</div>
				<div>{ __( "30% OFF", "wordpress-seo" ) }</div>
			</div> }
			<div className="yst-p-6 yst-flex yst-flex-col">
				<Title as="h2" size="4" className="yst-text-xl yst-text-primary-500">
					{ sprintf(
					/* translators: %s expands to "Yoast SEO" Premium */
						__( "Upgrade to %s", "wordpress-seo" ),
						"Yoast SEO Premium"
					) }
				</Title>
				<ul className="yst-grid yst-grid-cols-1 sm:yst-grid-cols-2 yst-gap-x-6 yst-list-disc yst-pl-[1em] yst-list-outside yst-text-slate-800 yst-mt-6">
					{ getPremiumBenefits().map( ( benefit, index ) => (
						<li key={ `upsell-benefit-${ index }` }>
							{ createInterpolateElement( benefit, { strong: <span className="yst-font-semibold" /> } ) }
						</li>
					) ) }
				</ul>
				<Button
					as="a"
					variant="upsell"
					size="large"
					href={ premiumLink }
					className="yst-gap-2 yst-mt-4"
					target="_blank"
					rel="noopener"
					{ ...premiumUpsellConfig }
				>
					{ isBlackFriday ? __( "Claim your 30% off now!", "wordpress-seo" ) : sprintf(
					/* translators: %s expands to "Yoast SEO" Premium */
						__( "Explore %s now!", "wordpress-seo" ),
						"Yoast SEO Premium"
					) }
					<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-icon-rtl" />
				</Button>
			</div>
		</Paper>
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
					openButtonId="button-open-settings-navigation-mobile"
					closeButtonId="button-close-settings-navigation-mobile"
					/* translators: Hidden accessibility text. */
					openButtonScreenReaderText={ __( "Open settings navigation", "wordpress-seo" ) }
					/* translators: Hidden accessibility text. */
					closeButtonScreenReaderText={ __( "Close settings navigation", "wordpress-seo" ) }
					aria-label={ __( "Settings navigation", "wordpress-seo" ) }
				>
					<Menu idSuffix="-mobile" postTypes={ postTypes } taxonomies={ taxonomies } />
				</SidebarNavigation.Mobile>
				<div className="yst-p-4 min-[783px]:yst-p-8 yst-flex yst-gap-4">
					<aside className="yst-sidebar yst-sidebar-nav yst-shrink-0 yst-hidden min-[783px]:yst-block yst-pb-6 yst-bottom-0 yst-w-56">
						<SidebarNavigation.Sidebar>
							<Menu postTypes={ postTypes } taxonomies={ taxonomies } />
						</SidebarNavigation.Sidebar>
					</aside>
					<div className={ classNames( "yst-flex yst-grow yst-flex-wrap", ! isPremium && "xl:yst-pr-[17.5rem]" ) }>
						<div className="yst-grow yst-space-y-6 yst-mb-8 xl:yst-mb-0">
							<Paper as="main">
								<ErrorBoundary FallbackComponent={ ErrorFallback }>
									<Transition
										key={ pathname }
										appear={ true }
										show={ true }
										enter="yst-transition-opacity yst-delay-100 yst-duration-300"
										enterFrom="yst-opacity-0"
										enterTo="yst-opacity-100"
									>
										<Routes>
											<Route path="author-archives" element={ <AuthorArchives /> } />
											<Route path="breadcrumbs" element={ <Breadcrumbs /> } />
											<Route path="crawl-optimization" element={ <CrawlSettings /> } />
											<Route path="date-archives" element={ <DateArchives /> } />
											<Route path="homepage" element={ <Homepage /> } />
											<Route path="format-archives" element={ <FormatArchives /> } />
											<Route path="media-pages" element={ <MediaPages /> } />
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
									</Transition>
								</ErrorBoundary>
							</Paper>
							{ ! isPremium && <PremiumUpsellList /> }
						</div>
						<SidebarRecommendations />
					</div>
				</div>
			</SidebarNavigation>
		</>
	);
};

export default App;
