/* eslint-disable complexity */
/* External dependencies */
import { Fragment } from "@wordpress/element";
import MetaboxCollapsible from "../MetaboxCollapsible";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import FacebookContainer from "../../containers/FacebookEditor";
import TwitterContainer from "../../containers/TwitterEditor";
import { StyledDescription, StyledDescriptionTop } from "../../helpers/styledDescription";

const StyledSocialAppearanceMetabox = styled.div`
	padding: 16px;
`;

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
			{ ( useTwitterData && useOpenGraphData ) && <Fragment>
				<MetaboxCollapsible
					hasSeparator={ false }
					/* translators: Social media appearance refers to a preview of how a page will be represented on social media. */
					title={ __( "Social media appearance", "wordpress-seo" ) }
					initialIsOpen={ true }
				>
					<StyledDescriptionTop>{
						__( "Determine how your post should look on social media like Facebook, X, Instagram, WhatsApp, Threads, LinkedIn, Slack, and more.",
							"wordpress-seo" )
					}</StyledDescriptionTop>
					<FacebookContainer />
					<StyledDescription>
						{ __( "To customize the appearance of your post specifically for X, please fill out " +
							"the 'X appearance' settings below. If you leave these settings untouched, the 'Social media appearance' settings " +
							"mentioned above will also be applied for sharing on X.", "wordpress-seo" ) }
					</StyledDescription>
				</MetaboxCollapsible>
				<MetaboxCollapsible
					title={ __( "X appearance", "wordpress-seo" ) }
					// Always preview with separator when X appearance is displayed as a collapsible.
					hasSeparator={ true }
					initialIsOpen={ false }
				>
					<TwitterContainer />
				</MetaboxCollapsible>
			</Fragment> }
			{ ( useOpenGraphData && ! useTwitterData ) &&
				// If X is not enabled, don't display Social appearance as a collapsible.
				<StyledSocialAppearanceMetabox>
					<StyledDescriptionTop>{
						__( "Determine how your post should look on social media like Facebook, X, Instagram, WhatsApp, Threads, LinkedIn, Slack, and more.",
							"wordpress-seo" )
					}</StyledDescriptionTop>
					<FacebookContainer />
				</StyledSocialAppearanceMetabox>
			}
			{ ( ! useOpenGraphData && useTwitterData ) &&
				// If Open Graph is not enabled, don't display X appearance as a collapsible.
				<StyledSocialAppearanceMetabox>
					<StyledDescriptionTop>
						{ __( "To customize the appearance of your post specifically for X, please fill out " +
						"the 'X appearance' settings below.", "wordpress-seo" ) }
					</StyledDescriptionTop>
					<TwitterContainer />
				</StyledSocialAppearanceMetabox>
			}
		</Fragment>
	);
};

SocialMetadata.propTypes = {
	useOpenGraphData: PropTypes.bool.isRequired,
	useTwitterData: PropTypes.bool.isRequired,
};

export default SocialMetadata;
