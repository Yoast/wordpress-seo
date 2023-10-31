import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import UpsellBox from "../UpsellBox";

/**
 * Creates the content for a keyword synonyms upsell modal.
 *
 * @param {Object} props The props for the component.
 *
 * @returns {wp.Element} The Keyword Synonyms upsell component.
 */
const KeywordSynonyms = ( props ) => {
	const benefits = [
		__( "Create content faster: Use AI to create titles & meta descriptions", "wordpress-seo" ),
		__( "Get extra SEO checks with the Premium SEO analysis", "wordpress-seo" ),
		__( "Avoid dead links on your site", "wordpress-seo" ),
		__( "Easily improve the structure of your site", "wordpress-seo" ),
		__( "Preview how your content looks when shared on social", "wordpress-seo" ),
		__( "Get guidance & save time on routine SEO tasks", "wordpress-seo" ),
	];

	return (
		<UpsellBox
			title={ __( "Write more natural and engaging content", "wordpress-seo" ) }
			description={ sprintf(
				/* translators: %s expands to "Yoast SEO Premium" */
				__( "Synonyms help users understand your copy better. It’s easier to read for both users and Google. In %s, you can add synonyms for your focus keyphrase, and we’ll help you optimize for them.", "wordpress-seo" ),
				"Yoast SEO Premium"
			) }
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
				href: props.buyLink,
				className: "yoast-button-upsell",
				rel: null,
				"data-ctb-id": "f6a84663-465f-4cb5-8ba5-f7a6d72224b2",
				"data-action": "load-nfd-ctb",
			} }
			upsellButtonLabel={ __( "1 year free support and updates included!", "wordpress-seo" ) }
		/>
	);
};
KeywordSynonyms.propTypes = {
	buyLink: PropTypes.string.isRequired,
};

export default KeywordSynonyms;
