import interpolateComponents from "interpolate-components";
import { makeOutboundLink } from "@yoast/helpers";
import { __, sprintf } from "@wordpress/i18n";
import UpsellBox from "../UpsellBox";
import PropTypes from "prop-types";

const PremiumLandingPageLink = makeOutboundLink();

/**
 * Creates the content for a Multiple Keywords upsell modal.
 *
 * @param {Object} props The props for the component.
 *
 * @returns {wp.Element} The Multiple Keywords upsell component.
 */
const MultipleKeywords = ( props ) => {
	const intro = sprintf(
		/* translators: %s expands to a 'Yoast SEO Premium' text linked to the yoast.com website. */
		__( "Great news: you can, with %s!", "wordpress-seo" ),
		"{{link}}Yoast SEO Premium{{/link}}"
	);

	const benefits = [
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
		`<strong>${__( "24/7 email support", "wordpress-seo" )}</strong>`,
		`<strong>${__( "No ads!", "wordpress-seo" )}</strong>`,
	];

	// Interpolate links
	const interpolated = interpolateComponents( {
		mixedString: intro,
		components: { link: <PremiumLandingPageLink href={ props.link } /> },
	} );

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

MultipleKeywords.propTypes = {
	link: PropTypes.string.isRequired,
	buyLink: PropTypes.string.isRequired,
};


export default MultipleKeywords;
