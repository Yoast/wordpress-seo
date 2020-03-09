/* External dependencies */
import { connect } from "react-redux";
import { actions } from "@yoast/social-metadata-forms";

/* Internal dependencies */
import FacebookWrapper from "../components/social/FacebookWrapper";
import { socialSelectors }  from "../redux/selectors/socialSelectors";
import { getImageFallback, getDescriptionFallback, getTitleFallback } from "../redux/selectors/fallbackSelectors";

const {
	setSocialPreviewTitle,
	setSocialPreviewDescription,
	setSocialPreviewImage,
	setSocialPreviewImageUrl,
	setSocialPreviewImageId,
} = actions;

/**
 * Maps the state to props.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The props for the FacebookView component.
 */
const mapStateToProps = ( state ) => {
	const imageObject = state.socialReducer.facebook.image;
	const image = imageObject.url ? imageObject : { ...imageObject, url: getImageFallback( state ) };
	return {
		recommendedReplacementVariables: state.settings.snippetEditor.recommendedReplacementVariables,
		replacementVariables: state.snippetEditor.replacementVariables,
		description: socialSelectors.getFacebookDescription( state ) || getDescriptionFallback( state ),
		title: socialSelectors.getFacebookTitle( state ) || getTitleFallback( state ),
		image: image,
		imageWarnings: state.socialReducer.facebook.warnings,
	};
};

const titleInput = document.getElementById( "yoast_wpseo_opengraph-title" );
const descriptionInput = document.getElementById( "yoast_wpseo_opengraph-description" );
const imageIdInput = document.getElementById( "yoast_wpseo_opengraph-image-id" );
const imageUrlInput = document.getElementById( "yoast_wpseo_opengraph-image" );

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
	} = selected.attributes;
	window.wp.data.dispatch( "yoast-seo/editor" ).setSocialPreviewImage( {
		bytes: filesizeInBytes,
		type: subtype,
		url,
		id,
		width,
		height,
	}, "facebook" );
	imageIdInput.value = id;
	imageUrlInput.value = url;
} );

/**
 * Sets the data from the hidden fields to the store.
 *
 * @param {func} dispatch Dispatches an action to the store.
 *
 * @returns {void}
 */
const dispatchHiddenFieldValues = ( dispatch ) => {
	dispatch( setSocialPreviewTitle( titleInput.value, "facebook" ) );
	dispatch( setSocialPreviewDescription( descriptionInput.innerText, "facebook" ) );
	dispatch( setSocialPreviewImageUrl( imageUrlInput.value, "facebook" ) );
	dispatch( setSocialPreviewImageId( imageIdInput.value, "facebook" ) );
};

/**
 * Maps the dispatch to props.
 *
 * @param {function} dispatch The dispatch function.
 *
 * @returns {Object} The dispatch props.
 */
const mapDispatchToProps = ( dispatch ) => {
	dispatchHiddenFieldValues( dispatch );
	return {
		onSelectImageClick: () => {
			media.open();
		},
		// Set the image object back to default.
		onRemoveImageClick: () => {
			const image = {
				bytes: null,
				type: null,
				height: null,
				width: null,
				url: null,
				id: null,
			};
			dispatch( setSocialPreviewImage( image, "facebook" ) );
			imageUrlInput.value = null;
			imageIdInput.value = null;
		},
		onDescriptionChange: ( description ) => {
			dispatch( setSocialPreviewDescription( description, "facebook" ) );
			descriptionInput.value = description;
		},
		onTitleChange: ( title ) => {
			dispatch( setSocialPreviewTitle( title, "facebook" ) );
			titleInput.value = title;
		},
	};
};

export default connect( mapStateToProps, mapDispatchToProps )( FacebookWrapper );
