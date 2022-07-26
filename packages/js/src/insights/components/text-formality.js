import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { BetaBadge } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";
import { get } from "lodash";
import PropTypes from "prop-types";
import styled from "styled-components";

import createInterpolateElement from "../../helpers/createInterpolateElement";

const OutboundLink = makeOutboundLink();

const Badge = styled( BetaBadge )`
	margin: 0 2px 0 4px;
`;

const FormalityLevel = styled.span`
	color: #a4286a;
	font-weight: 600;
`;

/**
 * TextFormality component.
 *
 * @param {string} location The location of this component.
 *
 * @returns {JSX.Element} The element.
 */
const TextFormality = ( { location } ) => {
	const shouldUpsell = useSelect( select => select( "yoast-seo/editor" ).getPreference( "shouldUpsell", false ), [] );
	const formalityLevel = useSelect( select => select( "yoast-seo/editor" ).getTextFormalityLevel(), [] );
	const textLength = useSelect( select => select( "yoast-seo/editor" ).getTextLength(), [] ).count;
	const upsellLink = useMemo( () => get( window, `wpseoAdminL10n.shortlinks-insights-upsell-${ location }-text_formality`, "" ), [ location ] );
	const infoLinkFree = get( window, "wpseoAdminL10n.shortlinks-insights-text_formality_info_free", "" );
	const infoLinkPremium = get( window, "wpseoAdminL10n.shortlinks-insights-text_formality_info_premium", "" );

	const upsellDescription = useMemo( () => {
		return createInterpolateElement(
			sprintf(
				// translators: %1$s expands to a starting `b` tag, %1$s expands to a closing `b` tag and %3$s expands to `Yoast SEO Premium`.
				__( "%1$s%3$s%2$s will help you assess the formality level of your text.", "wordpress-seo" ),
				"<b>",
				"</b>",
				"Yoast SEO Premium"
			),
			{
				b: <b />,
			}
		);
	}, [] );

	const textFormalityInfo = useMemo( () => {
		return shouldUpsell
			? createInterpolateElement(
				sprintf(
					__( "%1$sRead more about text formality.%2$s", "wordpress-seo" ),
					"<a>",
					"</a>"
				),
				{
					a: <OutboundLink href={ infoLinkFree } />,
				}
			)
			: createInterpolateElement(
				sprintf(
					__( "%1$sRead our article on text formality to learn more about how to change the formality level of a text.%2$s", "wordpress-seo" ),
					"<a>",
					"</a>"
				),
				{
					a: <OutboundLink href={ infoLinkPremium } />,
				}
			);
	}, [ shouldUpsell ] );

	return (
		<div className="yoast-text-formality">
			<div className="yoast-field-group__title">
				<b>{ __( "Text formality", "wordpress-seo" ) }</b>
				<Badge className={ "yoast-beta-badge" } />
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
						"Overall, your text appears to be ",
						"wordpress-seo"
					) }
					<FormalityLevel>
						{ sprintf(
							__( "%s", "wordpress-seo" ),
							formalityLevel
						) }
					</FormalityLevel>
					{ "." }
				</p>
			</div> }
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

TextFormality.propTypes = {
	location: PropTypes.string.isRequired,
};

export default TextFormality;

