import React from "react";
import styled from "styled-components";

import AlgoliaSearcher from "../../../AlgoliaSearch/AlgoliaSearcher";

export const ContentAnalysisContainer = styled.div`
	min-height: 700px;
	width: 100%;
	padding-top: 40px;
	background-color: white;
`;

/**
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
export default function ContentAnalysis() {
	return <ContentAnalysisContainer>
		<AlgoliaSearcher maxWidth="1280px" enableLiveSearch={ false } />
	</ContentAnalysisContainer>;
}
