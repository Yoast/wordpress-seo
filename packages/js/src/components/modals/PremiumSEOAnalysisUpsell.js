/* global wpseoAdminL10n */

import interpolateComponents from "interpolate-components";
import { __, sprintf } from "@wordpress/i18n";
import UpsellBox from "../UpsellBox";
import PropTypes from "prop-types";

/**
 * Creates the content for a PremiumSEOAnalysisUpsell modal.
 *
 * @param {Object} props The props for the component.
 *
 * @returns {wp.Element} The PremiumSEOAnalysisUpsell component.
 */
const PremiumSEOAnalysisUpsell = ( props ) => {
	const intro =  __( "Write content that is more human, easier to read and engaging!", "wordpress-seo" );

	const interpolated = interpolateComponents( {
		mixedString: intro,
	} );

	const benefits = [
		__( "Allows you to use keyphrase synonyms", "wordpress-seo" ),
		__( "Offers perfect keyphrase distribution", "wordpress-seo" ),
		__( "Enables you to use different word forms", "wordpress-seo" ),
	];
	const buyLink = wpseoAdminL10n[ props.buyLink ];

	const otherBenefits = sprintf(
		/* translators: %s expands to 'Yoast SEO Premium'. */
		__( "The %s analysis:", "wordpress-seo" ),
		"Yoast SEO Premium"
	);

	return (
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
			upsellButtonLabel={ __( "1 year premium support and updates included!", "wordpress-seo" ) }
		/>
	);
};

PremiumSEOAnalysisUpsell.propTypes = {
	buyLink: PropTypes.string.isRequired,
};


export default PremiumSEOAnalysisUpsell;
