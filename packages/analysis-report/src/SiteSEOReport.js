import { ScoreAssessments as SiteSEOReportAssessments, StackedProgressBar } from "@yoast/components";
import React from "react";
import styled from "styled-components";

/**
 * SeoAssessment container.
 */
const SiteSEOReportContainer = styled.div`
`;

/**
 * SeoAssessment top text.
 */
const SiteSEOReportText = styled.p`
	font-size: 14px;
`;

/**
 * The Dashboard Seo Assessment component.
 *
 * @param {Object} props Component props.
 * @param {string} [props.className="seo-assessment"] The class name to use.
 * @param {string} [props.seoAssessmentText="SEO Assessment"] The text to show.
 * @param {{html: string, value: number, color: string}[]|null} [props.seoAssessmentItems=null] The items to show in the assessment.
 * @param {string} [props.barHeight="24px"] The height of the progress bar.
 *
 * @returns {ReactElement} The react component.
 */
const SiteSEOReport = ( {
	className = "seo-assessment",
	seoAssessmentText = "SEO Assessment",
	seoAssessmentItems = null,
	barHeight = "24px",
} ) => {
	return (
		<SiteSEOReportContainer
			className={ className }
		>
			<SiteSEOReportText
				className={ `${ className }__text` }
			>
				{ seoAssessmentText }
			</SiteSEOReportText>
			<StackedProgressBar
				className="progress"
				items={ seoAssessmentItems }
				barHeight={ barHeight }
			/>
			<SiteSEOReportAssessments
				className="assessments"
				items={ seoAssessmentItems }
			/>
		</SiteSEOReportContainer>
	);
};

export default SiteSEOReport;
