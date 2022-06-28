import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { InsightsCard } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";
import { DIFFICULTY } from "yoastseo";
import { get } from "lodash";

const OutboundLink = makeOutboundLink();

/* eslint-disable complexity */
/**
 * Returns the difficulty feedback string (e.g. 'very easy')
 *
 * @param {DIFFICULTY} difficulty The Flesch reading ease difficulty.
 *
 * @returns {string} The difficulty feedback string.
 */
function getDifficultyFeedback( difficulty ) {
	switch ( difficulty ) {
		case DIFFICULTY.NO_DATA:
			return __( "no data", "wordpress-seo" );
		case DIFFICULTY.VERY_EASY:
			return __( "very easy", "wordpress-seo" );
		case DIFFICULTY.EASY:
			return __( "easy", "wordpress-seo" );
		case DIFFICULTY.FAIRLY_EASY:
			return __( "fairly easy", "wordpress-seo" );
		case DIFFICULTY.OKAY:
			return __( "okay", "wordpress-seo" );
		case DIFFICULTY.FAIRLY_DIFFICULT:
			return __( "fairly difficult", "wordpress-seo" );
		case DIFFICULTY.DIFFICULT:
			return __( "difficult", "wordpress-seo" );
		case DIFFICULTY.VERY_DIFFICULT:
			return __( "very difficult", "wordpress-seo" );
	}
}
/* eslint-enable complexity */

/**
 * Returns the call to action.
 *
 * @param {DIFFICULTY} difficulty The Flesch reading ease difficulty.
 *
 * @returns {string} The call to action.
 */
function getCallToAction( difficulty ) {
	switch ( difficulty ) {
		case DIFFICULTY.FAIRLY_DIFFICULT:
			return __( "Try to make shorter sentences to improve readability", "wordpress-seo" );
		case DIFFICULTY.DIFFICULT:
		case DIFFICULTY.VERY_DIFFICULT:
			return __( "Try to make shorter sentences, using less difficult words to improve readability", "wordpress-seo" );
		case DIFFICULTY.NO_DATA:
			return __( "Continue writing to get insight into the readability of your text!", "wordpress-seo" ); // TODO: suitable text
		default:
			return __( "Good job!", "wordpress-seo" );
	}
}

/**
 * Generates the description given a score and difficulty.
 *
 * @param {number} score The flesch reading ease score.
 * @param {DIFFICULTY} difficulty The flesch reading ease difficulty.
 *
 * @returns {string} The description.
 */
function getDescription( score, difficulty ) {
	if ( score === "?" ) {
		return sprintf(
			/* Translators: %1$s expands to the numeric Flesch reading ease score,
				%2$s expands to the easiness of reading (e.g. 'easy' or 'very difficult').
			 */
			__(
				"Your text should be slightly longer to calculate your Flesch reading ease score.", // TODO: good text in here
				"wordpress-seo"
			)
		);
	}
	return sprintf(
		/* Translators: %1$s expands to the numeric Flesch reading ease score,
				%2$s expands to the easiness of reading (e.g. 'easy' or 'very difficult').
			 */
		__(
			"The copy scores %1$s in the test, which is considered %2$s to read.",
			"wordpress-seo"
		),
		score,
		getDifficultyFeedback( difficulty )
	);
}

/**
 * Retrieves the description as a React element.
 *
 * @param {number} score The Flesch reading ease score.
 * @param {DIFFICULTY} difficulty The difficulty.
 * @param {string} link The link to the call to action.
 *
 * @returns {JSX.Element} The React element.
 */
function getDescriptionElement( score, difficulty, link ) {
	const callToAction = getCallToAction( difficulty );
	return <span>
		{ getDescription( score, difficulty ) }
		&nbsp;
		{ difficulty >= DIFFICULTY.FAIRLY_DIFFICULT
			? <OutboundLink href={ link }>{ callToAction + "." }</OutboundLink>
			: callToAction
		}
	</span>;
}

/**
 * Flesch reading ease component.
 * @returns {JSX.Element} The element.
 */
const FleschReadingEase = () => {
	const score = useSelect( select => select( "yoast-seo/editor" ).getFleschReadingEaseScore(), [] );
	const link = useMemo( () => get( window, "wpseoAdminL10n.shortlinks-insights-flesch_reading_ease", "" ), [] );
	const difficulty = useSelect( select => select( "yoast-seo/editor" ).getFleschReadingEaseDifficulty(), [ score ] );
	const description = useMemo( () => {
		const articleLink = get( window, "wpseoAdminL10n.shortlinks-insights-flesch_reading_ease_article", "" );
		return getDescriptionElement( score, difficulty, articleLink );
	}, [ score, difficulty ] );

	return (
		<InsightsCard
			amount={ score }
			unit={ __( "out of 100", "wordpress-seo" ) }
			title={ __( "Flesch reading ease", "wordpress-seo" ) }
			linkTo={ link }
			linkText={ __( "Learn more about Flesch reading ease", "wordpress-seo" ) }
			description={ description }
		/>
	);
};

export default FleschReadingEase;
