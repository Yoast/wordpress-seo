import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { Button, Title } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { LiveAnnouncer, LiveMessage } from "react-aria-live";
import { Helmet } from "react-helmet";
import { useSelectRedirects } from "../hooks";
import { LockClosedIcon } from "@heroicons/react/outline";
import { STORE_NAME } from "../constants";

/**
 * Route layout wrapper with accessible title and description.
 * @param {Object} props The properties.
 * @param {JSX.node} children The children.
 * @param {string} title The title.
 * @param {JSX.node} [description] The description.
 * @returns {JSX.Element} The route layout component.
 */
export const RouteLayout = ( {
	children,
	title,
	description,
} ) => {
	const documentTitle = useSelect( select => select( STORE_NAME ).selectDocumentFullTitle( { prefix: title } ), [] );
	const ariaLiveTitle = sprintf(
		"%1$s - %2$s",
		title,
		"Yoast SEO"
	);

	const upsellLink = useSelectRedirects( "selectLink", [], "https://yoa.st/redirect-manager-upsell" );

	return (
		<LiveAnnouncer>
			<LiveMessage message={ ariaLiveTitle } aria-live="polite" />
			<Helmet>
				<title>{ documentTitle }</title>
			</Helmet>
			<header className="yst-p-8 yst-border-b yst-border-slate-200">
				<div className="yst-max-w-screen-sm">
					<Title>{ title }</Title>
					{ description && <p className="yst-text-tiny yst-mt-3">{ description }</p> }
					<Button
						as="a"
						href={ upsellLink }
						target="_blank"
						variant="upsell"
						size="large"
						className="yst-flex yst-gap-1.5 yst-mt-6 yst-w-fit"
					>
						<LockClosedIcon className="yst-w-4 yst-h-4" />
						<span>{ __( "Unlock with Premium", "wordpress-seo" ) }</span>
					</Button>
				</div>
			</header>
			{ children }
		</LiveAnnouncer>
	);
};

RouteLayout.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.node,
};
