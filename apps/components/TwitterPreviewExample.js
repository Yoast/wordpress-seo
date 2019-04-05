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
			<h2>Upload a large landscape image</h2>
			<TwitterPreview
				// Dimensions: 2081x1321 (width x height)
				src="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Upload a small landscape image</h2>
			<TwitterPreview
				// Dimensions: 250x131 (width x height)
				src="https://yoast.com/app/uploads/2008/04/WordPress_SEO_definitive_guide_FI-250x131.png"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Upload a large portrait image</h2>
			<TwitterPreview
				// Dimensions: 403x605 (width x height)
				src="https://i1.wp.com/2016.europe.wordcamp.org/files/2016/04/Joost-Marieke.jpg?w=403&h=605&ssl=1"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Upload a small portrait image</h2>
			<TwitterPreview
				// Dimensions: 240x268 (width x height)
				src="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Upload a large square image</h2>
			<TwitterPreview
				// Dimensions: 512x512 (width x height)
				src="https://yoast.com/app/uploads/sites/5/2016/09/yoast-logo-icon-512x512.png"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Upload a small square image</h2>
			<TwitterPreview
				// Dimensions: 250x250 (width x height)
				src="https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Upload no image</h2>
			<TwitterPreview
				src=""
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
			<h2>Upload a too small image</h2>
			<TwitterPreview
				src="https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png"
				title="YoastCon Workshops &bull; Yoast"
				siteName="yoast.com"
			/>
		</ExamplesContainer>
	);
};

export default TwitterPreviewExample;
