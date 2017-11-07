import React from "react";
import PropTypes from "prop-types";

import mapResults from "./mapResults";
import ContentAnalysis from "yoast-components/composites/Plugin/ContentAnalysis/components/ContentAnalysis";

class Results extends React.Component {
	constructor( props ) {
		super( props );

		this.registerResults();
	}

	registerResults() {
		if( ! this.props.results ) {
			return;
		}

		this.results = {};

		for( let i = 0; i < this.props.results.length; i++ ) {
			const result = this.props.results[ i ];
			this.results[ result.id ] = result;
		}
	}

	createMark( id, marker ) {
		console.log( "createMark called", id, marker );
	}

	render() {
		const mappedResults = mapResults( this.props.results );
		const {
			errorsResults,
			improvementsResults,
			goodResults,
			considerationsResults,
			problemsResults
		} = mappedResults;
		return(
			<ContentAnalysis
				errorsResults={ errorsResults }
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				considerationsResults={ considerationsResults }
				goodResults={ goodResults }
				changeLanguageLink="#"
				language="English"
				onMarkButtonClick={ this.createMark.bind( this ) } />
		);
	}
}

Results.propTypes = {
	results: PropTypes.array,
};

export default Results;
