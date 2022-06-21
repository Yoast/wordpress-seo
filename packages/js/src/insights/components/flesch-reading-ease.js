import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { InsightsCard } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";
import { get } from "lodash";
import createInterpolateElement from "../../helpers/createInterpolateElement";

const OutboundLink = makeOutboundLink();

/**
 * Flesch reading ease component.
 * @returns {JSX.Element} The element.
 */
const FleschReadingEase = () => {
	const fleschReadingEaseScore = useSelect( select => select( "yoast-seo/editor" ).getFleschReadingEaseScore(), [] );
	const fleschReadingEaseLink = useMemo( () => get( window, "wpseoAdminL10n.shortlinks-insights-flesch_reading_ease", "" ), [] );
	const fleschReadingEaseText = useSelect( select => select( "yoast-seo/editor" ).getFleschReadingEaseText(), [] );
	const fleschReadingEaseDescription = useMemo( () => {
		const link = get( window, "wpseoAdminL10n.shortlinks-insights-flesch_reading_ease_article", "" );
		return createInterpolateElement(
			fleschReadingEaseText,
			{
				a: <OutboundLink href={ link } />,
			}
		);
	}, [ fleschReadingEaseText ] );

	return (
		<InsightsCard
			amount={ fleschReadingEaseScore }
			unit={ __( "out of 100", "wordpress-seo" ) }
			title={ __( "Flesch reading ease", "wordpress-seo" ) }
			linkTo={ fleschReadingEaseLink }
			linkText={ __( "Learn more about Flesch reading ease", "wordpress-seo" ) }
			description={ <span>{ fleschReadingEaseDescription }</span> }
		/>
	);
};

export default FleschReadingEase;
