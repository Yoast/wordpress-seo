import React from "react";
import styled from "styled-components";

import HelpCenter from "../composites/Plugin/HelpCenter/HelpCenter";
import VideoTutorial from "../composites/HelpCenter/views/VideoTutorial";
import AlgoliaSearcher from "../composites/AlgoliaSearch/AlgoliaSearcher";
import colors from "../style-guide/colors.json";

export const HelpCenterContainer = styled.div`
	background-color: ${ colors.$color_grey_light };
`;

/**
 * Returns the HelpCenterWrapper component.
 *
 * @returns {ReactElement} The HelpCenterWrapper component.
 */
export default function HelpCenterWrapper() {
	const items = [
		{
			label: "Video tutorial",
			id: "video-tutorial",
			content: <VideoTutorial
				src="https://www.youtube.com/embed/bIgcj_pPIbw"
				title="Video tutorial"
				paragraphs={
					[
						{
							title: "Need some help?",
							description: "Go Premium and our experts will be there for you to answer any questions you " +
							"might have about the setup and use of the plugin.",
							link: "#1",
							linkText: "Get Yoast SEO Premium now »",
						},
						{
							title: "Want to be a Yoast SEO Expert?",
							description: "Follow our Yoast SEO for WordPress training and become a certified Yoast SEO Expert!",
							link: "#2",
							linkText: "Enroll in the Yoast SEO for WordPress training »",
						},
					]
				}
			/>,
		},
		{

			label: "Knowledge base",
			id: "knowledge-base",
			content: <AlgoliaSearcher />,
		},
		{
			label: "Get support",
			id: "support",
			content: <div>Get support content.</div>,
		},
	];
	return (
		<HelpCenterContainer>
			<HelpCenter
				buttonBackgroundColor={ colors.$color_white }
				buttonTextColor={ colors.$color_pink_dark }
				buttonIconColor={ colors.$color_pink_dark }
				buttonWithTextShadow={ false }
				items={ items }
			/>
		</HelpCenterContainer>
	);
}
