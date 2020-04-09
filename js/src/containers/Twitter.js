/* External dependencies */
import { actions } from "@yoast/social-metadata-forms";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect, dispatch as wpDataDispatch } from "@wordpress/data";

/* Internal dependencies */
import TwitterWrapper from "../components/social/TwitterWrapper";

const titleInput = document.getElementById( "yoast_wpseo_twitter-title" );
const descriptionInput = document.getElementById( "yoast_wpseo_twitter-description" );
const imageIdInput = document.getElementById( "yoast_wpseo_twitter-image-id" );
const imageUrlInput = document.getElementById( "yoast_wpseo_twitter-image" );

/**
 * Sets the data from the hidden fields to the store.
 *
 * @returns {void}
 */
const dispatchHiddenFieldValues = () => {
	wpDataDispatch( actions.setSocialPreviewTitle( titleInput.value, "twitter" ) );
	wpDataDispatch( actions.setSocialPreviewDescription( descriptionInput.innerText, "twitter" ) );
	wpDataDispatch( actions.setSocialPreviewImageUrl( imageUrlInput.value, "twitter" ) );
	wpDataDispatch( actions.setSocialPreviewImageId( imageIdInput.value, "twitter" ) );
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
	}, "twitter" );
	imageIdInput.value = id;
	imageUrlInput.value = url;
} );

export default compose( [
	withSelect( select => {
		const {
			getTwitterDescription,
			getTwitterTitle,
			getTwitterData,
			getImageFallback,
			getRecommendedReplaceVars,
			getReplaceVars,
			getSiteName,
			getAuthorName,
		} = select( "yoast-seo/editor" );

		const data = getTwitterData();
		const image = data.image;
		image.fallbackUrl = getImageFallback();
		return {
			image,
			recommendedReplacementVariables: getRecommendedReplaceVars(),
			replacementVariables: getReplaceVars(),
			description: getTwitterDescription(),
			title: getTwitterTitle(),
			imageWarnings: data.warnings,
			authorName: getAuthorName(),
			siteName: getSiteName(),
			alt: data.alt,
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
				clearSocialPreviewImage( "twitter" );
			},
			onDescriptionChange: ( description ) => {
				descriptionInput.value = description;
				setSocialPreviewDescription( description, "twitter" );
			},
			onTitleChange: ( title ) => {
				titleInput.value = title;
				 setSocialPreviewTitle( title, "twitter" );
			},
		};
	} ),
] )( TwitterWrapper );
