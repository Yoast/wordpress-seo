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

	handleMarkButtonClick( id, marker ) {
		if( id ) {
			marker();
		} else {
			this.removeMarkers();
		}
	}

	removeMarkers() {
		const assessor = window.YoastSEO.app.contentAssessor;
		const marker = assessor.getSpecificMarker();
		marker( assessor.getPaper(), [] );
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
				onMarkButtonClick={ this.handleMarkButtonClick.bind( this ) } />
		);
	}
}

Results.propTypes = {
	results: PropTypes.array,
};

export default Results;
