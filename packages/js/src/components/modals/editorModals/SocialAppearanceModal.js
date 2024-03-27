/* eslint-disable complexity */
/* External dependencies */
import { ShareIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import EditorModal from "../../../containers/EditorModal";
import FacebookEditor from "../../../containers/FacebookEditor";
import TwitterEditor from "../../../containers/TwitterEditor";
import ModalCollapsible from "../../ModalCollapsible";
import { StyledDescription, StyledDescriptionTop } from "../../../helpers/styledDescription";
import { useSvgAria } from "@yoast/ui-library/src";


const StyledHeroIcon = styled( ShareIcon )`
	width: 18px;
	height: 18px;
	margin: 3px;
`;

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

	const svgAriaProps = useSvgAria();

	return (
		<EditorModal
			/* translators: Social media appearance refers to a preview of how a page will be represented on social media. */
			title={ __( "Social media appearance", "wordpress-seo" ) }
			id="yoast-social-appearance-modal"
			shouldCloseOnClickOutside={ false }
			SuffixHeroIcon={ <StyledHeroIcon className="yst-text-slate-500" { ...svgAriaProps } /> }
		>
			{ useOpenGraphData &&
				<Fragment>
					<StyledDescriptionTop>{
						__( "Determine how your post should look on social media like Facebook, X, Instagram, WhatsApp, Threads, LinkedIn, Slack, and more.",
							"wordpress-seo" )
					}</StyledDescriptionTop>
					<FacebookEditor />
					{ useTwitterData && <StyledDescription>
						{ __( "To customize the appearance of your post specifically for X, please fill out " +
						"the 'X appearance' settings below. If you leave these settings untouched, the 'Social media appearance' settings " +
						"mentioned above will also be applied for sharing on X.", "wordpress-seo" ) }
					</StyledDescription> }
				</Fragment>
			}
			{ ( useOpenGraphData && useTwitterData ) && <ModalCollapsible
				title={ __( "X appearance", "wordpress-seo" ) }
				// Always preview with separator when X appearance is displayed as a collapsible.
				hasSeparator={ true }
				initialIsOpen={ false }
			>
				<TwitterEditor />
			</ModalCollapsible>
			}
			{ ( ! useOpenGraphData && useTwitterData ) &&
				// If Open Graph is not enabled, don't display X editor as a collapsible.
				<Fragment>
					<StyledDescriptionTop>
						{ __( "To customize the appearance of your post specifically for X, please fill out " +
						"the 'X appearance' settings below.", "wordpress-seo" ) }
					</StyledDescriptionTop>
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
