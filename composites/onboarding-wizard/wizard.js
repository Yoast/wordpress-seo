import React from "react";
import Step from "./step";
import ProgressIndicator from "./progressIndicator";
import postJSON from "./helpers/postJSON";

/**
 * The onboarding Wizard class.
 */
class Wizard extends React.Component {

	/**
	 * Initialize the steps and set the current stepId to the first step in the array
	 *
	 * @param {Object} props The values to work with.
	 */
	constructor( props ) {
		super( props );

		this.stepCount = Object.keys( this.props.steps ).length;
		this.state = {
			isLoading: false,
			steps: this.parseSteps( this.props.steps ),
			currentStepId: this.getFirstStep( props.steps ),
		};
	}

	/**
	 * Sets the previous and next stepId for each step.
	 *
	 * @param {Object} steps The object containing the steps.
	 *
	 * @returns {Object} The steps with added previous and next step.
	 */
	parseSteps( steps ) {
		let stepKeyNames = Object.keys( steps );

		// Only add previous and next if there is more than one step.
		if ( stepKeyNames.length < 2 ) {
			return steps;
		}

		let stepKeyNamesLength = stepKeyNames.length;

		// Loop through the steps to set each next and/or previous step.
		for ( let stepIndex = 0; stepIndex < stepKeyNamesLength; stepIndex++ ) {
			let stepKeyName = stepKeyNames[ stepIndex ];

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
		let fields = {};

		fieldsToGet.forEach( ( fieldName ) => {
			if ( this.props.fields[ fieldName ] ) {
				fields[ fieldName ] = this.props.fields[ fieldName ];
			}
		}
		);

		return fields;
	}

	/**
	 * Sends the options for the current step via POST request to the back-end and sets the state to the target step
	 * when successful.
	 *
	 * @param {step} step The step to render after the current state is stored.
	 *
	 * @returns {void}
	 */
	postStep( step ) {
		if ( ! step ) {
			return;
		}

		this.setState( { isLoading: true } );

		postJSON(
			this.props.endpoint,
			this.getFieldsAsObject()
		)
		.then( this.handleSuccessful.bind( this, step ) )
		.catch( this.handleFailure.bind( this ) );
	}

	/**
	 * Returns the fields as an JSON object.
	 *
	 * @returns {Object} JSON fields object.
	 */
	getFieldsAsObject() {
		return JSON.stringify(
			this.refs.step.state.fieldValues[ this.state.currentStepId ]
		);
	}

	/**
	 * Gets the first step from the step object.
	 *
	 * @param {Object} steps The object containing the steps.
	 *
	 * @returns {Object}  The first step object
	 */
	getFirstStep( steps ) {
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
	}

	/**
	 * When the request is handled incorrect.
	 *
	 * @returns {void}
	 */
	handleFailure() {
		this.setState( {
			isLoading: false,
		} );
	}

	/**
	 * Updates the state to the next stepId in the wizard.
	 *
	 * @returns {void}
	 */
	setNextStep() {
		let currentStep = this.getCurrentStep();

		this.postStep( currentStep.next );
	}

	/**
	 * Updates the state to the previous stepId in the wizard.
	 *
	 * @returns {void}
	 */
	setPreviousStep() {
		let currentStep = this.getCurrentStep();

		this.postStep( currentStep.previous );
	}

	/**
	 * Gets the current step from the steps.
	 *
	 * @returns {Object} The current step.
	 */
	getCurrentStep() {
		return this.state.steps[ this.state.currentStepId ];
	}

	/**
	 * Gets the index number for a step from the array with step objects.
	 *
	 * @returns {int} The step number when found, or 0 when the step is not found.
	 */
	getCurrentStepNumber() {
		let currentStep = this.state.currentStepId;
		let steps = Object.keys( this.state.steps );

		let stepNumber = steps.indexOf( currentStep );

		if ( stepNumber > -1 ) {
			return stepNumber + 1;
		}

		return 0;
	}

	/**
	 * Renders the wizard.
	 *
	 * @returns {JSX} The rendered step in the wizard.
	 */
	render() {
		let step = this.getCurrentStep();
		let hideNextButton = ! step.next;
		let hidePreviousButton = ! step.previous;

		return (
			<div className="yoast-wizard-container">
				<div className="yoast-wizard">
					<ProgressIndicator totalSteps={this.stepCount} currentStepNumber={this.getCurrentStepNumber()}/>
					<Step ref="step" currentStep={this.state.currentStepId} title={step.title} fields={step.fields}/>
					{hidePreviousButton ? "" : <button onClick={this.setPreviousStep.bind( this )}>Previous</button>}
					{hideNextButton ? "" : <button onClick={this.setNextStep.bind( this )}>Next</button>}
				</div>
				{( this.state.isLoading ) ? <div className="yoast-wizard-overlay">Saving..</div> : ""}
			</div>
		);
	}
}

Wizard.propTypes = {
	endpoint: React.PropTypes.string.isRequired,
	steps: React.PropTypes.object.isRequired,
	currentStepId: React.PropTypes.string,
	fields: React.PropTypes.object,
};

Wizard.defaultProps = {
	steps: [],
	fields: React.PropTypes.object,
};

export default Wizard;
