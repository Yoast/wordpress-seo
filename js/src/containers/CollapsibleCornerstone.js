/* External dependencies */
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import get from "lodash/get";

/* Internal dependencies */
import CollapsibleCornerstone from "../components/CollapsibleCornerstone";
import { toggleCornerstoneContent } from "../redux/actions/cornerstoneContent";

const withSelect = window.wp.data.withSelect;

/**
 * Maps the state to props.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The props for the CollapsibleCornerstone component.
 */
function mapStateToProps( state ) {
	return {
		isCornerstone: state.isCornerstone,
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
		onChange: () => {
			dispatch( toggleCornerstoneContent() );
		},
	};
}

export default flowRight( [
	connect( mapStateToProps, mapDispatchToProps ),
	withSelect( ( select ) => {
		const postTypeSlug = select( "core/editor" ).getEditedPostAttribute( "type" );
		const postType = select( "core" ).getPostType( postTypeSlug );
		const postTypeName = get( postType, [ "labels", "name" ], "NOT YET RECEIVED" );

		return {
			postTypeName,
		};

	} ),
] )( CollapsibleCornerstone );
