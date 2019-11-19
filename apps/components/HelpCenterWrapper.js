import React from "react";
import styled from "styled-components";

import HelpCenter from "yoast-components/composites/Plugin/HelpCenter/HelpCenter";
import { colors } from "@yoast/style-guide";

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
			content: <div>KB</div>,
		},
		{
			label: "Get support",
			id: "support",
			content: <div>Get support content.</div>,
		},
	];
	return (
		<HelpCenter
			buttonBackgroundColor={ colors.$color_white }
			buttonTextColor={ colors.$color_pink_dark }
			buttonIconColor={ colors.$color_pink_dark }
			buttonWithTextShadow={ false }
			items={ items }
		/>
	);
}
