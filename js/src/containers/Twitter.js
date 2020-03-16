/* External dependencies */
import { connect } from "react-redux";
import { actions } from "@yoast/social-metadata-forms";

/* Internal dependencies */
import TwitterWrapper from "../components/social/TwitterWrapper";
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
 * @returns {Object} The props for the TwitterView component.
 */
const mapStateToProps = ( state ) => {
	const image = state.socialReducer.twitter.image;
	return {
		recommendedReplacementVariables: state.settings.snippetEditor.recommendedReplacementVariables,
		replacementVariables: state.snippetEditor.replacementVariables,
		description: socialSelectors.getTwitterDescription( state ) || getDescriptionFallback( state ),
		title: socialSelectors.getTwitterTitle( state ) || getTitleFallback( state ),
		image: { ...image, fallbackUrl: getImageFallback( state ) },
		imageWarnings: state.socialReducer.twitter.warnings,
	};
};

const titleInput = document.getElementById( "yoast_wpseo_twitter-title" );
const descriptionInput = document.getElementById( "yoast_wpseo_twitter-description" );
const imageIdInput = document.getElementById( "yoast_wpseo_twitter-image-id" );
const imageUrlInput = document.getElementById( "yoast_wpseo_twitter-image" );

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
	}, "twitter" );
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
	dispatch( setSocialPreviewTitle( titleInput.value, "twitter" ) );
	dispatch( setSocialPreviewDescription( descriptionInput.innerText, "twitter" ) );
	dispatch( setSocialPreviewImageUrl( imageUrlInput.value, "twitter" ) );
	dispatch( setSocialPreviewImageId( imageIdInput.value, "twitter" ) );
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
			dispatch( setSocialPreviewImage( image, "twitter" ) );
			imageUrlInput.value = null;
			imageIdInput.value = null;
		},
		onDescriptionChange: ( description ) => {
			dispatch( setSocialPreviewDescription( description, "twitter" ) );
			descriptionInput.value = description;
		},
		onTitleChange: ( title ) => {
			dispatch( setSocialPreviewTitle( title, "twitter" ) );
			titleInput.value = title;
		},
	};
};

export default connect( mapStateToProps, mapDispatchToProps )( TwitterWrapper );
