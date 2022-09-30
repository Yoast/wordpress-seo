/* External dependencies */
import interpolateComponents from "interpolate-components";
import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { ButtonStyledLink } from "@yoast/components";
import { get } from "lodash";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";

const OutboundLink = makeOutboundLink();


/**
 * Creates the content for the Zapier pre-publish panel in the block editor.
 *
 * @param {Object} props The props for the component.
 *
 * @returns {wp.Element} The Zapier pre-publish panel content component.
 */
const PostPublishZapierUpsell = () => {
	const premiumBuyLink = get( window, "wpseoAdminL10n.shortlinks-upsell-postpublish-zapier_upsell_buy_link", "https://yoa.st/get-zapier-postpublish" );
	const zapierHelpLink = get( window, "wpseoAdminL10n.shortlinks-upsell-postpublish-zapier_upsell_help_link", "https://yoa.st/about-zapier" );

	const text =  __(
		"Instantly share your published posts with 2000+ destinations such as Twitter, Facebook and more.",
		"wordpress-seo"
	);

	const learnMoreText = sprintf(
		/* translators: 1: Link start tag, 2: Link closing tag. */
		__(
			"or %1$sLearn more%2$s	",
			"wordpress-seo"
		),
		"{{link}}",
		"{{/link}}"
	);

	const interpolatedText = interpolateComponents( {
		mixedString: learnMoreText,
		components: { link: <OutboundLink href={ zapierHelpLink } /> },
	} );

	return (
		<Fragment>
			<div style={ { paddingTop: "10px" } }>
				<strong>
					{ sprintf(
						/* translators: 1: Yoast SEO, 2: Zapier. */
						__( "Connect %1$s with %2$s", "wordpress-seo" ),
						"Yoast SEO",
						"Zapier"
					) }
				</strong>
			</div>
			<div className="yoast yoast-zapier">
				<p style={ { marginTop: 0 } }>{ text }</p>
				<ButtonStyledLink variant="buy" small={ true } href={ premiumBuyLink } target="_blank">
					{ __( "Unlock with Premium!", "wordpress-seo" ) }
				</ButtonStyledLink>
				<p style={ { marginTop: "5px" } }>{ interpolatedText }</p>
			</div>
		</Fragment>
	);
};

export default PostPublishZapierUpsell;
