import PropTypes from "prop-types";
import { ContentAnalysis } from "@yoast/analysis-report";
import { Component, Fragment } from "@wordpress/element";
import { Paper } from "yoastseo";

import mapResults from "./mapResults";

/**
 * Wrapper to provide functionality to the ContentAnalysis component.
 */
class Results extends Component {
	/**
	 * The component's constructor.
	 *
	 * @param {Object} props The component's props.
	 *
	 * @constructor
	 */
	constructor( props ) {
		super( props );

		const results = this.props.results;

		this.state = {
			mappedResults: {},
		};

		if ( results !== null ) {
			this.state = {
				mappedResults: mapResults( results, this.props.keywordKey ),
			};
		}

		this.handleMarkButtonClick = this.handleMarkButtonClick.bind( this );
		this.handleEditButtonClick = this.handleEditButtonClick.bind( this );
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
				mappedResults: mapResults( this.props.results, this.props.keywordKey ),
			} );
		}
	}

	/**
	 * Handles a click on a marker button, to mark the text in the editor.
	 *
	 * @param {string}   id     Result id, empty if a marker is deselected.
	 * @param {Function} marker The marker function.
	 *
	 * @returns {void}
	 */
	handleMarkButtonClick( id, marker ) {
		// To see a difference between keyphrases: Prepend the keyword key when applicable.
		const markerId = this.props.keywordKey.length > 0 ? `${this.props.keywordKey}:${id}` : id;

		// If marker button is clicked while active, disable markers.
		if ( markerId === this.props.activeMarker ) {
			this.props.setActiveMarker( null );
			this.props.setMarkerPauseStatus( false );
			this.removeMarkers();
		} else {
			this.props.setActiveMarker( markerId );
			marker();
		}
	}

	/**
	 * Focuses on a focus or related keyphrase input field.
	 *
	 * @param {string} inputFieldLocation The location of the input field that should be focused on (metabox or sidebar).
	 *
	 * @returns {void}
	 */
	focusOnKeyphraseField( inputFieldLocation ) {
		// The keyword key is used for labelling the related keyphrase(s).
		const keywordKey = this.props.keywordKey;
		const elementID = keywordKey === "" ? "focus-keyword-input-" + inputFieldLocation
			: "yoast-keyword-input-" + keywordKey + "-" +  inputFieldLocation;

		document.getElementById( elementID ).focus();
	}

	/**
     * Focuses on a Google preview input field (meta description, title or slug).
	 *
	 * @param {string}	id     				Result id which determines which input field should be focused on.
	 * @param {string}	inputFieldLocation	The location of the input field that should be focused on (metabox or modal).
	 *
	 * @returns {void}
	 */
	focusOnGooglePreviewField( id, inputFieldLocation ) {
		let inputField;

		if ( id === "metaDescriptionKeyword" || id === "metaDescriptionLength" ) {
			inputField = "description";
		} else if ( id === "titleWidth" ) {
			inputField = "title";
		} else {
			inputField = "slug";
		}

		document.getElementById( "yoast-google-preview-" + inputField + "-" + inputFieldLocation ).focus();
	}

	/**
	 * Handles a click on an edit button to jump to a relevant edit field.
	 *
	 * @param {string}   id     Result id which determines which edit field should be focused on.
	 *
	 * @returns {void}
	 */
	handleEditButtonClick( id ) {
		// Whether the user is in the metabox or sidebar.
		let inputFieldLocation = this.props.location;

		if ( id === "functionWordsInKeyphrase" || id === "keyphraseLength" ) {
			this.focusOnKeyphraseField( inputFieldLocation );
			return;
		}
		/*
		 * For all the other assessments that have an edit button, we need to jump to the relevant Google preview fields.
		 * (metadescription, slug, or title). If the user is in the sidebar, these are accessed through a modal. So if the
		 * inputFieldLocation string is 'sidebar' it should now be changed to 'modal'.
	     */
		if ( inputFieldLocation === "sidebar" ) {
			inputFieldLocation = "modal";
			// Open the modal.
			document.getElementById( "yoast-google-preview-modal-open-button" ).click();
			// Wait for the input field elements to become available, then focus on the relevant field.
			setTimeout( () => this.focusOnGooglePreviewField( id, inputFieldLocation ), 250 );
		} else {
			this.focusOnGooglePreviewField( id, inputFieldLocation );
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
	 * @returns {wp.Element} The React element.
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

		const { upsellResults } = this.props;

		return (
			<Fragment>
				<ContentAnalysis
					errorsResults={ errorsResults }
					problemsResults={ problemsResults }
					upsellResults={ upsellResults }
					improvementsResults={ improvementsResults }
					considerationsResults={ considerationsResults }
					goodResults={ goodResults }
					activeMarker={ this.props.activeMarker }
					onMarkButtonClick={ this.handleMarkButtonClick }
					onEditButtonClick={ this.handleEditButtonClick }
					marksButtonClassName={ this.props.marksButtonClassName }
					editButtonClassName={ this.props.editButtonClassName }
					marksButtonStatus={ this.props.marksButtonStatus }
					headingLevel={ 3 }
					keywordKey={ this.props.keywordKey }
				/>
			</Fragment>
		);
	}
}

Results.propTypes = {
	results: PropTypes.array,
	upsellResults: PropTypes.array,
	marksButtonClassName: PropTypes.string,
	editButtonClassName: PropTypes.string,
	marksButtonStatus: PropTypes.string,
	setActiveMarker: PropTypes.func.isRequired,
	setMarkerPauseStatus: PropTypes.func.isRequired,
	activeMarker: PropTypes.string,
	keywordKey: PropTypes.string,
	location: PropTypes.string,
};

Results.defaultProps = {
	results: null,
	upsellResults: [],
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
	editButtonClassName: "",
	activeMarker: null,
	keywordKey: "",
	location: "",
};

export default Results;
