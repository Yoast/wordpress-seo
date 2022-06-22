/* External dependencies */
import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import { useState, useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal dependencies */
import { YoastSeoIcon, CollapsibleStateless } from "@yoast/components";
import { colors } from "@yoast/style-guide";
import { ModalContainer, ModalIcon } from "./Container";
import Modal, { defaultModalClassName } from "./Modal";
import SidebarButton from "../SidebarButton";
import PremiumSEOAnalysisUpsell from "./PremiumSEOAnalysisUpsell";

const FakeMetaboxCollapsible = styled( CollapsibleStateless )`
	h2 > button {
		padding-left: 24px;
		padding-top: 16px;

		&:hover {
			background-color: #f0f0f0;
		}
	}
`;

/**
 * The Premium SEO Analysis Modal.
 *
 * @returns {React.Component} The Premium SEO Analysis Modal.
 */
const PremiumSEOAnalysisModal = ( { location } ) => {
	const [ isOpen, setIsOpen ] = useState( false );

	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const openModal = useCallback( () => setIsOpen( true ), [] );

	return (
		<Fragment>
			{ isOpen && <Modal
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

					<PremiumSEOAnalysisUpsell buyLink={ `shortlinks.upsell.${ location }.premium_seo_analysis_button` } />
				</ModalContainer>
			</Modal> }
			{ location === "sidebar" && <SidebarButton
				id={  "yoast-premium-seo-analysis-modal-open-button" }
				title={ __( "Premium SEO analysis", "wordpress-seo" ) }
				prefixIcon={ { icon: "seo-score-none", color: colors.$color_grey } }
				onClick={ openModal }
			>
				<span className="yoast-chevron" aria-hidden="true" />
			</SidebarButton> }
			{ location === "metabox" && <FakeMetaboxCollapsible
				hasPadding={ false }
				hasSeparator={ true }
				isOpen={ false }
				id={  "yoast-premium-seo-analysis-metabox-modal-open-button" }
				title={ __( "Premium SEO analysis", "wordpress-seo" ) }
				prefixIconCollapsed={ { icon: "seo-score-none", color: colors.$color_grey, size: "16px" } }
				suffixIconCollapsed={ {
					icon: "chevron-down",
					color: colors.$black,
					size: "24px",
				} }
				onToggle={ openModal }
			/> }
		</Fragment>
	);
};

PremiumSEOAnalysisModal.propTypes = {
	location: PropTypes.string,
};

PremiumSEOAnalysisModal.defaultProps = {
	location: "sidebar",
};

export default PremiumSEOAnalysisModal;
