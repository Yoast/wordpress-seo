/* global wpseoAdminL10n */
import { __, sprintf } from "@wordpress/i18n";
import { addQueryArgs } from "@wordpress/url";
import { useRootContext } from "@yoast/externals/contexts";
import PropTypes from "prop-types";
import UpsellBox from "../UpsellBox";

/**
 * Creates the content for a PremiumSEOAnalysisUpsell modal.
 *
 * @param {Object} props The props for the component.
 *
 * @returns {wp.Element} The PremiumSEOAnalysisUpsell component.
 */
const PremiumSEOAnalysisUpsell = ( props ) => {
	const benefits = [
		__( "Create content faster: Use AI to create titles & meta descriptions", "wordpress-seo" ),
		__( "Get help ranking for multiple keyphrases", "wordpress-seo" ),
		__( "Avoid dead links on your site", "wordpress-seo" ),
		__( "Easily improve the structure of your site", "wordpress-seo" ),
		__( "Preview how your content looks when shared on social", "wordpress-seo" ),
		__( "Get guidance & save time on routine SEO tasks", "wordpress-seo" ),
	];

	const { locationContext } = useRootContext();
	const buyLink = addQueryArgs( wpseoAdminL10n[ props.buyLink ], { context: locationContext } );

	return (
		<UpsellBox
			title={ __( "Get more help with writing content that ranks", "wordpress-seo" ) }
			description={ __( "Check your text on even more SEO criteria and get an enhanced keyphrase analysis, making it easier to optimize your content.", "wordpress-seo" ) }
			benefitsTitle={ __( "What’s more in Yoast SEO Premium?", "wordpress-seo" ) }
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
				"data-ctb-id": "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
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
