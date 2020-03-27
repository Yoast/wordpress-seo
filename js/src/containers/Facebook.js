/* External dependencies */
import { actions } from "@yoast/social-metadata-forms";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";

/* Internal dependencies */
import FacebookWrapper from "../components/social/FacebookWrapper";
import { socialSelectors }  from "../redux/selectors/socialSelectors";

/**
 * Maps the state to props.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The props for the FacebookView component.
 */
const mapStateToProps = ( state ) => {
	const data = socialSelectors.getFacebookData( state );
	const image = data.image;
	image.fallbackUrl = getImageFallback( state );

	return {
		recommendedReplacementVariables: state.settings.snippetEditor.recommendedReplacementVariables,
		replacementVariables: state.snippetEditor.replacementVariables,
		description: socialSelectors.getFacebookDescription( state ),
		descriptionFallback: "Modify your Facebook description by editing it right here...",
		title: socialSelectors.getFacebookTitle( state ),
		titleFallback: getTitleFallback( state ),
		imageWarnings: data.warnings,
		image,
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

// Export default connect( mapStateToProps, mapDispatchToProps )( FacebookWrapper );

export default compose( [
	withSelect( select => {
		const {
			getFacebookDescription,
			getFacebookTitle,
			getFacebookData,
			getImageFallback,
			getRecommendedReplaceVars,
			getReplaceVars,
		} = select( "yoast-seo/editor" );

		const data = getFacebookData();
		const image = data.image;
		image.fallbackUrl = getImageFallback();
		return {
			image,
			recommendedReplacementVariables: getRecommendedReplaceVars(),
			replacementVariables: getReplaceVars(),
			description: getFacebookDescription(),
			descriptionFallback: "Modify your Facebook description by editing it right here...",
			title: getFacebookTitle(),
			titleFallback: getTitleFallback(),
			imageWarnings: data.warnings,
		};
	} ),

	withDispatch( dispatch => {
		const {
			setSocialPreviewTitle,
			setSocialPreviewDescription,
			setSocialPreviewImage,
		} = dispatch( "yoast-seo/editor" );

		return {
			onSelectImageClick: () => {
				media.open();
			},
			onRemoveImageClick: () => {
				imageUrlInput.value = null;
				imageIdInput.value = null;
				const image = {
					bytes: null,
					type: null,
					height: null,
					width: null,
					url: null,
					id: null,
				};
				setSocialPreviewImage( image, "facebook" );
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
