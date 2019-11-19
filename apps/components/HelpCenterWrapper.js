import React from "react";
import styled from "styled-components";

import HelpCenter from "yoast-components/composites/Plugin/HelpCenter/HelpCenter";
import { colors } from "@yoast/style-guide";
import AlgoliaSearcher from "@yoast/algolia-search-box";

export const HelpCenterContainer = styled.div`
	max-width: 1280px;
	margin: 1em auto 0;
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
			content: <div>La la</div>,
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
