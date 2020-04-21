/* External dependencies */
import { actions } from "@yoast/social-metadata-forms";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";

/* Internal dependencies */
import FacebookWrapper from "../components/social/FacebookWrapper";

const titleInput = document.getElementById( "yoast_wpseo_opengraph-title" );
const descriptionInput = document.getElementById( "yoast_wpseo_opengraph-description" );
const imageIdInput = document.getElementById( "yoast_wpseo_opengraph-image-id" );
const imageUrlInput = document.getElementById( "yoast_wpseo_opengraph-image" );

/**
 * Sets the data from the hidden fields to the store.
 *
 * @returns {void}
 */
const dispatchHiddenFieldValues = () => {
	wpDataDispatch( actions.setSocialPreviewTitle( titleInput.value, "facebook" ) );
	wpDataDispatch( actions.setSocialPreviewDescription( descriptionInput.innerText, "facebook" ) );
	wpDataDispatch( actions.setSocialPreviewImageUrl( imageUrlInput.value, "facebook" ) );
	wpDataDispatch( actions.setSocialPreviewImageId( imageIdInput.value, "facebook" ) );
};

dispatchHiddenFieldValues();

// Make the media library accessible.
const media = window.wp.media();

// Listens for the selection of an image. Then gets the right data and dispatches the data to the store.
media.on( "select", () => {
	const selected = media.state().get( "selection" ).first();
	const {
		filesizeInBytes,
		subtype,
		height,
		width,
		url,
		id,
		alt,
	} = selected.attributes;
	window.wp.data.dispatch( "yoast-seo/editor" ).setSocialPreviewImage( {
		bytes: filesizeInBytes,
		type: subtype,
		url,
		id,
		width,
		height,
		alt,
	}, "facebook" );
	imageIdInput.value = id;
	imageUrlInput.value = url;
} );

export default compose( [
	withSelect( select => {
		const {
			getFacebookDescription,
			getFacebookTitle,
			getFacebookData,
			getImageFallback,
			getRecommendedReplaceVars,
			getReplaceVars,
			getSiteUrl,
			getAuthorName,
		} = select( "yoast-seo/editor" );

		const data = getFacebookData();
		const image = data.image;
		image.src = image.src || "";
		image.fallbackUrl = getImageFallback();
		return {
			image,
			recommendedReplacementVariables: getRecommendedReplaceVars(),
			replacementVariables: getReplaceVars(),
			description: getFacebookDescription(),
			title: getFacebookTitle(),
			imageWarnings: data.warnings,
			authorName: getAuthorName(),
			siteUrl: getSiteUrl(),
		};
	} ),

	withDispatch( dispatch => {
		const {
			setSocialPreviewTitle,
			setSocialPreviewDescription,
			clearSocialPreviewImage,
		} = dispatch( "yoast-seo/editor" );

		return {
			onSelectImageClick: () => {
				media.open();
			},
			onRemoveImageClick: () => {
				imageUrlInput.value = null;
				imageIdInput.value = null;
				clearSocialPreviewImage( "facebook" );
			},
			onDescriptionChange: ( description ) => {
				descriptionInput.value = description;
				setSocialPreviewDescription( description, "facebook" );
			},
			onTitleChange: ( title ) => {
				titleInput.value = title;
				setSocialPreviewTitle( title, "facebook" );
			},
		};
	} ),
] )( FacebookWrapper );
