/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";
import styled from "styled-components";
import { Fragment } from "@wordpress/element";

/* Internal dependencies */
import EditorModal from "../../../../containers/EditorModal";
import FacebookEditor from "../../../containers/FacebookEditor";
import TwitterEditor from "../../../containers/TwitterEditor";
import SocialSettingsNotice from "../../../../components//social/SocialSettingsNotice";
import SocialDescription from "../../../../components/social/SocialDescription";

import { Collapsible } from "@yoast/components";
import PropTypes from "prop-types";
import { colors } from "@yoast/style-guide";

const StyledModalCollapsible = styled( Collapsible )`
	h2 > button {
		padding-left: 0;
		padding-top: 16px;

		&:hover {
			background-color: #f0f0f0;
		}
	}

	div[class^="collapsible_content"] {
		padding: 24px 0;
		margin: 0 24px;
		border-top: 1px solid rgba(0,0,0,0.2);
	}

`;

/**
 * The ModalCollapsible.
 *
 * @param {Object} props The props
 *
 * @returns {JSX.Element} A ModalCollapsible component.
 */
const ModalCollapsible = ( props ) => {
	return <StyledModalCollapsible hasPadding={ false } hasSeparator={ true } { ...props } />;
};

const ShortSocialSettingsNotice = styled.legend`
	margin: 16px 0;
	padding: 0;
	color: ${ colors.$color_headings };
	font-size: 12px;
	font-weight: 300;
`;


/**
 * The Social Preview Modal.
 *
 * @param {Object} props The props.
 * @param {boolean} props.useOpenGraphData Whether or not the Open graph data is enabled in the settings.
 * @param {boolean} props.useTwitterData Whether or not the Twitter card data is enabled in the settings.
 *
 * @returns {JSX.Element} The Social Preview Modal.
 */
const SocialPreviewModal = ( props ) => {
	const { useOpenGraphData, useTwitterData } = props;
	if ( ! useOpenGraphData && ! useTwitterData ) {
		return;
	}
	return (
		<EditorModal
			title={ __( "Social appearance", "wordpress-seo" ) }
			id="yoast-social-preview-modal"
			shouldCloseOnClickOutside={ false }
		>
			{ useOpenGraphData &&
				<Fragment>
					<SocialDescription />
					<FacebookEditor />
					{ useTwitterData && <SocialSettingsNotice /> }
				</Fragment>
			}
			{ ( useOpenGraphData && useTwitterData ) && <ModalCollapsible
				/* Translators: %s expands to Twitter. */
				title={ sprintf( __( "%s appearance", "wordpress-seo" ), "Twitter" ) }
				// If Open graph data is NOT enabled, Twitter collapsible should NOT have a separator.
				hasSeparator={ true }
				initialIsOpen={ false }
			>
				<TwitterEditor />
			</ModalCollapsible>
			}
			{ ( ! useOpenGraphData && useTwitterData ) &&
				// If Open graph is not enabled, don't display Twitter editor as a collapsible.
				<Fragment>
					<ShortSocialSettingsNotice>{ __( "To customize the appearance of your post specifically for Twitter, please fill out " +
						"the 'Twitter appearance' settings below.", "wordpress-seo" ) }</ShortSocialSettingsNotice>
					<TwitterEditor />
				</Fragment>
			}
		</EditorModal>
	);
};

SocialPreviewModal.propTypes = {
	useOpenGraphData: PropTypes.bool.isRequired,
	useTwitterData: PropTypes.bool.isRequired,
};

export default SocialPreviewModal;
