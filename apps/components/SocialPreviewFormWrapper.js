import React from "react";
import { SocialMetadataPreviewForm } from "@yoast/social-metadata-forms";
import ExamplesContainer from "./ExamplesContainer";
import { noop } from "lodash";

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

/**
 * Creates a callback that shows an alert dialog.
 *
 * @param {string} message The message that should be shown.
 *
 * @returns {Function} Callback function.
 */
const selectFileClick = ( message = "YOU CLICKED MY BUTTON!" ) => {
	return alert.bind( null, message );
};

/**
 * Renders a react Component.
 *
 * @returns {React.Element} The element.
 */
const SocialPreviewFormWrapper = () =>
	<ExamplesContainer>
		<h1>Regular Facebook</h1>
		<SocialMetadataPreviewForm
			socialMediumName="Social"
			replacementVariables={ replacementVariables }
			recommendedReplacementVariables={ recommendedReplacementVariables }
			description=""
			title="%%title%%%%page%%%%sep%%%%sitename%%"
			onSelectImageClick={ selectFileClick( "select image 1" ) }
			onRemoveImageClick={ selectFileClick( "remove image 1" ) }
			onDescriptionChange={ noop }
			onTitleChange={ noop }
			imageWarnings={ [] }
			imageSelected={ false }
		/>
		<h1>Regular X with selected image</h1>
		<SocialMetadataPreviewForm
			socialMediumName="X"
			replacementVariables={ replacementVariables }
			recommendedReplacementVariables={ recommendedReplacementVariables }
			description=""
			title="%%title%%%%page%%%%sep%%%%sitename%%"
			onSelectImageClick={ selectFileClick( "select image 2" ) }
			onRemoveImageClick={ selectFileClick( "remove image 2" ) }
			onDescriptionChange={ noop }
			onTitleChange={ noop }
			imageWarnings={ [] }
			imageSelected={ true }
		/>
		<h1>X with warnings</h1>
		<SocialMetadataPreviewForm
			socialMediumName="X"
			replacementVariables={ replacementVariables }
			recommendedReplacementVariables={ recommendedReplacementVariables }
			description=""
			title="%%title%%%%page%%%%sep%%%%sitename%%"
			onSelectImageClick={ selectFileClick( "select image 3" ) }
			onRemoveImageClick={ selectFileClick( "remove image 3" ) }
			onDescriptionChange={ noop }
			onTitleChange={ noop }
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
