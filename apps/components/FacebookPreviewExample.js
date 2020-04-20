/* External dependencies */
import React from "react";
import styled from "styled-components";

/* Internal dependencies */
import ExamplesContainer from "./ExamplesContainer";
import { FacebookPreview } from "@yoast/social-metadata-previews";

const FacebookPreviewExampleContainer = styled( ExamplesContainer )`
	display: flex;
	flex-direction: column;
	margin-left: 50px;
`;

/**
 * Returns the FacebookPreview examples.
 *
 * @returns {ReactElement} The FacebookPreview examples.
 */
const FacebookPreviewExample = () => {
	return (
		<FacebookPreviewExampleContainer backgroundColor="transparent">
			<h2>FacebookPreview Landscape</h2>
			<FacebookPreview
				siteUrl="siteUrl.com"
				authorName="John Doe"
				title="YoastCon Workshops"
				description="Some description with words. In two whole sentences."
				image="https://yoast.com/app/uploads/2015/06/How_to_choose_keywords_FI.png"
			/>
			<h2>FacebookPreview Landscape very large image</h2>
			<FacebookPreview
				siteUrl="siteUrl.com"
				title={
					"A very long title. A very long title. A very long title. A very long title. " +
					"A very long title. A very long title. A very long title. A very long title. " +
					"A very long title. A very long title. A very long title. A very long title. " +
					"A very long title. A very long title. A very long title. A very long title. " +
					"A very long title. A very long title. A very long title. A very long title. " +
					"A very long title. A very long title. A very long title. A very long title. " +
					"A very long title. A very long title. A very long title. A very long title. " +
					"A very long title. A very long title. A very long title. A very long title. " +
					"A very long title. A very long title. A very long title. A very long title."
				}
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
				image="https://yoast.com/app/uploads/2019/02/horizontal-1200x400.jpg"
			/>
			<h2>FacebookPreview Portrait</h2>
			<FacebookPreview
				siteUrl="siteUrl.com"
				authorName="John Doe"
				title="YoastCon Workshops"
				description="<h1>Some description with words. And some <strong>HTML</strong> that will get stripped.</h1>"
				image="https://yoast.com/app/uploads/2015/09/Author_Joost_x2.png"
			/>
			<h2>FacebookPreview Portrait very tall image</h2>
			<FacebookPreview
				siteUrl="siteUrl.com"
				title="YoastCon Workshops"
				description=""
				image="https://yoast.com/app/uploads/2019/02/vertical-300x580.jpg"
			/>
			<h2>FacebookPreview Square</h2>
			<FacebookPreview
				siteUrl="siteUrl.com"
				title="YoastCon Workshops"
				description="Some description with words. In two whole sentences."
				image="https://yoast.com/app/uploads/2018/09/avatar_user_1_1537774226.png"
			/>
			<h2>FacebookPreview image too small</h2>
			<FacebookPreview
				siteUrl="siteUrl.com"
				title="YoastCon Workshops"
				description="Some description with words. In two whole sentences."
				image="https://yoast.com/app/uploads/2018/11/Logo_TYPO3-250x105.png"
			/>
			<h2>FacebookPreview faulty image</h2>
			<FacebookPreview
				siteUrl="siteUrl.com"
				title="YoastCon Workshops"
				description="Some description with words. In two whole sentences."
				image="thisisnoimage"
			/>
			<h2>FacebookPreview no image</h2>
			<FacebookPreview
				siteUrl="siteUrl.com"
				title="YoastCon Workshops"
				description="Some description with words. In two whole sentences."
			/>
		</FacebookPreviewExampleContainer>
	);
};

export default FacebookPreviewExample;
