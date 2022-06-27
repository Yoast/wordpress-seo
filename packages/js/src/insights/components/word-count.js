import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, _n } from "@wordpress/i18n";
import { InsightsCard } from "@yoast/components";
import { get } from "lodash";

/**
 * Word count component.
 * @returns {JSX.Element} The element.
 */
const WordCount = () => {
	const wordCount = useSelect( select => select( "yoast-seo/editor" ).getWordCount(), [] );
	const wordCountLink = useMemo( () => get( window, "wpseoAdminL10n.shortlinks-insights-word_count", "" ), [] );

	return (
		<InsightsCard
			amount={ wordCount }
			unit={ _n( "word", "words", wordCount, "wordpress-seo" ) }
			title={ __( "Word count", "wordpress-seo" ) }
			linkTo={ wordCountLink }
			linkText={ __( "Learn more about word count", "wordpress-seo" ) }
		/>
	);
};

export default WordCount;
