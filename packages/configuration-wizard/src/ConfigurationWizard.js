/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import CloseIcon from "material-ui/svg-icons/navigation/close";
import isUndefined from "lodash/isUndefined";
import interpolateComponents from "interpolate-components";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { sendRequest, makeOutboundLink } from "@yoast/helpers";

/* Internal dependencies */
import muiTheme from "./yoast-theme";
import StepIndicator from "./StepIndicator";
import LoadingIndicator from "./LoadingIndicator";
import Header from "./Header";
import Step from "./Step";

const BugReportLink = makeOutboundLink();

/**
 * The ConfigurationWizard class.
 */
class ConfigurationWizard extends React.Component {
	/**
	 * Initialize the steps and set the current stepId to the first step in the array
	 *
	 * @param {Object} props The values to work with.
	 */
	constructor( props ) {
		super( props );

		this.stepCount = Object.keys( this.props.steps ).length;
		this.clickedButton = {};
		this.state = {
			isLoading: false,
			steps: this.parseSteps( this.props.steps ),
			currentStepId: this.getFirstStep( props.steps ),
			errorMessage: "",
		};

		this.postStep = this.postStep.bind( this );
		this.setNextStep = this.setNextStep.bind( this );
		this.setPreviousStep = this.setPreviousStep.bind( this );
		this.listenToHashChange = this.listenToHashChange.bind( this );
		window.addEventListener( "hashchange", this.listenToHashChange, false );
	}

	/**
	 * Remove the prepended hashtag from the passed string.
	 *
	 * @param {string} stringWithHashtag The string to remove the prepended hashtag from.
	 *
	 * @returns {string} The string without prepended hashtag.
	 */
	removePrependedHashtag( stringWithHashtag ) {
		return stringWithHashtag.substring( 1 );
	}

	/**
	 * Sets the previous and next stepId for each step.
	 *
	 * @param {Object} steps The object containing the steps.
	 *
	 * @returns {Object} The steps with added previous and next step.
	 */
	parseSteps( steps ) {
		const stepKeyNames = Object.keys( steps );

		// Only add previous and next if there is more than one step.
		if ( stepKeyNames.length < 2 ) {
			return steps;
		}

		const stepKeyNamesLength = stepKeyNames.length;

		// Loop through the steps to set each next and/or previous step.
		for ( let stepIndex = 0; stepIndex < stepKeyNamesLength; stepIndex++ ) {
			const stepKeyName = stepKeyNames[ stepIndex ];

			if ( stepIndex > 0 ) {
				steps[ stepKeyName ].previous = stepKeyNames[ stepIndex - 1 ];
			}

			if ( stepIndex > -1 && stepIndex < stepKeyNamesLength - 1 ) {
				steps[ stepKeyName ].next = stepKeyNames[ stepIndex + 1 ];
			}

			steps[ stepKeyName ].fields = this.getFields( steps[ stepKeyName ].fields );
		}

		return steps;
	}

	/**
	 * Gets fields from the properties.
	 *
	 * @param {Array} fieldsToGet The array with the fields to get from the properties.
	 *
	 * @returns {Object} The fields from the properties, based on the array passed in the arguments.
	 */
	getFields( fieldsToGet = [] ) {
		const fields = {};

		fieldsToGet.forEach(
			( fieldName ) => {
				if ( this.props.fields[ fieldName ] ) {
					fields[ fieldName ] = this.props.fields[ fieldName ];
				}
			}
		);

		return fields;
	}

	/**
	 * Sends the options for the current step via POST request to the back-end
	 * and sets the state to the target step when successful.
	 *
	 * @param {step} step The step to render after the current state is stored.
	 * @param {SyntheticEvent} evt The click even that triggered this post step.
	 *
	 * @returns {void}
	 */
	postStep( step, evt ) {
		if ( ! step ) {
			return;
		}

		this.setState( { isLoading: true, errorMessage: "" } );
		this.clickedButton = evt.currentTarget;

		sendRequest(
			this.props.endpoint.url,
			{
				data: this.step.state.fieldValues[ this.state.currentStepId ],
				headers: this.props.endpoint.headers,
			} )
			.then( this.handleSuccessful.bind( this, step ) )
			.catch( this.handleFailure.bind( this ) );
	}

	/**
	 * Gets the first step from the step object.
	 *
	 * @param {Object} steps The object containing the steps.
	 *
	 * @returns {Object}  The first step object
	 */
	getFirstStep( steps ) {
		// Use the hash from the url without the hashtag.
		const firstStep = this.removePrependedHashtag( window.location.hash );

		if ( firstStep !== "" ) {
			return firstStep;
		}
		// When window.location doesn't have a hash, use the first step of the wizard as default.
		return Object.getOwnPropertyNames( steps )[ 0 ];
	}

	/**
	 * When the request is handled successfully.
	 *
	 * @param {string} step The next step to render.
	 *
	 * @returns {void}
	 */
	handleSuccessful( step ) {
		this.setState( {
			isLoading: false,
			currentStepId: step,
		} );

		// Set focus on the main content but not when clicking the step buttons.
		if ( -1 === this.clickedButton.className.indexOf( "step" ) ) {
			this.step.stepContainer.focus();
		}
	}

	/**
	 * When the request is handled incorrect.
	 *
	 * @returns {void}
	 */
	handleFailure() {
		this.setState( {
			isLoading: false,
			errorMessage: interpolateComponents( {
				/** Translators: {{link}} resolves to the link opening tag to yoa.st/bugreport, {{/link}} resolves to the link closing tag. **/
				mixedString: __(
					"A problem occurred when saving the current step, {{link}}please file a bug report{{/link}} " +
					"describing what step you are on and which changes you want to make (if any).",
					"yoast-components"
				),
				// The anchor does have content (see mixedString above).
				// eslint-disable-next-line jsx-a11y/anchor-has-content
				components: { link: <BugReportLink href="https://yoa.st/bugreport" /> },
			} ),
		} );
	}

	/**
	 * Updates the state to the next stepId in the wizard.
	 *
	 * @param {SyntheticEvent} evt The click event that triggered the next step call.
	 * @returns {void}
	 */
	setNextStep( evt ) {
		const currentStep = this.getCurrentStep();

		this.postStep( currentStep.next, evt );
	}

	/**
	 * Updates the state to the previous stepId in the wizard.
	 *
	 * @param {SyntheticEvent} evt The click event that triggered the next step call.
	 * @returns {void}
	 */
	setPreviousStep( evt ) {
		const currentStep = this.getCurrentStep();

		this.postStep( currentStep.previous, evt );
	}

	/**
	 * Gets the current step from the steps.
	 *
	 * @returns {Object} The current step.
	 */
	getCurrentStep() {
		const steps = this.state.steps;
		const currentStep = steps[ this.state.currentStepId ];

		// If the currentStep is undefined because the stepId is invalid, return the first step of the Wizard.
		if ( isUndefined( currentStep ) ) {
			const firstStepId = Object.keys( steps )[ 0 ];
			this.setState( { currentStepId: firstStepId } );
			return steps[ firstStepId ];
		}
		return currentStep;
	}

	/**
	 * Gets the index number for a step from the array with step objects.
	 *
	 * @returns {int} The step number when found, or 0 when the step is not found.
	 */
	getCurrentStepNumber() {
		const currentStep = this.state.currentStepId;
		const steps = Object.keys( this.state.steps );

		const stepNumber = steps.indexOf( currentStep );

		if ( stepNumber > -1 ) {
			return stepNumber + 1;
		}

		return 0;
	}

	/**
	 * Creates a next or previous button to navigate through the steps.
	 *
	 * @param {string} type A next or previous button.
	 * @param {Object} attributes The attributes for the button component.
	 * @param {string} currentStep The current step object in the wizard.
	 * @param {string} className The class name for the button.
	 *
	 * @returns {ReactElement} Returns a button component depending on an existing previous/next step.
	 */
	getNavigationbutton( type, attributes, currentStep, className ) {
		let hideButton = false;

		if ( type === "next" && ! currentStep.next ) {
			attributes.label = __( "Close", "yoast-components" );
			attributes[ "aria-label" ] = __( "Close the Wizard", "yoast-components" );
			attributes.icon = <CloseIcon viewBox="0 0 28 28" />;
			attributes.onClick = () => {
				if ( this.props.finishUrl !== "" ) {
					window.location.href = this.props.finishUrl;

					return;
				}

				history.go( -1 );
			};
		}
		if ( type === "previous" && ! currentStep.previous ) {
			hideButton = true;
		}

		return ( hideButton ) ? "" : <button type="button" className={ className } onClick={ attributes.onClick }>{ attributes.label }</button>;
	}

	/**
	 * Updates the currentStepId in the state when the hash in the URL changes.
	 *
	 * @returns {void}
	 */
	listenToHashChange() {
		// Because the hash starts with a hashtag, we need to do remove the hastag before using it.
		this.setState( { currentStepId: this.removePrependedHashtag( window.location.hash ) } );
	}

	/**
	 * When the currentStepId in the state changes, return a snapshot with the new currentStepId.
	 *
	 * @param {Object} prevProps The previous props.
	 * @param {Object} prevState The previous state.
	 *
	 * @returns {string|null} The currentStepId from after the update.
	 */
	getSnapshotBeforeUpdate( prevProps, prevState ) {
		const currentStepIdAfterUpdate = this.state.currentStepId;
		// If there is no change in the currentStepId in the state, do nothing.
		if ( prevState.currentStepId === currentStepIdAfterUpdate ) {
			return null;
		}

		// If the new currentStepId is the same as the current location hash, do nothing.
		if ( this.removePrependedHashtag( window.location.hash ) === currentStepIdAfterUpdate ) {
			return null;
		}

		return currentStepIdAfterUpdate;
	}

	/**
	 * Push the new hash to the history.
	 *
	 * Only do this when the new hash differs from the current hash. If we wouldn't check against
	 * the current hash, it would lead to double hashes when using the browser's previous and next
	 * buttons.
	 *
	 * @param {Object} prevProps The previous props.
	 * @param {Object} prevState The previous state.
	 * @param {string} snapshot The currentStepId from after the update.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps, prevState, snapshot ) {
		if ( snapshot !== null ) {
			window.history.pushState( null, null, "#" + snapshot );
		}
	}


	/**
	 * Renders the wizard.
	 *
	 * @returns {JSX.Element} The rendered step in the wizard.
	 */
	render() {
		const step = this.getCurrentStep();

		let navigation = "";
		if ( ! step.hideNavigation ) {
			const previousButton = this.getNavigationbutton( "previous", {
				label: "« " + __( "Previous", "yoast-components" ),
				onClick: this.setPreviousStep,
			}, step, "yoast-wizard--button yoast-wizard--button__previous" );

			const nextButton = this.getNavigationbutton( "next", {
				label: __( "Next", "yoast-components" ) + " »",
				onClick: this.setNextStep,
			}, step, "yoast-wizard--button yoast-wizard--button__next" );

			navigation = <div className="yoast-wizard--navigation">{ previousButton }{ nextButton }</div>;
		}

		const headerTitle = sprintf(
			/* Translators: %s expands to "Yoast SEO for WordPress". */
			__( "%s installation wizard", "yoast-components" ),
			"Yoast SEO for WordPress"
		);

		return (
			<MuiThemeProvider muiTheme={ muiTheme }>
				<div className="yoast-wizard-body">
					<Header headerTitle={ headerTitle } icon={ this.props.headerIcon } />
					<StepIndicator
						steps={ this.props.steps } stepIndex={ this.getCurrentStepNumber() - 1 }
						onClick={ this.postStep }
					/>
					<main className="yoast-wizard-container">
						<div className="yoast-wizard">
							{ this.renderErrorMessage() }
							<Step
								ref={ ref => {
									this.step = ref;
								} }
								currentStep={ this.state.currentStepId }
								title={ step.title }
								fields={ step.fields }
								customComponents={ this.props.customComponents }
								nextStep={ this.setNextStep }
								previousStep={ this.setPreviousStep }
								fullWidth={ step.fullWidth }
							/>
							{ navigation }
						</div>
						{ ( this.state.isLoading ) ? <div className="yoast-wizard-overlay"><LoadingIndicator /></div> : "" }
					</main>
				</div>
			</MuiThemeProvider>
		);
	}

	/**
	 * Renders the error message
	 *
	 * @returns {JSX.Element|string} The rendered output.
	 */
	renderErrorMessage() {
		if ( this.state.errorMessage === "" ) {
			return "";
		}

		return <div className="yoast-wizard-notice yoast-wizard-notice__error">{ this.state.errorMessage }</div>;
	}
}

ConfigurationWizard.propTypes = {
	endpoint: PropTypes.object.isRequired,
	steps: PropTypes.object.isRequired,
	fields: PropTypes.object.isRequired,
	customComponents: PropTypes.object,
	finishUrl: PropTypes.string,
	headerIcon: PropTypes.func,
};

ConfigurationWizard.defaultProps = {
	customComponents: {},
	finishUrl: "",
	headerIcon: null,
};

export default ConfigurationWizard;
