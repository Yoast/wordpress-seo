import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import { BetaBadge } from "@yoast/components";

const TextFormality = () => {
	const shouldUpsell = useSelect( select => select( "yoast-seo/editor" ).getPreference( "shouldUpsell", false ), [] );
	const formalityLevel = useSelect( select => select( "yoast-seo/editor" ).getTextFormalityLevel() );
	const textLength = useSelect( select => select( "yoast-seo/editor" ).getTextLength(), [] );

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
		</div>
	);
};

export default TextFormality;

