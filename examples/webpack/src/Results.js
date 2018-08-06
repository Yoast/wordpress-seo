import React, { Component } from "react";
import scoreToRating from "../../../src/interpreters/scoreToRating";

export default class Results extends Component {
	render() {
		let results = [ ...this.props.results ];

		results.sort( ( a, b ) => {
			if ( a.score < b.score ) {
				return -1;
			}

			if ( a.score > b.score ) {
				return 1;
			}

			// a must be equal to b
			return 0;
		} );

		return <ul>
			{ results.map( ( result ) => {
				const rating = scoreToRating( result.score );

				const className = "wpseo-score-icon " + rating;

				return <li key={ result._identifier } style={ { marginTop: "1em" } }>
					<span className={ className } />
					<span dangerouslySetInnerHTML={ { __html: result.text } } />

					<div style={ { clear: "both" } } />
				</li>
			} ) }
		</ul>
	}
}
