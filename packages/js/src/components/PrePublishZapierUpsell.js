/* External dependencies */
import interpolateComponents from "interpolate-components";
import { __, sprintf } from "@wordpress/i18n";
import { ButtonStyledLink } from "@yoast/components";

/* Yoast dependencies */
import { makeOutboundLink } from "@yoast/helpers";

const ZapierHelpLink = makeOutboundLink();


/**
 * Creates the content for the Zapier pre-publish panel in the block editor.
 *
 * @param {Object} props The props for the component.
 *
 * @returns {wp.Element} The Zapier pre-publish panel content component.
 */
const PrePublishZapierUpsell = () => {
	const text = sprintf(
		/* translators: 1: Link start tag, 2: Yoast SEO, 3: Zapier, 4: Link closing tag. */
		__(
			"%1$sConnect %2$s with %3$s%4$s to instantly share your published posts with 2000+ destinations such as Twitter, Facebook and more.",
			"wordpress-seo-premium"
		),
		"{{link}}",
		"Yoast SEO",
		"Zapier",
		"{{/link}}"
	);

	const interpolatedText = interpolateComponents( {
		mixedString: text,
		components: { link: <ZapierHelpLink href={ "https://yoa.st/somelink" } /> },
	} );

	return (
		<div className="yoast">
			<p style={ { opacity: 1, marginTop: 0 } }>{ interpolatedText }</p>
			<ButtonStyledLink variant="buy" small={ true } href="">
				{ __( "Unlock with Premium!", "wordpress-seo" ) }
			</ButtonStyledLink>
		</div>
	);
};

export default PrePublishZapierUpsell;
