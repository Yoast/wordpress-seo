import React from "react";
import styled from "styled-components";
import VideoTutorial from "../../../HelpCenter/views/VideoTutorial.js";

export const ContentAnalysisContainer = styled.div`
	min-height: 700px;
	width: 100%;
	background-color: white;
`;

/**
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
export default function ContentAnalysis() {
	return <ContentAnalysisContainer>
		<VideoTutorial src="https:/www.youtube.com/embed/bIgcj_pPIbw" title="Video title" description="Video description"/>
	</ContentAnalysisContainer>;
}
