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
			<h2>Summary with large image card (original = landscape)</h2>
			<TwitterPreview
				// Try out a landscape picture that isn't yet 2:1
				src="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg"
				type="summary-large-image"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Summary with large image card (original = portrait)</h2>
			<TwitterPreview
				// Try out a portrait picture
				src="https://i1.wp.com/2016.europe.wordcamp.org/files/2016/04/Joost-Marieke.jpg?w=403&h=605&ssl=1"
				type="summary-large-image"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Summary with large image card (original = square)</h2>
			<TwitterPreview
				// Try out a perfectly square picture (1:1)
				src="https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png"
				type="summary-large-image"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Summary card (original = landscape)</h2>
			<TwitterPreview
				// Try out a landscape picture that isn't yet 2:1
				src="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg"
				type="summary"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Summary card (original = portrait)</h2>
			<TwitterPreview
				// Try out a portrait picture
				src="https://i1.wp.com/2016.europe.wordcamp.org/files/2016/04/Joost-Marieke.jpg?w=403&h=605&ssl=1"
				type="summary"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Summary card (original = square)</h2>
			<TwitterPreview
				// Try out a perfectly square picture (1:1)
				src="https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png"
				type="summary"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Summary with large image card (no image provided)</h2>
			<TwitterPreview
				src=""
				type="summary-large-image"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
		</ExamplesContainer>
	);
};

export default TwitterPreviewExample;
