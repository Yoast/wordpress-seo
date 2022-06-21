/* global wpseoAdminL10n */

/* External dependencies */
import interpolateComponents from "interpolate-components";
import { __, sprintf } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import { useState, useCallback } from "@wordpress/element";

/* Internal dependencies */
import { YoastSeoIcon } from "@yoast/components";
import { colors } from "@yoast/style-guide";
import { ModalContainer, ModalIcon } from "./Container";
import Modal, { defaultModalClassName } from "./Modal";
import SidebarButton from "../SidebarButton";
import UpsellBox from "../UpsellBox";

/**
 * The Premium SEO Analysis Modal.
 *
 * @returns {React.Component} The Premium SEO Analysis Modal.
 */
const PremiumSEOAnalysisModal = () => {
	const [ isOpen, setIsOpen ] = useState( false );

	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const openModal = useCallback( () => setIsOpen( true ), [] );

	const intro =  __( "Write content that is more human, easier to read and engaging!", "wordpress-seo" );

	const interpolated = interpolateComponents( {
		mixedString: intro,
	} );

	const benefits = [
		__( "Allows you to use keyphrase synonyms", "wordpress-seo" ),
		__( "Offers perfect keyphrase distribution", "wordpress-seo" ),
		__( "Enables you to use different word forms", "wordpress-seo" ),
	];

	const otherBenefits = sprintf(
		/* translators: %s expands to 'Yoast SEO Premium'. */
		__( "The %s analysis:", "wordpress-seo" ),
		"Yoast SEO Premium"
	);

	let buyLink = wpseoAdminL10n[ "shortlinks.upsell.sidebar.premium_seo_analysis_button" ];

	return (
		<Fragment>
			{ isOpen &&
				<Modal
					title={ __( "Get Yoast SEO Premium", "wordpress-seo" ) }
					onRequestClose={ closeModal }
					additionalClassName=""
					className={ defaultModalClassName }
					id="yoast-premium-seo-analysis-modal"
					shouldCloseOnClickOutside={ true }
				>
					<ModalContainer>
						<ModalIcon icon={ YoastSeoIcon } />
						{
							<h2>{ __( "Create better content with our Premium SEO analysis", "wordpress-seo" ) }</h2>
						}

						<UpsellBox
							infoParagraphs={ [ interpolated, otherBenefits ] }
							benefits={ benefits }
							upsellButtonText={
								sprintf(
									/* translators: %s expands to 'Premium'. */
									__( "Unlock with %s", "wordpress-seo" ),
									"Premium"
								)
							}
							upsellButton={ {
								href: buyLink,
								className: "yoast-button-upsell",
								rel: null,
							} }
							upsellButtonLabel={ __( "1 year free support and updates included!", "wordpress-seo" ) }
						/>
					</ModalContainer>
				</Modal>
			}
			<SidebarButton
				id={  "yoast-premium-seo-analysis-modal-open-button" }
				title={ __( "Premium SEO Analysis", "wordpress-seo" ) }
				prefixIcon={ { icon: "seo-score-none", color: colors.$color_grey } }
				suffixIcon={ { size: "24px", icon: "chevron-down" } }
				onClick={ openModal }
			/>
		</Fragment>
	);
};

export default PremiumSEOAnalysisModal;
