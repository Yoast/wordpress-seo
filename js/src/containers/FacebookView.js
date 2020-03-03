/* External dependencies */
import { connect } from "react-redux";
import { actions } from "@yoast/social-metadata-forms";
import { debounce } from "lodash";

/* Internal dependencies */
import FacebookView from "../components/FacebookView";
import { socialSelectors }  from "../redux/selectors/socialSelectors";

const {
	setSocialPreviewTitle,
	setSocialPreviewDescription,
	setSocialPreviewImage,
} = actions;

/**
 * Maps the state to props.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The props for the FacebookView component.
 */
function mapStateToProps( state ) {
	return {
		recommendedReplacementVariables: state.settings.snippetEditor.recommendedReplacementVariables,
		replacementVariables: state.snippetEditor.replacementVariables,
		description: socialSelectors.getFacebookDescription( state ),
		title: socialSelectors.getFacebookTitle( state ),
		image: state.socialReducer.facebook.image,
		imageWarnings: state.socialReducer.facebook.warnings,
	};
}

const media = window.wp.media();

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
	const image = {
		bytes: filesizeInBytes,
		type: subtype,
		height: height,
		width: width,
		url: url,
		id: id,
	};
	window.wp.data.dispatch( "yoast-seo/editor" ).setSocialPreviewImage( image, "facebook" );
} );

/**
 * Maps the dispatch to props.
 *
 * @param {function} dispatch The dispatch function.
 *
 * @returns {Object} The dispatch props.
 */
function mapDispatchToProps( dispatch ) {
	return {
		onSelectImageClick: () => {
			media.open();
		},
		onRemoveImageClick: () => {
			// Set the image object back to default.
			const image = {
				bytes: null,
				type: null,
				height: null,
				width: null,
				url: null,
				id: null,
			};
			dispatch( setSocialPreviewImage( image, "facebook" ) );
		},
		onDescriptionChange: ( description ) => {
			dispatch( setSocialPreviewDescription( description, "facebook" ) );
		},
		onTitleChange: ( title ) => {
			dispatch( setSocialPreviewTitle( title, "facebook" ) );
		},
	};
}

const ContainerCreator = connect( mapStateToProps, mapDispatchToProps );

export const FacebookViewContainer = ContainerCreator( FacebookView );
