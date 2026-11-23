/* global wpseoAdminL10n */
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { useRootContext } from "@yoast/externals/contexts";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { UpsellModal } from "./UpsellModal";

/**
 * Creates the content for a PremiumSEOAnalysisModal modal.
 *
 * @param {Object} props Component props.
 * @param {boolean} props.isOpen Whether the modal is open.
 * @param {Function} props.closeModal Function to close the modal.
 * @param {string} props.id The id of the modal.
 * @param {string} props.upsellLink The upsell link to use.
 *
 * @returns {wp.Element} The PremiumSEOAnalysisModal component.
 */
export const PremiumSEOAnalysisModal = ( { isOpen, closeModal, id, upsellLink } ) => {
	const { locationContext } = useRootContext();
	const link = addQueryArgs( wpseoAdminL10n[ upsellLink ], { context: locationContext } );
	const benefits = [
		safeCreateInterpolateElement(
			sprintf(
				/* translators: %1$s and %2$s are opening and closing span tags. */
				__( "%1$sKeyphrase distribution:%2$s See if your keywords are spread evenly so search engines understand your topic", "wordpress-seo" ),
				"<span>",
				"</span>"
			), { span: <span className="yst-font-medium yst-text-slate-800" /> } ),
		safeCreateInterpolateElement(
			sprintf(
				/* translators: %1$s and %2$s are opening and closing span tags. */
				__( "%1$sTitle check:%2$s Instantly spot missing titles and fix them for better click-through rates", "wordpress-seo" ),
				"<span>",
				"</span>"
			), { span: <span className="yst-font-medium yst-text-slate-800" /> } ),
		safeCreateInterpolateElement(
			sprintf(
				/* translators: %1$s and %2$s are opening and closing span tags. */
				__( "%1$sSynonyms:%2$s Include synonyms of your keyphrase for a more natural flow and smarter suggestions", "wordpress-seo" ),
				"<span>",
				"</span>"
			), { span: <span className="yst-font-medium yst-text-slate-800" /> } ),
	];

	return (
		<UpsellModal
			isOpen={ isOpen }
			onClose={ closeModal }
			id={ id }
			modalTitle={ __( "Get deeper SEO insights with Premium", "wordpress-seo" ) }
			title={ __( "Find new ways to grow your rankings.", "wordpress-seo" ) }
			description={ __( "Premium gives you advanced content checks that reveal new ranking opportunities and help you reach more readers.", "wordpress-seo" ) }
			upsellLink={ link }
			benefits={ benefits }
			note={ __( "Upgrade to optimize with precision", "wordpress-seo" ) }
			ctbId="f6a84663-465f-4cb5-8ba5-f7a6d72224b2"
		/>
	);
};

export default PremiumSEOAnalysisModal;
