import { useSvgAria } from "@yoast/ui-library";
import { useSelectRedirects } from "../hooks";
import { CodeIcon, CogIcon, SwitchHorizontalIcon } from "@heroicons/react/outline";
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

	return <>
		<header className="yst-mb-6 yst-space-y-6">
			<Link
				id={ `link-yoast-logo${ idSuffix }` }
				to="/"
				className="yst-px-3 yst-inline-block yst-rounded-md focus:yst-ring-primary-500"
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
					<SwitchHorizontalIcon className="yst-sidebar-navigation__icon yst-w-6 yst-h-6" />
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
		</ul>
	</>;
};

Menu.propTypes = {
	idSuffix: PropTypes.string,
};
