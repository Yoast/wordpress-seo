/* External dependencies */
import { Fragment } from "@wordpress/element";
import MetaboxCollapsible from "../MetaboxCollapsible";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Internal dependencies */
import FacebookContainer from "../../containers/FacebookEditor";
import TwitterContainer from "../../containers/TwitterEditor";
import StyledDescription from "../../helpers/styledDescription";

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
				<StyledDescription>{
					__( "Determine how your post should look on social media like Facebook, Twitter, Instagram, WhatsApp, Threads, LinkedIn, Slack, and more.",
						"wordpress-seo" )
				}</StyledDescription>
				<FacebookContainer />
				{ useTwitterData && <StyledDescription>
					{ __( "To customize the appearance of your post specifically for Twitter, please fill out " +
						"the 'Twitter appearance' settings below. If you leave these settings untouched, the 'Social appearance' settings " +
						"mentioned above will also be applied for sharing on Twitter.", "wordpress-seo" ) }
				</StyledDescription>
				}
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
