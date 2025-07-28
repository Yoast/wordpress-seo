import { useSvgAria } from "@yoast/ui-library";
import { CodeIcon, CogIcon, SwitchHorizontalIcon } from "@heroicons/react/outline";
import { LockClosedIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import { MenuItemLink, YoastLogo } from "../../shared-admin/components";
import { ROUTES } from "../constants";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";


/**
 * @param {string} [idSuffix] Extra id suffix. Can prevent double IDs on the page.
 * @returns {JSX.Element} The menu element.
 */
export const Menu = ( { idSuffix = "" } ) => {
	const svgAriaProps = useSvgAria();

	return <>
		<header className="yst-mb-6 yst-space-y-6">
			<Link
				id={ `link-yoast-logo${ idSuffix }` }
				to="/"
				className="yst-px-3 yst-inline-block yst-rounded-md focus:yst-ring-primary-500"
				aria-label="Yoast SEO"
			>
				<YoastLogo className="yst-w-40" { ...svgAriaProps } />
			</Link>
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
			<li
				className="yst-flex
				yst-items-center yst-gap-3
				yst-px-3 yst-py-2
				yst-text-slate-800
				yst-cursor-not-allowed
				yst-opacity-50"
			>
				<CodeIcon
					className="yst-sidebar-navigation
					__icon yst-w-6 yst-h-6"
				/>
				{ __( "Regex redirects", "wordpress-seo" ) }
				<div className="yst-bg-amber-200 yst-text-amber-900 yst-rounded-2xl yst-flext yst-items-center yst-justify-center yst-py-[2px] yst-px-2">
					<LockClosedIcon
						className="yst-sidebar-navigation
					__icon yst-w-2.5 yst-h-2.5"
					/>
				</div>
			</li>
			<li
				className="yst-flex
				yst-items-center yst-gap-3
				yst-px-3 yst-py-2
				yst-text-slate-800
				yst-cursor-not-allowed
				yst-opacity-50"
			>
				<CogIcon
					className="yst-sidebar-navigation
					__icon yst-w-6 yst-h-6"
				/>
				{ __( "Redirect method", "wordpress-seo" ) }
				<div className="yst-bg-amber-200 yst-text-amber-900 yst-rounded-2xl yst-flext yst-items-center yst-justify-center yst-py-[2px] yst-px-2">
					<LockClosedIcon
						className="yst-sidebar-navigation
					__icon yst-w-2.5 yst-h-2.5"
					/>
				</div>
			</li>
		</ul>
	</>;
};

Menu.propTypes = {
	idSuffix: PropTypes.string,
};
