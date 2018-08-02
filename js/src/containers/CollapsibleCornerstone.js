/* External dependencies */
import { connect } from "react-redux";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import { withSelect } from "@wordpress/data";

/* Internal dependencies */
import CollapsibleCornerstone from "../components/CollapsibleCornerstone";
import { toggleCornerstoneContent } from "../redux/actions/cornerstoneContent";

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
		let postTypeName;

		try {
			const postTypeSlug = select( "core/editor" ).getEditedPostAttribute( "type" );
			const postType = select( "core" ).getPostType( postTypeSlug );
			postTypeName = get( postType, [ "labels", "name" ], "NOT YET RECEIVED" );
		} catch ( error ) {
			postTypeName = "COULDN'T GET POST TYPE NAME";
		}

		return {
			postTypeName,
		};

	} ),
] )( CollapsibleCornerstone );
