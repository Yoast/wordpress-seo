import React from "react";
import PropTypes from "prop-types";

import mapResults from "./mapResults";
import ContentAnalysis from "yoast-components/composites/Plugin/ContentAnalysis/components/ContentAnalysis";

/**
 * Wrapper to provide functionality to the ContentAnalysis component.
 */
class Results extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			analysisIsLoading: false,
			mappedResults: mapResults( this.props.results ),
		};
	}

	componentWillReceiveProps( nextProps ) {
		/*
		 * Check if there are new results.
		 * When the new results are null, we presume we are loading the analysis.
		 * Only update the mappedResults when we have new and non-null results.
		 */
		if ( nextProps.results !== null && nextProps.results !== this.props.results ) {
			this.setState( {
				mappedResults: mapResults( nextProps.results ),
			} );
		}
	}

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
		const { mappedResults } = this.state;
		const {
			errorsResults,
			improvementsResults,
			goodResults,
			considerationsResults,
			problemsResults,
		} = mappedResults;
		return (
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
				onMarkButtonClick={ this.handleMarkButtonClick.bind( this ) }
				marksButtonClassName={ this.props.marksButtonClassName }
				marksButtonStatus={ this.props.marksButtonStatus }
			/>
		);
	}
}

Results.propTypes = {
	results: PropTypes.array,
	language: PropTypes.string,
	changeLanguageLink: PropTypes.string,
	showLanguageNotice: PropTypes.bool.isRequired,
	canChangeLanguage: PropTypes.bool,
	marksButtonClassName: PropTypes.string,
	marksButtonStatus: PropTypes.string,
};

Results.defaultProps = {
	language: "",
	changeLanguageLink: "#",
	canChangeLanguage: false,
	marksButtonStatus: "enabled",
};

export default Results;
