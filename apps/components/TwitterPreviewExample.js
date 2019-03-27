import React from "react";

import ExamplesContainer from "./ExamplesContainer";
import { TwitterPreview } from "@yoast/social-metadata-previews";

/**
 * Returns the TwitterPreview examples.
 *
 * @returns {ReactElement} The TwitterPreview examples.
 */
const TwitterPreviewExample = () => {
	return (
		<ExamplesContainer backgroundColor="transparent">
			<h2>TwitterPreview</h2>
			<TwitterPreview
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
		</ExamplesContainer>
	);
};

export default TwitterPreviewExample;
