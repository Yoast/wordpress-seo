import { __, sprintf } from "@wordpress/i18n";
import { Title } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { LiveAnnouncer, LiveMessage } from "react-aria-live";
import { Helmet } from "react-helmet";

/**
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
	const ariaLiveTitle = sprintf(
		/* translators: 1: Settings' section title, 2: Yoast SEO */
		__( "%1$s Dashboard - %2$s", "wordpress-seo" ),
		title,
		"Yoast SEO"
	);
	return (
		<LiveAnnouncer>
			<LiveMessage message={ ariaLiveTitle } aria-live="polite" />
			<Helmet>
				<title>Dashboard</title>
			</Helmet>
			<header className="yst-p-8 yst-border-b yst-border-slate-200">
				<div className="yst-max-w-screen-sm">
					<Title>{ title }</Title>
					{ description && <p className="yst-text-tiny yst-mt-3">{ description }</p> }
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
