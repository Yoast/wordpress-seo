import { connect } from "react-redux";
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

export default connect( mapStateToProps, mapDispatchToProps )( CollapsibleCornerstone );
