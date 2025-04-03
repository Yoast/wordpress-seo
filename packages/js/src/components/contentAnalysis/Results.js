import { ContentAnalysis } from "@yoast/analysis-report";
import { IconButtonToggle } from "@yoast/components";
import { Badge } from "@yoast/ui-library";
import { LockClosedIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import { Component, Fragment } from "@wordpress/element";
import { doAction } from "@wordpress/hooks";

import { isUndefined } from "lodash";
import PropTypes from "prop-types";
import { Paper } from "yoastseo";

import mapResults from "./mapResults";
import { ModalSmallContainer } from "../modals/Container";
import Modal, { defaultModalClassName } from "../modals/Modal";
import PremiumSEOAnalysisUpsell from "../modals/PremiumSEOAnalysisUpsell";

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
		this.handleResultsChange   = this.handleResultsChange.bind( this );
		this.renderHighlightingUpsell = this.renderHighlightingUpsell.bind( this );
		this.createMarkButton = this.createMarkButton.bind( this );
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
	 * Factory method which creates a new instance of the default mark button.
	 *
	 * @param {string} ariaLabel 	The button aria-label.
	 * @param {string} id 			The button id.
	 * @param {string} className 	The button class name.
	 * @param {string} status 		Status of the buttons. Supports: "enabled", "disabled", "hidden".
	 * @param {function} onClick 	Onclick handler.
	 * @param {boolean} isPressed 	Whether the button is in a pressed state.
	 *
	 * @returns {JSX.Element} A new mark button.
	 */
	createMarkButton( {
		ariaLabel,
		id,
		className,
		status,
		onClick,
		isPressed,
	} ) {
		return <Fragment>
			<IconButtonToggle
				marksButtonStatus={ status }
				className={ className }
				onClick={ onClick }
				id={ id }
				icon="eye"
				pressed={ isPressed }
				ariaLabel={ ariaLabel }
			/>
			{ this.props.shouldUpsellHighlighting &&
				<div className="yst-root">
					<Badge className="yst-absolute yst-px-[3px] yst-py-[3px] yst--end-[6.5px] yst--top-[6.5px]" size="small" variant="upsell">
						<LockClosedIcon className="yst-w-2.5 yst-h-2.5 yst-shrink-0" role="img" aria-hidden={ true } focusable={ false } />
					</Badge>
				</div>
			}
		</Fragment>;
	}

	/**
	 * Deactivates the marker from the page.
	 * @returns {void}
	 */
	deactivateMarker() {
		this.props.setActiveMarker( null );
		this.props.setMarkerPauseStatus( false );
		this.removeMarkers();
	}

	/**
	 * Activates the marker from the page.
	 *
	 * @param {string}      id         A unique string representing the result.
	 * @param {Function}    marker     The marker function, which returns the marks for the current paper.
	 * @returns {void}
	 */
	activateMarker( id, marker ) {
		this.props.setActiveMarker( id );
		marker();
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

		// If AI Fixes button is active while the Mark button is clicked, set the active AI Fixes button ID to null.
		if ( this.props.activeAIFixesButton ) {
			this.props.setActiveAIFixesButton( null );
		}

		// If marker button is clicked while active, disable markers.
		if ( markerId === this.props.activeMarker ) {
			this.deactivateMarker();
		} else {
			this.activateMarker( markerId, marker );
		}
	}

	/**
	 * Updates or resets the marking on result change.
	 *
	 * @param {string}      id         A unique string representing the result, which is the same as the assessment id the result is coming from.
	 * @param {Function}    marker     The marker function, which returns the marks for the current paper.
	 * @param {boolean}     hasMarks   Whether the result has marks or not.
	 *
	 * @returns {void}
	 */
	handleResultsChange( id, marker, hasMarks ) {
		// To see a difference between keyphrases: Prepend the keyword key when applicable.
		const markerId = this.props.keywordKey.length > 0 ? `${this.props.keywordKey}:${id}` : id;

		if ( markerId === this.props.activeMarker  ) {
			if ( ! hasMarks ) {
				this.deactivateMarker();
			} else if ( ! isUndefined( marker ) ) {
				this.activateMarker( markerId, marker );
			}
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
			: "yoast-keyword-input-" + keywordKey + "-" + inputFieldLocation;

		const element = document.getElementById( elementID );
		element.focus();
		element.scrollIntoView( {
			behavior: "auto",
			block: "center",
			inline: "center",
		} );
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
		} else if ( id === "titleWidth" || id === "keyphraseInSEOTitle" ) {
			inputField = "title";
		} else {
			inputField = "slug";
		}

		const element = document.getElementById( "yoast-google-preview-" + inputField + "-" + inputFieldLocation );
		element.focus();
		element.scrollIntoView( {
			behavior: "auto",
			block: "center",
			inline: "center",
		} );
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
		const inputFieldLocation = this.props.location;

		if ( id === "functionWordsInKeyphrase" || id === "keyphraseLength" ) {
			this.focusOnKeyphraseField( inputFieldLocation );
			return;
		}

		/*
		 * For all the other assessments that have an edit button, we need to jump to the relevant Google preview fields.
		 * (metadescription, slug, or title). If the user is in the sidebar, these are accessed through a modal. So if the
		 * inputFieldLocation string is 'sidebar' it should now be changed to 'modal'.
		 */
		if ( [ "metaDescriptionKeyword", "metaDescriptionLength", "titleWidth", "keyphraseInSEOTitle", "slugKeyword" ].includes( id ) ) {
			this.handleGooglePreviewFocus( inputFieldLocation, id );
		}

		doAction( "yoast.focus.input", id );
	}

	/**
	 * Handles focus on Google Preview elements, when an edit button is clicked.
	 *
	 * @param {string} inputFieldLocation The location of the input field.
	 * @param {string} id The id of the input field.
	 *
	 * @returns {void}
	 */
	handleGooglePreviewFocus( inputFieldLocation, id ) {
		if ( inputFieldLocation === "sidebar" ) {
			// Open the modal.
			document.getElementById( "yoast-search-appearance-modal-open-button" ).click();
			// Wait for the input field elements to become available, then focus on the relevant field.
			setTimeout( () => this.focusOnGooglePreviewField( id, "modal" ), 500 );
		} else {
			const googlePreviewCollapsible = document.getElementById( "yoast-snippet-editor-metabox" );
			// Check if the collapsible is closed before clicking on it.
			if ( googlePreviewCollapsible && googlePreviewCollapsible.getAttribute( "aria-expanded" ) === "false" ) {
				// If it is closed, click on it to open it, and wait a bit before focusing on the edit field.
				googlePreviewCollapsible.click();
				setTimeout( () => this.focusOnGooglePreviewField( id, inputFieldLocation ), 100 );
			} else {
				// Collapsible already open, we can click on the field directly.
				this.focusOnGooglePreviewField( id, inputFieldLocation );
			}
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
	 * Renders the modal for the highlighting upsell.
	 *
	 * @param {boolean} isOpen Whether the modal should be opened.
	 * @param {function} closeModal A callback function invoked when the modal is closed.
	 * @returns {boolean|wp.Element} The modal for the highlighting upsell element, or false if the modal is closed.
	 */
	renderHighlightingUpsell( isOpen, closeModal ) {
		const upsellDescription = __(
			"Highlight areas of improvement in your text, no more searching for a needle in a haystack, straight to optimizing! Now also in Elementor!",
			"wordpress-seo" );

		return isOpen && (
			<Modal
				title={ __( "Unlock Premium SEO analysis", "wordpress-seo" ) }
				onRequestClose={ closeModal }
				additionalClassName=""
				className={ `${ defaultModalClassName } yoast-gutenberg-modal__box yoast-gutenberg-modal__no-padding` }
				id="yoast-premium-seo-analysis-highlighting-modal"
				shouldCloseOnClickOutside={ true }
			>
				<ModalSmallContainer>
					<PremiumSEOAnalysisUpsell buyLink={ this.props.highlightingUpsellLink } description={ upsellDescription } />
				</ModalSmallContainer>
			</Modal>
		);
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

		const { upsellResults, resultCategoryLabels } = this.props;

		const defaultLabels = {
			errors: __( "Errors", "wordpress-seo" ),
			problems: __( "Problems", "wordpress-seo" ),
			improvements: __( "Improvements", "wordpress-seo" ),
			considerations: __( "Considerations", "wordpress-seo" ),
			goodResults: __( "Good results", "wordpress-seo" ),
		};

		const labels = Object.assign( defaultLabels, resultCategoryLabels );

		let marksButtonStatus = this.props.marksButtonStatus;
		// If the marks are enabled, but we are also parsing shortcodes, disable the markers.
		if ( marksButtonStatus === "enabled" && this.props.shortcodesForParsing.length > 0 ) {
			marksButtonStatus = "disabled";
		}

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
					marksButtonStatus={ marksButtonStatus }
					headingLevel={ 3 }
					keywordKey={ this.props.keywordKey }
					isPremium={ this.props.isPremium }
					resultCategoryLabels={ labels }
					onResultChange={ this.handleResultsChange }
					shouldUpsellHighlighting={ this.props.shouldUpsellHighlighting }
					renderAIFixesButton={ this.props.renderAIFixesButton }
					renderHighlightingUpsell={ this.renderHighlightingUpsell }
					markButtonFactory={ this.createMarkButton }
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
	marksButtonStatus: PropTypes.oneOf( [ "enabled", "disabled", "hidden" ] ),
	setActiveMarker: PropTypes.func.isRequired,
	setMarkerPauseStatus: PropTypes.func.isRequired,
	setActiveAIFixesButton: PropTypes.func.isRequired,
	activeMarker: PropTypes.string,
	activeAIFixesButton: PropTypes.string,
	keywordKey: PropTypes.string,
	location: PropTypes.string,
	isPremium: PropTypes.bool,
	resultCategoryLabels: PropTypes.shape( {
		errors: PropTypes.string,
		problems: PropTypes.string,
		improvements: PropTypes.string,
		considerations: PropTypes.string,
		goodResults: PropTypes.string,
	} ),
	shortcodesForParsing: PropTypes.array,
	shouldUpsellHighlighting: PropTypes.bool,
	highlightingUpsellLink: PropTypes.string,
	renderAIFixesButton: PropTypes.func,
};

Results.defaultProps = {
	results: null,
	upsellResults: [],
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
	editButtonClassName: "",
	activeMarker: null,
	activeAIFixesButton: null,
	keywordKey: "",
	location: "",
	isPremium: false,
	resultCategoryLabels: {},
	shortcodesForParsing: [],
	shouldUpsellHighlighting: false,
	highlightingUpsellLink: "",
	renderAIFixesButton: () => {},
};

export default Results;
