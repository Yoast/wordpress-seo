import { LockClosedIcon } from "@heroicons/react/solid";
import { Fragment, useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SvgIcon } from "@yoast/components";
import { colors } from "@yoast/style-guide";
import { Badge, useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { MetaboxButton } from "../MetaboxButton";
import SidebarButton from "../SidebarButton";
import { ModalSmallContainer } from "./Container";
import Modal, { defaultModalClassName } from "./Modal";
import PremiumSEOAnalysisUpsell from "./PremiumSEOAnalysisUpsell";

/**
 * The Premium SEO Analysis Modal.
 *
 * @returns {JSX.Element} The Premium SEO Analysis Modal.
 */
const PremiumSEOAnalysisModal = ( { location } ) => {
	const [ isOpen, setIsOpen ] = useState( false );
	const closeModal = useCallback( () => setIsOpen( false ), [] );
	const openModal = useCallback( () => setIsOpen( true ), [] );
	const svgAriaProps = useSvgAria();

	return (
		<Fragment>
			{ isOpen && <Modal
				title={ __( "Unlock Premium SEO analysis", "wordpress-seo" ) }
				onRequestClose={ closeModal }
				additionalClassName=""
				className={ `${ defaultModalClassName } yoast-gutenberg-modal__box yoast-gutenberg-modal__no-padding` }
				id="yoast-premium-seo-analysis-modal"
				shouldCloseOnClickOutside={ true }
			>
				<ModalSmallContainer>
					<PremiumSEOAnalysisUpsell buyLink={ `shortlinks.upsell.${ location }.premium_seo_analysis_button` } />
				</ModalSmallContainer>
			</Modal> }
			{ location === "sidebar" && (
				<SidebarButton
					id="yoast-premium-seo-analysis-modal-open-button"
					title={ __( "Premium SEO analysis", "wordpress-seo" ) }
					prefixIcon={ { icon: "seo-score-none", color: colors.$color_grey } }
					onClick={ openModal }
				>
					<div className="yst-root">
						<Badge size="small" variant="upsell">
							<LockClosedIcon className="yst-w-2.5 yst-h-2.5 yst-shrink-0" { ...svgAriaProps } />
						</Badge>
					</div>
				</SidebarButton>
			) }
			{ location === "metabox" && (
				<div className="yst-root">
					<MetaboxButton
						id="yoast-premium-seo-analysis-metabox-modal-open-button"
						onClick={ openModal }
					>
						<SvgIcon icon="seo-score-none" color={ colors.$color_grey } />
						<MetaboxButton.Text>
							{ __( "Premium SEO analysis", "wordpress-seo" ) }
						</MetaboxButton.Text>
						<Badge size="small" variant="upsell">
							<LockClosedIcon className="yst-w-2.5 yst-h-2.5 yst-me-1 yst-shrink-0" { ...svgAriaProps } />
							<span>Premium</span>
						</Badge>
					</MetaboxButton>
				</div>
			) }
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
