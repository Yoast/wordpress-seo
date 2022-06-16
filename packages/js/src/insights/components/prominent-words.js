import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { makeOutboundLink } from "@yoast/helpers";
import { get, reduce } from "lodash";
import PropTypes from "prop-types";
import createInterpolateElement from "../../helpers/createInterpolateElement";
import DataModel from "./data-model";

const OutboundLink = makeOutboundLink();

/**
 * Prominent words component.
 * @param {string} location The location of this component.
 * @returns {JSX.Element} The element.
 */
const ProminentWords = ( { location } ) => { // eslint-disable-line complexity
	const shouldUpsell = useSelect( select => select( "yoast-seo/editor" ).getPreference( "shouldUpsell", false ), [] );
	const upsellLink = useMemo( () => get( window, `wpseoAdminL10n.shortlinks-insights-upsell-${ location }-prominent_words`, "" ), [ location ] );
	const keywordsResearchInfo = useMemo( () => {
		const link = get( window, "wpseoAdminL10n.shortlinks-insights-keyword_research_link", "" );
		return createInterpolateElement(
			sprintf(
				__( "Read our %1$sultimate guide to keyword research%2$s to learn more about keyword research and keyword strategy.", "wordpress-seo" ),
				"<a>",
				"</a>"
			),
			{
				a: <OutboundLink href={ link } />,
			}
		);
	}, [] );
	const upsellDescription = useMemo( () => {
		return createInterpolateElement(
			sprintf(
				// translators: %1$s expands to a starting `b` tag, %1$s expands to a closing `b` tag and %3$s expands to `Yoast SEO Premium`.
				__( "With %1$s%3$s%2$s, this section will show you which words occur most often in your text. By checking these prominent words against your intended keyword(s), you'll know how to edit your text to be more focused", "wordpress-seo" ),
				"<b>",
				"</b>",
				"Yoast SEO Premium"
			),
			{
				b: <b />,
			}
		);
	}, [] );
	const prominentWords = useSelect( select => select( "yoast-seo-premium/editor" )?.getProminentWords() ?? [], [] );
	const prominentWordsUpsell = useMemo( () => {
		const words = sprintf(
			// translators: %1$s expands to Yoast SEO Premium.
			__( "Get %s to enjoy the benefits of prominent words", "wordpress-seo" ),
			"Yoast SEO Premium"
		).split( /\s+/ );
		return reduce(
			words,
			( result, name, key ) => [ ...result, { name, number: words.length - key } ],
			[]
		);
	}, [] );
	const data = useMemo(
		() => shouldUpsell ? prominentWordsUpsell : prominentWords.map( ( { word, occurrence } ) => ( { name: word, number: occurrence } ) ),
		[ prominentWords, prominentWordsUpsell ]
	);

	return (
		<div className="yoast-prominent-words">
			<div className="yoast-field-group__title">
				<b>{ __( "Prominent words", "wordpress-seo" ) }</b>
			</div>
			{ ! shouldUpsell && <p>
				{ __(
					"The following words occur the most in the content. These give an indication of what your content focuses on. If the words differ a lot from your topic, you might want to rewrite your content accordingly.",
					"wordpress-seo"
				) }
			</p> }
			{ shouldUpsell && <p>{ upsellDescription }</p> }
			{ shouldUpsell && <OutboundLink href={ upsellLink } className="yoast-button yoast-button-upsell">
				{ sprintf(
					// translators: %s expands to `Premium` (part of add-on name).
					__( "Unlock with %s", "wordpress-seo" ),
					"Premium"
				) }
				<span aria-hidden="true" className="yoast-button-upsell__caret" />
			</OutboundLink> }
			{ ! shouldUpsell && <p>{ keywordsResearchInfo }</p> }
			<DataModel
				data={ data }
				itemScreenReaderText={
					// translators: %d expands to the number of occurrences.
					__( "%d occurrences", "wordpress-seo" )
				}
				aria-label={ __( "Prominent words", "wordpress-seo" ) }
				className={ shouldUpsell ? "yoast-data-model__upsell" : null }
			/>
			{ shouldUpsell && <p>{ keywordsResearchInfo }</p> }
		</div>
	);
};

ProminentWords.propTypes = {
	location: PropTypes.string.isRequired,
};

export default ProminentWords;
