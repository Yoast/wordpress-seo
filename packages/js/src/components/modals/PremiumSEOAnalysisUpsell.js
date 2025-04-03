/* global wpseoAdminL10n */
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { useRootContext } from "@yoast/externals/contexts";
import PropTypes from "prop-types";
import { getPremiumBenefits } from "../../helpers/get-premium-benefits";
import UpsellBox from "../UpsellBox";

const upsellDescription = __(
	"Check your text on even more SEO criteria and get an enhanced keyphrase analysis, making it easier to optimize your content.",
	"wordpress-seo" );

/**
 * Creates the content for a PremiumSEOAnalysisUpsell modal.
 *
 * @param {Object} props The props for the component.
 *
 * @returns {wp.Element} The PremiumSEOAnalysisUpsell component.
 */
const PremiumSEOAnalysisUpsell = ( props ) => {
	const { locationContext } = useRootContext();
	const buyLink = addQueryArgs( wpseoAdminL10n[ props.buyLink ], { context: locationContext } );

	return (
		<UpsellBox
			title={ __( "Get more help with writing content that ranks", "wordpress-seo" ) }
			description={ props.description }
			benefitsTitle={
				sprintf(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					__( "%s also gives you:", "wordpress-seo" ),
					"Yoast SEO Premium" )
			}
			benefits={ getPremiumBenefits() }
			upsellButtonText={
				sprintf(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					__( "Unlock with %s", "wordpress-seo" ),
					"Yoast SEO Premium"
				)
			}
			upsellButton={ {
				href: buyLink,
				className: "yoast-button-upsell",
				rel: null,
				"data-ctb-id": "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
				"data-action": "load-nfd-ctb",
			} }
			upsellButtonLabel={ __( "1 year of premium support and updates included!", "wordpress-seo" ) }
		/>
	);
};

PremiumSEOAnalysisUpsell.propTypes = {
	buyLink: PropTypes.string.isRequired,
	description: PropTypes.string,
};

PremiumSEOAnalysisUpsell.defaultProps = {
	description: upsellDescription,
};


export default PremiumSEOAnalysisUpsell;
