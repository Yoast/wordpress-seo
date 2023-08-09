/* External dependencies */
import { Fragment } from "@wordpress/element";
import MetaboxCollapsible from "../MetaboxCollapsible";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Internal dependencies */
import FacebookContainer from "../../containers/FacebookEditor";
import TwitterContainer from "../../containers/TwitterEditor";
import SocialSettingsNotice from "../social/SocialSettingsNotice";
import SocialDescription from "../social/SocialDescription";


/**
 * Component that renders the social metadata collapsibles.
 *
 * @param {Object} props The props object.
 *
 * @returns {wp.Element} The social metadata collapsibles.
 */
const SocialMetadata = ( { useOpenGraphData, useTwitterData } ) => {
	return (
		<Fragment>
			{ useOpenGraphData && <MetaboxCollapsible
				hasSeparator={ false }
				/* Translators: %s expands to Social. */
				title={ sprintf( __( "%s appearance", "wordpress-seo" ), "Social" ) }
				initialIsOpen={ true }
			>
				<SocialDescription />
				<FacebookContainer />
				{ useTwitterData && <SocialSettingsNotice /> }
			</MetaboxCollapsible> }
			{ useTwitterData && <MetaboxCollapsible
				/* Translators: %s expands to Twitter. */
				title={ sprintf( __( "%s appearance", "wordpress-seo" ), "Twitter" ) }
				// If facebook is NOT enabled, Twitter collapsible should NOT have a separator.
				hasSeparator={ useOpenGraphData }
				initialIsOpen={ false }
			>
				<TwitterContainer />
			</MetaboxCollapsible> }
		</Fragment>
	);
};

SocialMetadata.propTypes = {
	useOpenGraphData: PropTypes.bool.isRequired,
	useTwitterData: PropTypes.bool.isRequired,
};

export default SocialMetadata;
