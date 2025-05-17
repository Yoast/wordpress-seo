import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { getPremiumBenefits } from "../../helpers/get-premium-benefits";
import UpsellBox from "../UpsellBox";

/**
 * Creates the content for a Multiple Keywords upsell modal.
 *
 * @param {Object} props The props for the component.
 *
 * @returns {JSX.Element} The Multiple Keywords upsell component.
 */
const MultipleKeywords = ( props ) => (
	<UpsellBox
		title={ __( "Reach a wider audience", "wordpress-seo" ) }
		description={ __( "Get help optimizing for up to 5 related keyphrases. This helps you reach a wider audience and get more traffic.", "wordpress-seo" ) }
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
			href: props.buyLink,
			className: "yoast-button-upsell",
			rel: null,
			"data-ctb-id": "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
			"data-action": "load-nfd-ctb",
		} }
		upsellButtonLabel={ __( "1 year free support and updates included!", "wordpress-seo" ) }
	/>
);
MultipleKeywords.propTypes = {
	buyLink: PropTypes.string.isRequired,
};

export default MultipleKeywords;
