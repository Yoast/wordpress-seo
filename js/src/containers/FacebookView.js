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
	setSocialPreviewImageUrl,
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

/**
 * Maps the dispatch to props.
 *
 * @param {function} dispatch The dispatch function.
 *
 * @returns {Object} The dispatch props.
 */
function mapDispatchToProps( dispatch ) {
	return {
		onSelectImageClick: ( imageUrl ) => {
			// Open wp image library.
			const wpImage = window.wp.media().select();
			console.log( "wpImage", wpImage );
			// dispatch( setSocialPreviewImageUrl( imageUrl, "facebook" ) );
		},
		onRemoveImageClick: () => {
			// Set the image object back to default.
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
// export const SecondConnectedComponent = ContainerCreator(Component2);
