// eslint-disable-next-line no-restricted-imports
import { useCallback, useMemo } from "react";
import { ChildrenLimiter, SidebarNavigation, useSvgAria } from "@yoast/ui-library";
import { useSelectRedirects } from "../hooks";
import { ChevronDownIcon, ChevronUpIcon, CodeIcon, CogIcon, DownloadIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { MenuItemLink, Search, YoastLogo } from "../../shared-admin/components";
import { ROUTES } from "../constants";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

const SEARCH_REGEXP = new RegExp();

/**
 * @param {string} [idSuffix] Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The menu element.
 */
export const Menu = ( { idSuffix = "" } ) => {
	const svgAriaProps = useSvgAria();
	const isPremium = useSelectRedirects( "selectPreference", [], "isPremium" );
	const userLocale = useSelectRedirects( "selectPreference", [], "userLocale" );
	const queryableSearchIndex = useSelectRedirects( "selectQueryableSearchIndex" );

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
			<Search
				buttonId={ `button-search${ idSuffix }` }
				userLocale={ userLocale }
				queryableSearchIndex={ queryableSearchIndex }
				keyFilterPattern={ SEARCH_REGEXP }
			/>
		</header>
		<ul className="yst-mt-1 yst-px-0.5 yst-space-y-4">
			<MenuItemLink
				to={ ROUTES.redirects }
				label={ <>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none" viewBox="0 0 24 24"
						strokeWidth="1.5" stroke="currentColor"
						className="yst-sidebar-navigation__icon yst-w-6 yst-h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
						/>
					</svg>
					{ __( "Redirects", "wordpress-seo" ) }
				</> }
				idSuffix={ idSuffix }
				className="yst-gap-3"
			/>
			<MenuItemLink
				to={ ROUTES.regexRedirects }
				label={ <>
					<CodeIcon className="yst-sidebar-navigation__icon yst-w-6 yst-h-6" />
					{ __( "Regex redirects", "wordpress-seo" ) }
				</> }
				idSuffix={ idSuffix }
				className="yst-gap-3"
			/>
			<MenuItemLink
				to={ ROUTES.redirectMethod }
				label={ <>
					<CogIcon className="yst-sidebar-navigation__icon yst-w-6 yst-h-6" />
					{ __( "Redirect method", "wordpress-seo" ) }
				</> }
				idSuffix={ idSuffix }
				className="yst-gap-3"
			/>
			<SidebarNavigation.MenuItem
				id={ `menu-content-types${ idSuffix }` }
				icon={ DownloadIcon }
				label={ __( "Import & export", "wordpress-seo" ) }
			>
				<ChildrenLimiter limit={ 2 } renderButton={ renderMoreOrLessButton }>
					<MenuItemLink to="/import-redirects" label={ __( "Import redirects", "wordpress-seo" ) } idSuffix={ idSuffix } />
					<MenuItemLink to="/export-redirects" label={ __( "Export redirects", "wordpress-seo" ) } idSuffix={ idSuffix } />
				</ChildrenLimiter>
			</SidebarNavigation.MenuItem>
		</ul>
	</>;
};

Menu.propTypes = {
	idSuffix: PropTypes.string,
};
