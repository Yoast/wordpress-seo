import { LockClosedIcon } from "@heroicons/react/solid";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SvgIcon } from "@yoast/components";
import { colors } from "@yoast/style-guide";
import { Badge, useSvgAria, useToggleState } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { MetaboxButton } from "../MetaboxButton";
import SidebarButton from "../SidebarButton";
import { PremiumSEOAnalysisModal } from "./PremiumSEOAnalysisModal";

/**
 * The Premium SEO Analysis Modal.
 *
 * @returns {JSX.Element} The Premium SEO Analysis Modal.
 */
const PremiumSEOAnalysisUpsell = ( { location = "sidebar" } ) => {
	const svgAriaProps = useSvgAria();
	const [ isOpen, , , openModal, closeModal ] = useToggleState( false );
	const link = `shortlinks.upsell.${ location }.premium_seo_analysis_button`;

	return (
		<Fragment>
			<PremiumSEOAnalysisModal
				isOpen={ isOpen }
				closeModal={ closeModal }
				id="yoast-premium-seo-analysis-modal"
				upsellLink={ link }
			/>
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

PremiumSEOAnalysisUpsell.propTypes = {
	location: PropTypes.string,
};

export default PremiumSEOAnalysisUpsell;


