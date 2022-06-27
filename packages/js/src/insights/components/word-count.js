import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, _n } from "@wordpress/i18n";
import { InsightsCard } from "@yoast/components";
import { get } from "lodash";

/**
 * Text length component.
 * @returns {JSX.Element} The element.
 */
const WordCount = () => {
	const textLength = useSelect( select => select( "yoast-seo/editor" ).getTextLength(), [] );
	const textLengthLink = useMemo( () => get( window, "wpseoAdminL10n.shortlinks-insights-word_count", "" ), [] );

	let unitString = _n( "word", "words", textLength.count, "wordpress-seo" );
	let titleString = __( "Word count", "wordpress-seo" );
	let linkText =  __( "Learn more about word count", "wordpress-seo" );
	if ( textLength.wordOrCharacter === "character" ) {
		unitString = _n( "character", "characters", textLength.count, "wordpress-seo" );
		titleString = __( "Character count", "wordpress-seo" );
		linkText =  __( "Learn more about character count", "wordpress-seo" );
	}

	return (
		<InsightsCard
			amount={ textLength.count }
			unit={ unitString }
			title={ titleString }
			linkTo={ textLengthLink }
			linkText={ linkText }
		/>
	);
};

export default WordCount;
