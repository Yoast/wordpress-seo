import React from "react";
import PropTypes from "prop-types";
import { LanguageNotice, ContentAnalysis } from "yoast-components";
import { Fragment } from "@wordpress/element";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { Paper } from "yoastseo";

import mapResults from "./mapResults";

/**
 * Wrapper to provide functionality to the ContentAnalysis component.
 */
class Results extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
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
		this.props.setActiveMarker( id );

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
		window.YoastSEO.analysis.applyMarks( new Paper( "", {} ), [] );
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
			<Fragment>
				<LanguageNotice
					changeLanguageLink={ this.props.changeLanguageLink }
					language={ this.props.language }
					showLanguageNotice={ this.props.showLanguageNotice }
					canChangeLanguage={ this.props.canChangeLanguage }
				/>
				<ContentAnalysis
					errorsResults={ errorsResults }
					problemsResults={ problemsResults }
					improvementsResults={ improvementsResults }
					considerationsResults={ considerationsResults }
					goodResults={ goodResults }
					onMarkButtonClick={ this.handleMarkButtonClick.bind( this ) }
					marksButtonClassName={ this.props.marksButtonClassName }
					marksButtonStatus={ this.props.marksButtonStatus }
				/>
			</Fragment>
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
	setActiveMartker: PropTypes.func.isRequired,
	activeMarker: PropTypes.string.isRequired,
};

Results.defaultProps = {
	language: "",
	changeLanguageLink: "#",
	canChangeLanguage: false,
	marksButtonStatus: "enabled",
};

export default compose( [
	withSelect( select => {
		const {
			getActiveMarker,
		} = select( "yoast-seo/editor" );

		return {
			activeMarker: getActiveMarker(),
		};
	} ),
	withDispatch( dispatch => {
		const {
			setActiveMarker,
		} = dispatch( "yoast-seo/editor" );

		return {
			setActiveMarker,
		};
	} ),
] )( Results );
