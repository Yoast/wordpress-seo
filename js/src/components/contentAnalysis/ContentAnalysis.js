import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class ContentAnalysis extends React.Component {
	render() {
		console.log( "Rendering ContentAnalysis", this.props.results );
		return <h1>Content Analysis</h1>;
	}
}

ContentAnalysis.propTypes = {
	results: PropTypes.array,
};

/**
 * Map redux state to ContentAnalysis props.
 *
 * @param {Object} state The redux state.
 *
 * @returns {Object} Props that should be passed to ContentAnalysis.
 */
function mapStateToProps( state ) {
	return {
		results: state.analysis.readability,
	};
}

export default connect( mapStateToProps )( ContentAnalysis );
