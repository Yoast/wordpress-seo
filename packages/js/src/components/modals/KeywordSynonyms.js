import interpolateComponents from "interpolate-components";
import { __, sprintf } from "@wordpress/i18n";

import { makeOutboundLink } from "@yoast/helpers";
import PropTypes from "prop-types";
import UpsellBox from "../UpsellBox";

const PremiumLandingPageLink = makeOutboundLink();

/**
 * Creates the content for a keyword synonyms upsell modal.
 *
 * @param {Object} props The props for the component.
 *
 * @returns {wp.Element} The Keyword Synonyms upsell component.
 */
const KeywordSynonyms = ( props ) => {
	const intro = sprintf(
		/* translators: %1$s expands to a 'Yoast SEO Premium' text linked to the yoast.com website. */
		__( "Great news: you can, with %1$s!", "wordpress-seo" ),
		"{{link}}Yoast SEO Premium{{/link}}"
	);

	const interpolated = interpolateComponents( {
		mixedString: intro,
		components: { link: <PremiumLandingPageLink href={ props.link } /> },
	} );

	const benefits = [
		`<strong>${ __( "Rank better with synonyms & related keyphrases", "wordpress-seo" ) }</strong>`,
		sprintf(
			/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
			__( "%1$sNo more dead links%2$s: easy redirect manager", "wordpress-seo" ),
			"<strong>",
			"</strong>"
		),
		`<strong>${ __( "Superfast internal linking suggestions", "wordpress-seo" ) }</strong>`,
		sprintf(
			/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
			__( "%1$sSocial media preview%2$s: Facebook & Twitter", "wordpress-seo" ),
			"<strong>",
			"</strong>"
		),
		`<strong>${ __( "24/7 email support", "wordpress-seo" ) }</strong>`,
		`<strong>${ __( "No ads!", "wordpress-seo" ) }</strong>`,
	];

	const otherBenefits = sprintf(
		/* translators: %s expands to 'Yoast SEO Premium'. */
		__( "Other benefits of %s for you:", "wordpress-seo" ),
		"Yoast SEO Premium"
	);

	return (
		<UpsellBox
			infoParagraphs={ [ interpolated, otherBenefits ] }
			benefits={ benefits }
			upsellButtonText={
				sprintf(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					__( "Get %s", "wordpress-seo" ),
					"Yoast SEO Premium"
				)
			}
			upsellButton={ {
				href: props.buyLink,
				className: "yoast-button-upsell",
				rel: null,
			} }
			upsellButtonLabel={ __( "1 year free support and updates included!", "wordpress-seo" ) }
		/>
	);
};

KeywordSynonyms.propTypes = {
	link: PropTypes.string.isRequired,
	buyLink: PropTypes.string.isRequired,
};

export default KeywordSynonyms;
