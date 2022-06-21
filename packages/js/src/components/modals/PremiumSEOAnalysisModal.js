/* External dependencies */
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
import PremiumSEOAnalysisUpsell from "./PremiumSEOAnalysisUpsell";

/**
 * The Premium SEO Analysis Modal.
 *
 * @returns {React.Component} The Premium SEO Analysis Modal.
 */
const PremiumSEOAnalysisModal = () => {
	const [ isOpen, setIsOpen ] = useState( false );

	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const openModal = useCallback( () => setIsOpen( true ), [] );

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

						<PremiumSEOAnalysisUpsell buyLink="shortlinks.upsell.sidebar.premium_seo_analysis_button" />
					</ModalContainer>
				</Modal>
			}
			<SidebarButton
				id={  "yoast-premium-seo-analysis-modal-open-button" }
				title={ __( "Premium SEO Analysis", "wordpress-seo" ) }
				prefixIcon={ { icon: "seo-score-none", color: colors.$color_grey } }
				onClick={ openModal }
			>
				<span className="yoast-chevron" aria-hidden="true" />
			</SidebarButton>
		</Fragment>
	);
};

export default PremiumSEOAnalysisModal;
