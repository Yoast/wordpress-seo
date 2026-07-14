import ArrowLeftIcon from "@heroicons/react/solid/ArrowLeftIcon";
import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Link } from "@yoast/ui-library";
import { noop } from "lodash";

/**
 * The "Back to Tools" link shown above the bulk editor sub-navigation. The click is routed through onNavigate so a
 * hard page navigation can be guarded when there are unsaved edits.
 *
 * @param {Object}   props              The props.
 * @param {string}   props.href         The URL of the Tools page (provided via localized data by Free-FE 1).
 * @param {Function} [props.onNavigate=noop] Called with (event, href) when the link is clicked, to guard the navigation.
 *
 * @returns {JSX.Element} The link.
 */
export const BackToToolsLink = ( { href, onNavigate = noop } ) => {
	const handleClick = useCallback( ( event ) => onNavigate( event, href ), [ onNavigate, href ] );

	return (
		<Link
			href={ href }
			onClick={ handleClick }
			className="yst-flex yst-items-center yst-gap-1.5 yst-rounded-md yst-px-3 yst-py-2 yst-text-sm yst-font-medium yst-no-underline yst-text-slate-800 hover:yst-bg-slate-50 hover:yst-text-slate-900"
		>
			<ArrowLeftIcon className="yst-w-4 yst-h-4 yst-text-slate-400 rtl:yst-rotate-180" aria-hidden="true" />
			{ __( "Back to Tools", "wordpress-seo" ) }
		</Link>
	);
};
