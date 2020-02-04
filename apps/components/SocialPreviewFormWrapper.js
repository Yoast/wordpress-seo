import React from "react";
import SocialMetadataPreviewForm from "@yoast/social-metadata-previews/src/shared/SocialMetadataPreviewForm";
import ExamplesContainer from "./ExamplesContainer";

const replacementVariables = [
	{
		name: "title",
		label: "Title",
		value: "Title",
		description: "This is the title of your post",
	},
	{
		name: "post_type",
		label: "Post type",
		value: "Gallery",
		description: "This is the post type of your post",
	},
	{
		name: "sep",
		label: "Separator",
		value: " - ",
		description: "A separator that clarifies your search result snippet",
	},
	{
		name: "term404",
		label: "Error 404 slug",
		value: "Error 404 slug",
		description: "The slug which caused the error 404",
	},
];

const recommendedReplacementVariables = [
	"title",
	"post_type",
];

const SocialPreviewFormWrapper = () =>
	<ExamplesContainer>
		<SocialMetadataPreviewForm
		  socialMediumName="Facebook"
		  replacementVariables={ replacementVariables }
		  recommendedReplacementVariables={ recommendedReplacementVariables }
		/>
	</ExamplesContainer>
;

export default SocialPreviewFormWrapper;
