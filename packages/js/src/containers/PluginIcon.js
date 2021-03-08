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

		/* eslint-disable-next-line no-unused-vars */
		let readabilityScoreColor;
		switch ( readabilityScoreIndicator.className ) {
			case "good":
				readabilityScoreColor = colors.$color_good;
				break;
			case "ok":
				readabilityScoreColor = colors.$color_ok;
				break;
			case "bad":
				readabilityScoreColor = colors.$color_bad;
				break;
			default:
				readabilityScoreColor = colors.$color_score_icon;
				break;
		}

		/* eslint-disable-next-line no-unused-vars */
		let seoScoreColor;
		switch ( seoScoreIndicator.className ) {
			case "good":
				seoScoreColor = colors.$color_good;
				break;
			case "ok":
				seoScoreColor = colors.$color_ok;
				break;
			case "bad":
				seoScoreColor = colors.$color_bad;
				break;
			default:
				seoScoreColor = colors.$color_score_icon;
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
