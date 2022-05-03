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
				// Dimensions: 1200x628 (width x height)
				imageUrl="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg"
				title="YoastCon Workshops &bull; Yoast"
				imageFallbackUrl=""
				siteUrl="yoast.com"
				isLarge={ true }
			/>
			<h2>Large landscape with a long title and text</h2>
			<TwitterPreview
				// Dimensions: 1200x628 (width x height)
				imageUrl="https://yoast.com/app/uploads/2019/03/Storytelling_FI.jpg"
				title="Wow this title is so long that it must be truncated! Jokey that is not even close to the required length for truncation."
				imageFallbackUrl=""
				description={ "We are also providing a long description. This ensures that the description will be truncated. For a large summary like this, that only happens after 234 characters. Are we there yet? No, apparently that are a lot of characters. Who is reading such a long description anyway?." }
				siteUrl="yoast.com"
				isLarge={ true }
			/>
			<h2>Upload a small landscape image</h2>
			<TwitterPreview
				// Dimensions: 250x131 (width x height)
				imageUrl="https://yoast.com/app/uploads/2008/04/WordPress_SEO_definitive_guide_FI-250x131.png"
				title="YoastCon Workshops &bull; Yoast"
				imageFallbackUrl=""
				siteUrl="yoast.com"
				isLarge={ false }
			/>
			<h2>Upload a large portrait image</h2>
			<TwitterPreview
				// Dimensions: 403x605 (width x height)
				imageUrl="https://i1.wp.com/2016.europe.wordcamp.org/files/2016/04/Joost-Marieke.jpg?w=403&h=605&ssl=1"
				title="YoastCon Workshops &bull; Yoast"
				imageFallbackUrl=""
				siteUrl="yoast.com"
				isLarge={ true }
			/>
			<h2>Upload a small portrait image</h2>
			<TwitterPreview
				// Dimensions: 240x268 (width x height)
				imageUrl="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png"
				title="YoastCon Workshops &bull; Yoast"
				imageFallbackUrl=""
				siteUrl="yoast.com"
				isLarge={ false }
			/>
			<h2>Upload a large square image</h2>
			<TwitterPreview
				// Dimensions: 512x512 (width x height)
				imageUrl="https://yoast.com/app/uploads/sites/5/2016/09/yoast-logo-icon-512x512.png"
				title="YoastCon Workshops &bull; Yoast"
				imageFallbackUrl=""
				siteUrl="yoast.com"
				isLarge={ true }
			/>
			<h2>Upload a small square image</h2>
			<TwitterPreview
				// Dimensions: 250x250 (width x height)
				imageUrl="https://yoast.com/app/uploads/2015/09/Avatar_Marieke_500x500-250x250.png"
				title="YoastCon Workshops &bull; Yoast"
				imageFallbackUrl=""
				siteUrl="yoast.com"
				isLarge={ false }
				description={ "We are also providing a long description. This ensures that the description will be truncated. For a large summary like this, that only happens after 234 characters. Are we there yet? No, apparently that are a lot of characters. Who is reading such a long description anyway?." }
			/>
			<h2>Upload no image</h2>
			<TwitterPreview
				imageUrl=""
				title="YoastCon Workshops &bull; Yoast"
				imageFallbackUrl=""
				siteUrl="yoast.com"
				isLarge={ true }
			/>
			<h2>Upload no image (small card)</h2>
			<TwitterPreview
				imageUrl=""
				title="YoastCon Workshops &bull; Yoast"
				imageFallbackUrl=""
				siteUrl="yoast.com"
				isLarge={ false }
			/>
			<h2>Upload a too small image</h2>
			<TwitterPreview
				imageUrl="https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png"
				title="YoastCon Workshops &bull; Yoast"
				imageFallbackUrl=""
				isLarge={ true }
				description="This is a description."
				siteUrl="yoast.com"
			/>
			<h2>Short description (no image)</h2>
			<TwitterPreview
				title="YoastCon Workshops &bull; Yoast"
				imageFallbackUrl=""
				imageUrl=""
				isLarge={ true }
				description="This is a description."
				siteUrl="yoast.com"
			/>
			<h2>Long description (no image)</h2>
			<TwitterPreview
				title="YoastCon Workshops &bull; Yoast"
				imageFallbackUrl=""
				imageUrl=""
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
				siteUrl="yoast.com"
			/>
		</ExamplesContainer>
	);
};

export default TwitterPreviewExample;
