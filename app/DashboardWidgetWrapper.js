import React from "react";
import styled from "styled-components";

import {
	DashboardWidgetSeoAssessment,
	DashboardWidgetWordpressFeed,
} from "../composites/Plugin/DashboardWidget";

export const DashboardWidgetContainer = styled.div`
   min-height: 700px;
   background-color: white;
`;

export const DashboardContainer = styled.div`
	padding: 8px;
	border: 1px solid black;
	width: 400px;
`;

/**
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
export default function DashboardWidget() {
	const seoAssessmentItems = [
		{
			value: 33,
			color: "#F00",
			html: "Posts with a <b>bad</b> score",
		},
		{
			value: 20,
			color: "#FF0",
			html: "Posts with a <b>decent</b> score",
		},
		{
			value: 47,
			color: "#0F0",
			html: "Posts with a <b>good</b> score",
		},
	];

	const feed = {
		link: "https://www.yoast.com",
		title: "Feed title",
		items: [
			{
				title: "Wordpress SEO",
				link: "https://www.yoast.com/1",
				description: "Some arbitrary description any blog post could have",
			},
			{
				title: "Wordpress SEO",
				link: "https://www.yoast.com/2",
				description: "Some arbitrary description any blog post could have",
			},
		],
	};

	return (
		<DashboardWidgetContainer>
			<DashboardContainer>
				<DashboardWidgetSeoAssessment
					seoAssessmentText="Your SEO score is decent overall, but can be improved! Get to work!"
					seoAssessmentItems={ seoAssessmentItems }
				/>
				<DashboardWidgetWordpressFeed
					feed={ feed }
					footerHtml="View our blog on yoast.com!"
				/>
			</DashboardContainer>
		</DashboardWidgetContainer>
	);
}
