import ArrowLeftIcon from "@heroicons/react/solid/ArrowLeftIcon";
import { __ } from "@wordpress/i18n";
import { Link } from "@yoast/ui-library";

/**
 * The "Back to Tools" link shown above the bulk editor sub-navigation.
 *
 * @param {Object} props      The props.
 * @param {string} props.href The URL of the Tools page (provided via localized data by Free-FE 1).
 *
 * @returns {JSX.Element} The link.
 */
export const BackToToolsLink = ( { href } ) => (
	<Link
		href={ href }
		className="yst-flex yst-items-center yst-gap-1.5 yst-no-underline yst-text-slate-600 hover:yst-text-slate-900"
	>
		<ArrowLeftIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180" aria-hidden="true" />
		{ __( "Back to Tools", "wordpress-seo" ) }
	</Link>
);
