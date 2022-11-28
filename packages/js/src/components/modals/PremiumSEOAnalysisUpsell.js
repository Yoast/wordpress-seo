/* global wpseoAdminL10n */

import { __, sprintf } from "@wordpress/i18n";
import UpsellBox from "../UpsellBox";
import PropTypes from "prop-types";
import { useRootContext }  from "@yoast/externals/contexts";
import { addQueryArgs } from "@wordpress/url";

/**
 * Creates the content for a PremiumSEOAnalysisUpsell modal.
 *
 * @param {Object} props The props for the component.
 *
 * @returns {wp.Element} The PremiumSEOAnalysisUpsell component.
 */
const PremiumSEOAnalysisUpsell = ( props ) => {
	const intro = __( "Get extra, smarter recommendations about your site’s structure, content, and SEO opportunities.", "wordpress-seo" );

	const benefits = [
		__( "Target multiple focus keyphrases", "wordpress-seo" ),
		__( "Use synonyms, plurals, and variations", "wordpress-seo" ),
		__( "Unlock expert workouts and workflows", "wordpress-seo" ),
	];

	const { locationContext } = useRootContext();
	const buyLink = addQueryArgs( wpseoAdminL10n[ props.buyLink ], { context: locationContext } );

	return (
		<UpsellBox
			infoParagraphs={ [ intro ] }
			benefits={ benefits }
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
				"data-ctb-id": "57d6a568-783c-45e2-a388-847cff155897",
				"data-action": "load-nfd-ctb",
			} }
			upsellButtonLabel={ __( "1 year of premium support and updates included!", "wordpress-seo" ) }
		/>
	);
};

PremiumSEOAnalysisUpsell.propTypes = {
	buyLink: PropTypes.string.isRequired,
};


export default PremiumSEOAnalysisUpsell;
