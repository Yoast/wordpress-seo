import React from 'react';
import Step from './step';

import Components from './components';

import PostJSONRequest from './helpers/postJSONRequest';

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

		this.state = {
			steps: this.parseSteps( props.steps ),
			currentStepId: this.getFirstStep( props.steps )
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

		/**
		 * We are using this var because we need to set a next step for each step. We are adding the value at the
		 * beginning of the array. Results in an array like [ step 3, step 2, step 1 ].
		 *
		 * The next step will be set by popping the last value of the array and set it as the next one for the step
		 * we are looping through.
		 *
		 * @type {Array}
		 */
		var stepsReversed = [];

		var previous = null;

		// Loop through the steps to set each previous step.
		for ( let step in steps ) {
			if ( ! steps.hasOwnProperty( step ) ) {
				continue;
			}

			steps[ step ]['fields'] = this.parseFields( steps[ step ]['fields'] );

			steps[ step ].previous = previous;

			// Sets the previous var with current step.
			previous = step;

			// Adds the step to the reversed array.
			stepsReversed.unshift( step );
		}

		// We don't need 'first step'.
		stepsReversed.pop();

		// Loop through the steps to set each next step.
		for ( let step in steps ) {
			if ( ! steps.hasOwnProperty( step ) ) {
				continue;
			}

			steps[ step ].next = stepsReversed.pop();
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
			}.bind( this )
		);

		return fields;
	}

	/**
	 * Sends the options for the current step via POST request to the back-end.
	 *
	 * @param {string} targetStep The step id to switch to.
	 */
	saveOptions( targetStep ) {

		this.setSaveState( 'Saving..' );

		PostJSONRequest(
			this.props.endpoint,
			this.getFieldsAsObject(),
			function() {
				this.setSaveState( '' );
				this.setState( {
					currentStepId: targetStep
				} );
			} .bind( this ),
			function() {
				this.setSaveState( '' );
			}.bind( this )
		);
	}

	/**
	 * Returns the fields as an object.
	 *
	 * @returns {Object}
	 */
	getFieldsAsObject() {
		return JSON.stringify( this.refs.step.state.fieldValues[ this.state.currentStepId ] );
	}

	/**
	 * Shows/hides the saving status when performing a request.
	 *
	 * @param {string} state The status text to show.
	 */
	setSaveState( state ) {
		var $saveState = document.getElementById( "saveState" );
		$saveState.innerHTML = state;

		if ( state === '' ) {
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
	 * Updates the state to the next stepId in the wizard.
	 */
	setNextStep() {
		let currentStep = this.getCurrentStep();
		let nextStep = currentStep.next;

		if ( ! nextStep ) {
			return;
		}

		this.saveOptions( nextStep );
	}

	/**
	 * Updates the state to the previous stepId in the wizard.
	 */
	setPreviousStep() {
		let currentStep = this.getCurrentStep();
		let previousStep = currentStep.previous;

		if ( ! previousStep ) {
			return;
		}

		this.saveOptions( previousStep );
	}

	/**
	 * Gets the current stepId from the steps
	 */
	getCurrentStep() {
		return this.state.steps[ this.state.currentStepId ];
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
	steps: React.PropTypes.object,
	currentStepId: React.PropTypes.string,
	components: React.PropTypes.object,
	customComponents: React.PropTypes.object,
	fields: React.PropTypes.object
};

Wizard.defaultProps = {
	steps: [],
	customComponents: {},
	components: {},
	fields: React.PropTypes.object
};

export default Wizard
