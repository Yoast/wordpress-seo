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
			<h2>TwitterPreview landscape image</h2>
			<TwitterPreview
				src="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>TwitterPreview square image</h2>
			<TwitterPreview
				src="https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
		</ExamplesContainer>
	);
};

export default TwitterPreviewExample;
