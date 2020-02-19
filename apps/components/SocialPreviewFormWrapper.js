import React from "react";
import { SocialMetadataPreviewForm } from "@yoast/social-metadata-previews";
import ExamplesContainer from "./ExamplesContainer";

const replacementVariables = [
	{
		name: "title",
		label: "title",
		value: "Title",
		description: "This is the title of your post",
	},
	{
		name: "post_type",
		label: "post type",
		value: "Gallery",
		description: "This is the post type of your post",
	},
	{
		name: "sep",
		label: "sep",
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

const selectFileClick = () => {
	alert( "YOU CLICKED MY BUTTON!" );
};

const SocialPreviewFormWrapper = () =>
	<ExamplesContainer>
		<h1>Regular Facebook</h1>
		<SocialMetadataPreviewForm
			socialMediumName="Facebook"
			replacementVariables={ replacementVariables }
			recommendedReplacementVariables={ recommendedReplacementVariables }
			description=""
			title="%%title%%%%page%%%%sep%%%%sitename%%"
			selectFileClick={ selectFileClick }
			onDescriptionChange={  () => {} }
			onTitleChange={ () => {} }
			imageWarnings={ [] }
			imageSelected={ false }
		/>
		<h1>Regular Twitter with selected image</h1>
		<SocialMetadataPreviewForm
			socialMediumName="Twitter"
			replacementVariables={ replacementVariables }
			recommendedReplacementVariables={ recommendedReplacementVariables }
			description=""
			title="%%title%%%%page%%%%sep%%%%sitename%%"
			selectFileClick={ selectFileClick }
			onDescriptionChange={  () => {} }
			onTitleChange={ () => {} }
			imageWarnings={ [] }
			imageSelected={ true }
		/>
		<h1>Twitter with warnings</h1>
		<SocialMetadataPreviewForm
			socialMediumName="Twitter"
			replacementVariables={ replacementVariables }
			recommendedReplacementVariables={ recommendedReplacementVariables }
			description=""
			title="%%title%%%%page%%%%sep%%%%sitename%%"
			selectFileClick={ selectFileClick }
			onDescriptionChange={  () => {} }
			onTitleChange={ () => {} }
			imageWarnings={ [
				"You destroyed the world!",
				"Also, that is not a great image.",
				"Something else is wrong too...",
			] }
			imageSelected={ true }
		/>
	</ExamplesContainer>
;

export default SocialPreviewFormWrapper;
