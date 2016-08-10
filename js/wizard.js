import React from 'react';
import Step from './step';
import ProgressIndicator from './progressIndicator';
import Components from './components';

import PostJSON from './helpers/postJSON';

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
		super();

		this.props = props;
		this.stepCount = Object.keys(this.props.steps).length;
		this.state = {
			steps: this.parseSteps( props.steps ),
			currentStepId: this.getFirstStep( props.steps ),
		};

		Object.assign( this.props.components, Components );
		Object.assign( this.props.components, props.customComponents );
	}

	/**
	 * Sets the previous and next stepId for each step.
	 *
	 * @param {Object} steps The object containing the steps.
	 *
	 * @return {Object} The steps with added previous and next step.
	 */
	parseSteps( steps ) {
		let stepKeys = Object.keys( steps );

		// Only add previous and next if there is more than one step.
		if ( stepKeys.length < 2 ) {
			return steps;
		}

		let indexOfLastStep = stepKeys.length - 1;

		// Loop through the steps to set each previous step.
		for ( let stepKey in steps ) {
			let stepIndex = stepKeys.indexOf( stepKey );

			if ( stepIndex > 0 ){
				steps[ stepKey ].previous = stepKeys[stepIndex - 1];
			}

			if ( stepIndex > -1 && stepIndex < indexOfLastStep ){
				steps[ stepKey ].next = stepKeys[stepIndex + 1];
			}

			steps[ stepKey ]['fields'] =  this.parseFields( steps[ stepKey ]["fields"] )
		}

		return steps;
	}

	/**
	 * Gets the fields from the props.
	 *
	 * @param {Array} fieldsToGet
	 *
	 * @returns {Object}
	 */
	parseFields( fieldsToGet ) {
		let fields = {};

		fieldsToGet.forEach(
			function( fieldName ) {
				if ( this.props.fields[ fieldName ] ) {
					fields[ fieldName ] = this.props.fields[ fieldName ];
				}
			}
			.bind( this )
		);

		return fields;
	}

	/**
	 * Sends the options for the current step via POST request to the back-end and sets the state to the target step
	 * when successful.
	 *
	 * @param {step} step The step to render after the current state is stored.
	 *
	 * @return {Promise}
	 */
	postStep( step ) {
		if ( ! step ) {
			return;
		}

		this.setSaveState( 'Saving..' );

		PostJSON(
			this.props.endpoint,
			this.getFieldsAsObject()
		)
		.then( this.handleSuccessful.bind( this, step ) )
		.catch( this.handleFailure.bind( this ) );
	}

	/**
	 * Returns the fields as an object.
	 *
	 * @returns {Object}
	 */
	getFieldsAsObject() {
		return JSON.stringify(
			this.refs.step.state.fieldValues[ this.state.currentStepId ]
		);

	}

	/**
	 * Shows/hides the saving status when performing a request.
	 *
	 * @param {string} text The status text to show.
	 */
	setSaveState( text ) {
		var $saveState = document.getElementById( "saveState" );
		$saveState.innerHTML = text;

		if ( text === '' ) {
			$saveState.style.display = 'none';
			return;
		}

		$saveState.style.display = 'block';
	}

	/**
	 * Gets the first step from the step object.
	 *
	 * @param {Object} steps The object containing the steps.
	 *
	 * @return {Object}  The first step object
	 */
	getFirstStep( steps ) {
		return Object.getOwnPropertyNames( steps )[0];
	}

	/**
	 * When the request is handled successfully.
	 *
	 * @param {string} step The next step to render.
	 */
	handleSuccessful( step ) {
		this.setSaveState( '' );
		this.setState( {
			currentStepId: step,
		} );
	}

	/**
	 * When the request is handled incorrect.
	 */
	handleFailure() {
		this.setSaveState( '' );
	}

	/**
	 * Updates the state to the next stepId in the wizard.
	 */
	setNextStep() {
		let currentStep = this.getCurrentStep();

		this.postStep( currentStep.next );
	}

	/**
	 * Updates the state to the previous stepId in the wizard.
	 */
	setPreviousStep() {
		let currentStep = this.getCurrentStep();

		this.postStep( currentStep.previous );
	}

	/**
	 * Gets the current stepId from the steps
	 */
	getCurrentStep() {
		return this.state.steps[ this.state.currentStepId ];
	}

	/**
	 * Gets the current step and the total number of steps to determine the current progress trough the wizard.
	 *
	 * @return {{totalSteps: Number, currentStepNumber: (int|string)}}
	 * Returns an object containing the total number of steps in the wizard and the current step nummber in the process.
	 */
	getProgress() {
		return {
			totalSteps: Object.keys( this.state.steps ).length,
			currentStepNumber: this.getCurrentStepNumber(),
		}
	}

	/**
	 * Gets the index number for a step from the array with step objects.
	 *
	 * @return {int} The step number when found, or 0 when the step is not found.
	 */
	getCurrentStepNumber() {
		let currentStep = this.state.currentStepId;
		let steps = Object.keys( this.state.steps );

		let stepNumber = steps.indexOf( currentStep );

		if ( stepNumber > - 1 ) {
			return stepNumber + 1;
		}

		return 0;
	}

	/**
	 * Renders the wizard.
	 *
	 * @return {JSX} The rendered step in the wizard.
	 */
	render() {
		let step = this.getCurrentStep();
		let hideNextButton = ! step.next;
		let hidePreviousButton = ! step.previous;

		return (
			<div>
				<div id="saveState" hidden="hidden"></div>
				<button hidden={(
					hidePreviousButton
				) ? "hidden" : ""} onClick={this.setPreviousStep.bind( this )}>Previous
				</button>
				<ProgressIndicator {...this.getProgress()} />
				<Step ref='step' currentStep={this.state.currentStepId} components={this.props.components} id={step.id} title={step.title} fields={step.fields} />
				<button hidden={(
					hideNextButton
				) ? "hidden" : ""} onClick={this.setNextStep.bind( this )}>Next
				</button>
			</div>
		);
	}
}

Wizard.propTypes = {
	endpoint: React.PropTypes.string.isRequired,
	steps: React.PropTypes.object,
	currentStepId: React.PropTypes.string,
	components: React.PropTypes.object,
	customComponents: React.PropTypes.object,
	fields: React.PropTypes.object,
};

Wizard.defaultProps = {
	steps: [],
	customComponents: {},
	components: {},
	fields: React.PropTypes.object,
};

export default Wizard
