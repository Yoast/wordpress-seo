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
 * @returns {React.Component} The social metadata collapsibles.
 */
const SocialMetadata = ( { isFacebookEnabled, isTwitterEnabled } ) => {
	return (
		<Fragment>
			{ isFacebookEnabled && <MetaboxCollapsible
				hasPadding={ true }
				hasSeparator={ true }
				/* Translators: %s expands to Facebook. */
				title={ sprintf( __( "%s preview", "wordpress-seo" ), "Facebook" ) }
				initialIsOpen={ true }
			>
				<FacebookContainer />
			</MetaboxCollapsible> }
			{ isTwitterEnabled && <MetaboxCollapsible
				hasPadding={ true }
				hasSeparator={ true }
				/* Translators: %s expands to Twitter. */
				title={ sprintf( __( "%s preview", "wordpress-seo" ), "Twitter" ) }
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
