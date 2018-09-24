// External dependencies.
import React, { Component } from "react";
import PropTypes from "prop-types";

// Internal dependencies.
import scoreToRating from "../../../src/interpreters/scoreToRating";

class Results extends Component {
	/**
	 * Renders the results.
	 *
	 * @returns {ReactElement} The results.
	 */
	render() {
		let results = [ ...this.props.results ];

		results.sort( ( a, b ) => {
			if ( a.score < b.score ) {
				return -1;
			}

			if ( a.score > b.score ) {
				return 1;
			}

			// Value a must be equal to value b
			return 0;
		} );

		return (
			<ul>
				{ results.map( ( result ) => {
					const rating = scoreToRating( result.score );

					const className = "wpseo-score-icon " + rating;

					const hasMarks = result.marks.length !== 0;

					return (
						<li key={ result._identifier } style={ { marginTop: "1em" } }>
							<span className={ className }/>
							<span dangerouslySetInnerHTML={ { __html: result.text } }/>

							<div style={ { clear: "both" } }/>

							{ hasMarks && <button type="button" onClick={ this.props.onMark.bind( null, result._identifier ) }>Mark</button> }
						</li>
					);
				} ) }
			</ul>
		);
	}
}

Results.propTypes = {
	results: PropTypes.array.isRequired,
};

export default Results;
