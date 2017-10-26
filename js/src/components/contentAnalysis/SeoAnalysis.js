import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class SeoAnalysis extends React.Component {
	render() {
		console.log( "Rendering SeoAnalysis", this.props.results );
		return <h1>Seo Analysis</h1>;
	}
}

SeoAnalysis.propTypes = {
	results: PropTypes.array,
};

/**
 * Map redux state to SeoAnalysis props.
 *
 * @param {Object} state The redux state.
 *
 * @returns {Object} Props that should be passed to SeoAnalysis.
 */
function mapStateToProps( state ) {
	if( state.activeKeyword ) {
		return {
			results: state.analysis.seo[ state.activeKeyword ],
		};
	}
	return { results: null };
}

export default connect( mapStateToProps )( SeoAnalysis );
