import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { BetaBadge } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";
import createInterpolateElement from "../../helpers/createInterpolateElement";

const OutboundLink = makeOutboundLink();

/**
 * TextFormality component.
 * @returns {JSX.Element} The element.
 */
const TextFormality = () => {
	const shouldUpsell = useSelect( select => select( "yoast-seo/editor" ).getPreference( "shouldUpsell", false ), [] );
	const formalityLevel = useSelect( select => select( "yoast-seo/editor" ).getTextFormalityLevel() );
	const textLength = useSelect( select => select( "yoast-seo/editor" ).getTextLength(), [] ).count;
	// We need to determine the minimum text required before we return a feedback.
	const upsellLink = "www.yoast.com";
	const upsellDescription = useMemo( () => {
		return createInterpolateElement(
			sprintf(
				// translators: %1$s expands to a starting `b` tag, %1$s expands to a closing `b` tag and %3$s expands to `Yoast SEO Premium`.
				__( "%1$s%3$s%2$s will help you assess the level of formality of your text.", "wordpress-seo" ),
				"<b>",
				"</b>",
				"Yoast SEO Premium"
			),
			{
				b: <b />,
			}
		);
	}, [] );

	const infoText = shouldUpsell
		? sprintf(
			__( "%1$sRead more about text formality.%2$s", "wordpress-seo" ),
			"<a>",
			"</a>"
		)
		: sprintf(
			__( "Read our %1$sarticle on text formality%2$s to learn more about how you can change the formality level of your text.", "wordpress-seo" ),
			"<a>",
			"</a>"
		);

	const textFormalityInfo = useMemo( () => {
		const link = "www.yoast.com";
		return createInterpolateElement(
			infoText,
			{
				a: <OutboundLink href={ link } />,
			}
		);
	}, [] );

	return (
		<div className="yoast-text-formality">
			<div className="yoast-field-group__title">
				<b>{ __( "Text formality", "wordpress-seo" ) }</b>
				<BetaBadge />
			</div>
			{ ! shouldUpsell && textLength === 0 && <div>
				<p>{ __(
					"Once you add a bit more copy, we'll be able to tell you the formality level of your text.",
					"wordpress-seo"
				) }</p>
			</div>
			}
			{ ! shouldUpsell && textLength !== 0 && <div>
				<p>
					{ __(
						"Overall, the formality level of your text is analyzed as being",
						"wordpress-seo"
					) }
				</p>
				<div className="yoast-insights-card__score">
					{ sprintf(
						__( "%s", "wordpress-seo" ),
						formalityLevel
					) }
				</div>
			</div>
			}
			{ shouldUpsell && <p>{ upsellDescription }</p> }
			{ shouldUpsell && <OutboundLink href={ upsellLink } className="yoast-button yoast-button-upsell">
				{ sprintf(
					// translators: %s expands to `Premium` (part of add-on name).
					__( "Unlock with %s", "wordpress-seo" ),
					"Premium"
				) }
				<span aria-hidden="true" className="yoast-button-upsell__caret" />
			</OutboundLink> }
			<p>{ textFormalityInfo }</p>
		</div>
	);
};

export default TextFormality;

