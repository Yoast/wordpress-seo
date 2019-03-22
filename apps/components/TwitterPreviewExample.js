import React from "react";

import ExamplesContainer from "./ExamplesContainer";
import TwitterPreview from "../../packages/social-metadata-previews/src/twitter/TwitterPreview";

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
				description="This is a description"
				siteName="yoast.com"
			/>
			<h2>TwitterPreview with long description</h2>
			<TwitterPreview
				title="YoastCon Workshops &bull; Yoast"
				description={
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description. " +
					"A very long description. A very long description. A very long description. A very long description."
				}
				siteName="yoast.com"
			/>
		</ExamplesContainer>
	);
};

export default TwitterPreviewExample;
