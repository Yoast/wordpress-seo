import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { ScoreAssessments as SiteSEOReportAssessments, StackedProgressBar } from "@yoast/components";

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
 * @param {object} props The component props.
 *
 * @returns {ReactElement} The react component.
 */
const SiteSEOReport = ( props ) => {
	return (
		<SiteSEOReportContainer
			className={ props.className }
		>
			<SiteSEOReportText
				className={ `${ props.className }__text` }
			>
				{ props.seoAssessmentText }
			</SiteSEOReportText>
			<StackedProgressBar
				className="progress"
				items={ props.seoAssessmentItems }
				barHeight={ props.barHeight }
			/>
			<SiteSEOReportAssessments
				className="assessments"
				items={ props.seoAssessmentItems }
			/>
		</SiteSEOReportContainer>
	);
};

SiteSEOReport.propTypes = {
	className: PropTypes.string,
	seoAssessmentText: PropTypes.string,
	seoAssessmentItems: PropTypes.arrayOf(
		PropTypes.shape( {
			html: PropTypes.string.isRequired,
			value: PropTypes.number.isRequired,
			color: PropTypes.string.isRequired,
		} )
	),
	barHeight: PropTypes.string,
};

SiteSEOReport.defaultProps = {
	className: "seo-assessment",
	seoAssessmentText: "SEO Assessment",
	seoAssessmentItems: null,
	barHeight: "24px",
};

export default SiteSEOReport;
