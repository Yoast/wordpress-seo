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
			<h2>Summary with large image card (feed landscape)</h2>
			<TwitterPreview
				// Try out a landscape picture that isn't yet 2:1
				src="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg"
				type="summary-large-image"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Summary with large image card (feed portrait)</h2>
			<TwitterPreview
				// Try out a portrait picture
				src="https://yoast.com/app/uploads/2012/10/yoast-video.png"
				type="summary-large-image"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Summary card (feed square)</h2>
			<TwitterPreview
				// Try out a perfectly square picture (1:1)
				src="https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png"
				type="summary"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
		</ExamplesContainer>
	);
};

export default TwitterPreviewExample;
