import { __, sprintf } from "@wordpress/i18n";
import { Title } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useDocumentTitle, useSpokenMessage } from "../hooks";

/**
 * @param {Object} props The properties.
 * @param {JSX.node} children The children.
 * @param {string} title The title.
 * @param {JSX.node} [description] The description.
 * @returns {JSX.Element} The route layout component.
 */
const RouteLayout = ( { children, title, description } ) => {
	const documentTitle = useDocumentTitle( { prefix: `${ title } ‹ ` } );

	useSpokenMessage( sprintf(
		/* translators: 1: Settings' section title, 2: Yoast SEO */
		__( "%1$s Settings - %2$s", "wordpress-seo" ),
		title,
		"Yoast SEO"
	) );

	return (
		<>
			<Helmet>
				<title>{ documentTitle }</title>
			</Helmet>
			<header className="yst-p-8 yst-border-b yst-border-slate-200">
				<div className="yst-max-w-screen-sm">
					<Title>{ title }</Title>
					{ description && <p className="yst-text-tiny yst-mt-3">{ description }</p> }
				</div>
			</header>
			{ children }
		</>
	);
};

RouteLayout.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.node,
};
RouteLayout.defaultProps = {
	description: null,
};

export default RouteLayout;
