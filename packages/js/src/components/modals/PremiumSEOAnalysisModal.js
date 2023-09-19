import { LockClosedIcon } from "@heroicons/react/solid";
import { Fragment, useCallback, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SvgIcon } from "@yoast/components";
import { colors } from "@yoast/style-guide";
import { Badge, useSvgAria } from "@yoast/ui-library";
import PropTypes from "prop-types";
import SidebarButton from "../SidebarButton";
import { ModalContainer } from "./Container";
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
				title={ __( "Get the Premium SEO analysis", "wordpress-seo" ) }
				onRequestClose={ closeModal }
				additionalClassName=""
				className={ defaultModalClassName }
				id="yoast-premium-seo-analysis-modal"
				shouldCloseOnClickOutside={ true }
			>
				<ModalContainer>
					<h2>{ __( "Improve your SEO by using the Premium SEO analysis", "wordpress-seo" ) }</h2>
					<PremiumSEOAnalysisUpsell buyLink={ `shortlinks.upsell.${ location }.premium_seo_analysis_button` } />
				</ModalContainer>
			</Modal> }
			{ location === "sidebar" && <SidebarButton
				id={ "yoast-premium-seo-analysis-modal-open-button" }
				title={ __( "Premium SEO analysis", "wordpress-seo" ) }
				prefixIcon={ { icon: "seo-score-none", color: colors.$color_grey } }
				suffixIcon={ { icon: "pencil-square", size: "20px" } }
				onClick={ openModal }
			/> }
			{ location === "metabox" && (
				<div className="yst-root">
					<button
						id="yoast-premium-seo-analysis-metabox-modal-open-button"
						type="button"
						className="yst-flex yst-items-center yst-w-full yst-pl-6 yst-p-4 yst-space-x-2 yst-border-t yst-border-t-[rgb(0,0,0,0.2)] yst-rounded-none yst-transition-all hover:yst-bg-[#f0f0f0] focus:yst-outline focus:yst-outline-[1px] focus:yst-outline-[color:#0066cd] focus:-yst-outline-offset-1 focus:yst-shadow-[0_0_3px_rgba(8,74,103,0.8)]"
						onClick={ openModal }
					>
						<SvgIcon icon="seo-score-none" color={ colors.$color_grey } />
						<span
							className="yst-grow yst-overflow-hidden yst-overflow-ellipsis yst-whitespace-nowrap yst-font-wp yst-text-[#555] yst-text-base yst-leading-[normal] yst-subpixel-antialiased yst-text-left"
						>
							{ __( "Premium SEO analysis", "wordpress-seo" ) }
						</span>
						<Badge size="small" variant="upsell">
							<LockClosedIcon className="yst-w-2.5 yst-h-2.5 yst-mr-1 yst-shrink-0" { ...svgAriaProps } />
							<span>Premium</span>
						</Badge>
					</button>
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
