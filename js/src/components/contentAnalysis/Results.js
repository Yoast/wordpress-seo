import React from "react";
import PropTypes from "prop-types";

import mapResults from "./mapResults";
import ContentAnalysis from "yoast-components/composites/Plugin/ContentAnalysis/components/ContentAnalysis";

class Results extends React.Component {
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
			/>
		);
	}
}

Results.propTypes = {
	results: PropTypes.array,
};

export default Results;
