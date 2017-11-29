import React from "react";
import PropTypes from "prop-types";

import mapResults from "./mapResults";
import ContentAnalysis from "yoast-components/composites/Plugin/ContentAnalysis/components/ContentAnalysis";

/**
 * Wrapper to provide functionality to the ContentAnalysis component.
 */
class Results extends React.Component {
	/**
	 * Handles a click on a marker button, to mark the text in the editor.
	 *
	 * @param {string} id Result id, empty if a marker is deselected.
	 * @param {object} marker The marker function.
	 *
	 * @returns {void}
	 */
	handleMarkButtonClick( id, marker ) {
		if ( id ) {
			marker();
		} else {
			this.removeMarkers();
		}
	}

	/**
	 * Removes all markers.
	 *
	 * @returns {void}
	 */
	removeMarkers() {
		const assessor = window.YoastSEO.app.contentAssessor;
		const marker = assessor.getSpecificMarker();
		marker( assessor.getPaper(), [] );
	}

	/**
	 * Renders the Results component.
	 *
	 * @returns {ReactElement} The react element.
	 */
	render() {
		const mappedResults = mapResults( this.props.results );
		const {
			errorsResults,
			improvementsResults,
			goodResults,
			considerationsResults,
			problemsResults,
		} = mappedResults;
		return(
			<ContentAnalysis
				errorsResults={ errorsResults }
				problemsResults={ problemsResults }
				improvementsResults={ improvementsResults }
				considerationsResults={ considerationsResults }
				goodResults={ goodResults }
				changeLanguageLink={ this.props.changeLanguageLink }
				language={ this.props.language }
				showLanguageNotice={ this.props.showLanguageNotice }
				canChangeLanguage={ this.props.canChangeLanguage }
				onMarkButtonClick={ this.handleMarkButtonClick.bind( this ) } />
		);
	}
}

Results.propTypes = {
	results: PropTypes.array,
	language: PropTypes.string,
	changeLanguageLink: PropTypes.string,
	showLanguageNotice: PropTypes.bool.isRequired,
	canChangeLanguage: PropTypes.bool,
};

Results.defaultProps = {
	language: "",
	changeLanguageLink: "#",
	canChangeLanguage: false,
};

export default Results;
