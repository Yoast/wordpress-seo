import { withSelect } from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { colors } from "@yoast/style-guide";
import getIndicatorForScore from "../analysis/getIndicatorForScore";
import PluginIcon from "../components/PluginIcon";

export default compose( [
	withSelect( ( select ) => {
		const data = select( "yoast-seo/editor" );
		const seoScoreIndicator = getIndicatorForScore( data.getResultsForFocusKeyword().overallScore );
		const readabilityScoreIndicator = getIndicatorForScore( data.getReadabilityResults().overallScore );
		const { isKeywordAnalysisActive, isContentAnalysisActive } = data.getPreferences();

		let readabilityScoreColor;
		switch ( readabilityScoreIndicator.className ) {
			case "good":
				readabilityScoreColor = colors.$color_good;
				break;
			case "ok":
				readabilityScoreColor = colors.$color_ok;
				break;
			case "bad":
			default:
				readabilityScoreColor = colors.$color_bad;
				break;
		}

		let seoScoreColor;
		switch ( seoScoreIndicator.className ) {
			case "good":
				seoScoreColor = colors.$color_good;
				break;
			case "ok":
				seoScoreColor = colors.$color_ok;
				break;
			case "bad":
			default:
				seoScoreColor = colors.$color_bad;
				break;
		}

		return {
			readabilityScoreColor,
			seoScoreColor,
			isKeywordAnalysisActive,
			isContentAnalysisActive,
		};
	} ),
] )( PluginIcon );
