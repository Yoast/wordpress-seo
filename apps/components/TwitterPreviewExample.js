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
			<h2>Summary with large image card, short description</h2>
			<TwitterPreview
				title="YoastCon Workshops &bull; Yoast"
				type="summary-large-image"
				description="This is a description."
				siteName="yoast.com"
			/>
			<h2>Summary with large image card, long description</h2>
			<TwitterPreview
				title="YoastCon Workshops &bull; Yoast"
				type="summary-large-image"
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
			<h2>Summary card, short description</h2>
			<TwitterPreview
				title="YoastCon Workshops &bull; Yoast"
				type="summary"
				description="This is a description."
				siteName="yoast.com"
			/>
			<h2>Summary card, long description</h2>
			<TwitterPreview
				title="YoastCon Workshops &bull; Yoast"
				type="summary"
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
	)
};

export default TwitterPreviewExample;
