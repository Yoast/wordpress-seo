/* eslint-disable complexity */

/* External dependencies */
import { __, sprintf } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import PropTypes from "prop-types";

/* Internal dependencies */
import EditorModal from "../../../../containers/EditorModal";
import FacebookEditor from "../../../containers/FacebookEditor";
import TwitterEditor from "../../../containers/TwitterEditor";
import ModalCollapsible from "../../../../components/ModalCollapsible";
import StyledDescription from "../../../../helpers/styledDescription";

/**
 * The Social Appearance Modal.
 *
 * @param {Object} props The props.
 * @param {boolean} props.useOpenGraphData Whether or not the Open graph data is enabled in the settings.
 * @param {boolean} props.useTwitterData Whether or not the Twitter card data is enabled in the settings.
 *
 * @returns {JSX.Element} The Social Appearance Modal.
 */
const SocialAppearanceModal = ( props ) => {
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
					<StyledDescription>{
						__( "Determine how your post should look on social media like Facebook, Twitter, Instagram, WhatsApp, Threads, LinkedIn, Slack, and more.",
							"wordpress-seo" )
					}</StyledDescription>
					<FacebookEditor />
					{ useTwitterData && <StyledDescription>
						{ __( "To customize the appearance of your post specifically for Twitter, please fill out " +
							"the 'Twitter appearance' settings below. If you leave these settings untouched, the 'Social appearance' settings " +
							"mentioned above will also be applied for sharing on Twitter.", "wordpress-seo" ) }
					</StyledDescription> }
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
					<StyledDescription>{ __( "To customize the appearance of your post specifically for Twitter, please fill out " +
						"the 'Twitter appearance' settings below.", "wordpress-seo" ) }</StyledDescription>
					<TwitterEditor />
				</Fragment>
			}
		</EditorModal>
	);
};

SocialAppearanceModal.propTypes = {
	useOpenGraphData: PropTypes.bool.isRequired,
	useTwitterData: PropTypes.bool.isRequired,
};

export default SocialAppearanceModal;
