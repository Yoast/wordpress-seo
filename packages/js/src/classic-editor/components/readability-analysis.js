/* global wpseoAdminL10n */
/* External components */
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import { isNil } from "lodash-es";

/* Internal components */

import ScoreIconPortal from "../../components/portals/ScoreIconPortal";
import { ReadabilityResultsContainer, SEO_STORE_NAME } from "@yoast/seo-integration";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import HelpLink from "../../components/HelpLink";
import Portal from "../../components/portals/Portal";
import { ContentAnalysis } from "@yoast/analysis-report";
import { useSelect } from "@wordpress/data";

const AnalysisHeader = styled.span`
	font-size: 1em;
	font-weight: bold;
	margin: 0 0 8px;
	display: block;
`;

const ReadabilityResultsTabContainer = styled.div`
	padding: 16px;
`;

const StyledHelpLink = styled( HelpLink )`
	margin: -8px 0 -4px 4px;
`;

/**
 * Redux container for the readability analysis.
 *
 * @returns {wp.Element} The Readability Analysis component.
 */
const ReadabilityAnalysis = () => {
	const readabilityScore = useSelect( select => select( SEO_STORE_NAME ).selectReadabilityScore() );

	const score = getIndicatorForScore( readabilityScore );

	if ( isNil( readabilityScore ) ) {
		score.className = "loading";
	}

	/*
	 * Renders the Readability Analysis component.
	 *
	 * @returns {wp.Element} The Readability Analysis component.
	 */
	return (
		<Portal target="wpseo-metabox-readability-root">
			<ReadabilityResultsTabContainer>
				<ScoreIconPortal
					target="wpseo-readability-score-icon"
					scoreIndicator={ score.className }
				/>
				<AnalysisHeader>
					{ __( "Analysis results", "wordpress-seo" ) }
					<StyledHelpLink
						href={ wpseoAdminL10n[ "shortlinks.readability_analysis_info" ] }
						className="dashicons"
					>
						<span className="screen-reader-text">
							{ __( "Learn more about the readability analysis", "wordpress-seo" ) }
						</span>
					</StyledHelpLink>
				</AnalysisHeader>
				<ReadabilityResultsContainer as={ ContentAnalysis } />
			</ReadabilityResultsTabContainer>
		</Portal>
	);
};

export default ReadabilityAnalysis;
