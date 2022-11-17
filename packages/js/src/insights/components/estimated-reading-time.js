import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __, _n } from "@wordpress/i18n";
import { InsightsCard } from "@yoast/components";
import { get } from "lodash";

/**
 * Estimated reading time component.
 * @returns {JSX.Element} The element.
 */
const EstimatedReadingTime = () => {
	const estimatedReadingTime = useSelect( select => select( "yoast-seo/editor" ).getEstimatedReadingTime(), [] );
	const estimatedReadingTimeLink = useMemo( () => get( window, "wpseoAdminL10n.shortlinks-insights-estimated_reading_time", "" ), [] );

	return (
		<InsightsCard
			amount={ estimatedReadingTime }
			unit={ _n( "minute", "minutes", estimatedReadingTime, "wordpress-seo" ) }
			title={ __( "Reading time", "wordpress-seo" ) }
			linkTo={ estimatedReadingTimeLink }
			linkText={ __( "Learn more about reading time", "wordpress-seo" ) }
		/>
	);
};

export default EstimatedReadingTime;
