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
			<h2>Summary with large image card, short description</h2>
			<TwitterPreview
				title="YoastCon Workshops &bull; Yoast"
				isLarge={ true }
				description="This is a description."
				siteName="yoast.com"
			/>
			<h2>Summary with large image card, long description</h2>
			<TwitterPreview
				title="YoastCon Workshops &bull; Yoast"
				isLarge={ true }
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
				isLarge={ false }
				description="This is a description."
				siteName="yoast.com"
			/>
			<h2>Summary card, long description</h2>
			<TwitterPreview
				title="YoastCon Workshops &bull; Yoast"
				isLarge={ false }
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
