/* External dependencies */
import { Fragment } from "@wordpress/element";
import MetaboxCollapsible from "../MetaboxCollapsible";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/* Internal dependencies */
import FacebookContainer from "../../containers/FacebookEditor";
import TwitterContainer from "../../containers/TwitterEditor";
import styled from "styled-components";
import { colors } from "@yoast/style-guide";

const ModalDescription = styled.legend`
	margin: 8px 0;
	padding: 0;
	color: ${ colors.$color_headings };
	font-size: 12px;
	font-weight: 300;
`;

/**
 * Component that renders the social metadata collapsibles.
 *
 * @param {Object} props The props object.
 *
 * @returns {wp.Element} The social metadata collapsibles.
 */
const SocialMetadata = ( { displayFacebook, displayTwitter } ) => {
	return (
		<Fragment>
			{ displayFacebook && <MetaboxCollapsible
				hasSeparator={ false }
				/* translators: Social (media) appearance refers to a preview of how a page will be represented on social media. */
				title={ __( "Social appearance", "wordpress-seo" ) }
				initialIsOpen={ true }
			>
				<ModalDescription>{ __( "Determine how your post should look on social media like Facebook, Twitter, Instagram, WhatsApp, " +
					"Threads, LinkedIn, Slack, and more.", "wordpress-seo" ) }</ModalDescription>
				<FacebookContainer />
			</MetaboxCollapsible> }
			{ displayTwitter && <MetaboxCollapsible
				title={ __( "Twitter appearance", "wordpress-seo" ) }
				// If facebook is NOT enabled, Twitter collapsible should NOT have a separator.
				hasSeparator={ displayFacebook }
				initialIsOpen={ false }
			>
				<TwitterContainer />
			</MetaboxCollapsible> }
		</Fragment>
	);
};

SocialMetadata.propTypes = {
	displayFacebook: PropTypes.bool.isRequired,
	displayTwitter: PropTypes.bool.isRequired,
};

export default SocialMetadata;
