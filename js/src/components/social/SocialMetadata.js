/* External dependencies */
import { Fragment } from "@wordpress/element";
import MetaboxCollapsible from "../MetaboxCollapsible";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Internal dependencies */
import FacebookContainer from "../../containers/FacebookEditor";
import TwitterContainer from "../../containers/TwitterEditor";

/**
 * Component that renders the social metadata collapsibles.
 *
 * @param {Object} props The props object.
 *
 * @returns {wp.Element} The social metadata collapsibles.
 */
const SocialMetadata = ( { isFacebookEnabled, isTwitterEnabled } ) => {
	return (
		<Fragment>
			{ isFacebookEnabled && <MetaboxCollapsible
				hasSeparator={ false }
				/* Translators: %s expands to Facebook. */
				title={ sprintf( __( "%s preview", "wordpress-seo" ), "Facebook" ) }
				initialIsOpen={ true }
			>
				<FacebookContainer />
			</MetaboxCollapsible> }
			{ isTwitterEnabled && <MetaboxCollapsible
				/* Translators: %s expands to Twitter. */
				title={ sprintf( __( "%s preview", "wordpress-seo" ), "Twitter" ) }
				// If facebook is NOT enabled, Twitter collapsible should NOT have a separator.
				hasSeparator={ isFacebookEnabled }
				initialIsOpen={ true }
			>
				<TwitterContainer />
			</MetaboxCollapsible> }
		</Fragment>
	);
};

SocialMetadata.propTypes = {
	isFacebookEnabled: PropTypes.bool,
	isTwitterEnabled: PropTypes.bool,
};

SocialMetadata.defaultProps = {
	isFacebookEnabled: true,
	isTwitterEnabled: true,
};

export default SocialMetadata;
