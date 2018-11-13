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
	/**
	 * The component's constructor.
	 *
	 * @param {Object} props The component's props.
	 *
	 * @constructor
	 */
	constructor( props ) {
		super( props );

		this.state = {
			mappedResults: mapResults( this.props.results ),
		};

		this.handleMarkButtonClick = this.handleMarkButtonClick.bind( this );
	}

	/**
	 * If there are new analysis results, map them to their corresponding collapsible
	 * (error, problem, consideration, improvement, good).
	 *
	 * If the results are null, we assume the analysis is still being performed.
	 *
	 * @param {object} prevProps The previous props.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		if ( this.props.results !== null && this.props.results !== prevProps.results ) {
			this.setState( {
				mappedResults: mapResults( this.props.results ),
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
		// If marker button is clicked while active, disable markers.
		if ( id === this.props.activeMarker ) {
			this.props.setActiveMarker( null );
			this.removeMarkers();
		} else {
			this.props.setActiveMarker( id );
			marker();
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
					activeMarker={ this.props.activeMarker }
					onMarkButtonClick={ this.handleMarkButtonClick }
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
	setActiveMarker: PropTypes.func.isRequired,
	activeMarker: PropTypes.string.isRequired,
};

Results.defaultProps = {
	results: null,
	language: "",
	changeLanguageLink: "#",
	canChangeLanguage: false,
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
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
