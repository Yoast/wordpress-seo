/* External dependencies */
import { connect } from "react-redux";
import { actions } from "@yoast/social-metadata-forms";
import { debounce } from "lodash";

/* Internal dependencies */
import TwitterView from "../components/TwitterView";
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
 * @returns {Object} The props for the TwitterView component.
 */
function mapStateToProps( state ) {
	return {
		recommendedReplacementVariables: state.settings.snippetEditor.recommendedReplacementVariables,
		replacementVariables: state.snippetEditor.replacementVariables,
		description: socialSelectors.getTwitterDescription( state ),
		title: socialSelectors.getTwitterTitle( state ),
		image: state.socialReducer.twitter.image,
		imageWarnings: state.socialReducer.twitter.warnings,
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
		onSelectImageClick: ( image ) => {
			// Open wp image library.
			var wpImage = window.wp.media().open();
			console.log( "wpImage", wpImage );
			// Dispatch SetImage.
		},
		onRemoveImageClick: () => {
			// Set the image object back to default.
		},
		onDescriptionChange: ( description ) => {
			dispatch( setSocialPreviewDescription( description, "twitter" ) );
		},
		onTitleChange: ( title ) => {
			dispatch( setSocialPreviewTitle( title, "twitter" ) );
		},
	};
}

const ContainerCreator = connect( mapStateToProps, mapDispatchToProps );

export const TwitterViewContainer = ContainerCreator( TwitterView );
