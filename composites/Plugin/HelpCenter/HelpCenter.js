import React from "react";
import styled from "styled-components";

import YoastTabs from "../Shared/components/YoastTabs";
import AlgoliaSearcher from "../../AlgoliaSearch/AlgoliaSearcher";

export const HelpCenterContainer = styled.div`
	box-sizing: border-box;
	min-height: 700px;
	width: 100%;
	background-color: white;
`;

/**
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
export default function HelpCenter() {
	return (
		<HelpCenterContainer>
			<YoastTabs
				items={ [
					{
						label: "Video tutorial",
						id: "video_tutorial",
						content: <h1>Video tutorial</h1>,
					},
					{
						label: "Knowledge base",
						id: "knowledge_base",
						content: <AlgoliaSearcher />,
					},
					{
						label: "Support",
						id: "support",
						content: <h1>Support</h1>,
					},
				] } />
		</HelpCenterContainer>
	);
}

HelpCenter.propTypes = {

}
