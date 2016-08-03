import React from 'react';
import Step from './step';

import Components from './components';

import PostJSONRequest from './helpers/postJSONRequest';

var jQuery = require( 'jQuery' );

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
			function ( fieldName ) {
				if ( this.props.fields[ fieldName ] ) {
					fields[ fieldName ] = this.props.fields[ fieldName ];
				}
			}.bind( this )
		);

		return fields;
	}

	/**
	 * Sends the options for the current step via POST request to the back-end and sets the state to the target step when successful.
	 *
	 * @return {Promise}
	 */
	saveOptions() {

		this.setSaveState( 'Saving..' );

		return PostJSONRequest(
			this.props.endpoint,
			{ "test": "test-data" }
		)
	}

	/**
	 * Send a AJAX request to the options server to store.
	 * The save state shows a saving status in the step window.
	 * When successful this updates the current state with the target step and the wizard renders the new step.
	 * @param targetStep The step to render after the current state is stored.
	 */
	saveAndUpdateState( targetStep ) {
		this.saveOptions().then( function () {
				this.setSaveState( '' );
				this.setState( {
					currentStepId: targetStep
				} );
			}.bind( this )
		)
		    .catch(
			    function () {
				    this.setSaveState( '' );
			    }.bind( this )
		    )
	}

	/**
	 * Shows/hides the saving status when performing a request.
	 *
	 * @param {string} text The status text to show.
	 */
	setSaveState( text ) {
		var $saveState = jQuery( "#saveState" );
		$saveState.html( text );

		if ( text === '' ) {
			$saveState.hide();
			return;
		}
		$saveState.show();
	}

	/**
	 * Gets the first step from the step object.
	 *
	 * @param {Object} steps The object containing the steps.
	 *
	 * @return {Object}  The first step object
	 */
	getFirstStep( steps ) {
		return Object.getOwnPropertyNames( steps )[ 0 ];
	}


	/**
	 * Sets the wizard to another step and saves the current status.
	 * If the step doesn't exist, nothing happens.
	 * @param step The step to render in the wizard.
	 */
	setStep( step ) {
		if ( ! step ) {
			return;
		}

		//Save the options for this step and update the state to the next step.
		this.saveAndUpdateState( step );
	}


	/**
	 * Updates the state to the next stepId in the wizard.
	 */
	setNextStep() {
		let currentStep = this.getCurrentStep();

		this.setStep( currentStep.next );
	}

	/**
	 * Updates the state to the previous stepId in the wizard.
	 */
	setPreviousStep() {
		let currentStep = this.getCurrentStep();

		this.setStep( currentStep.previous );
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
				<Step components={this.props.components} id={step.id} title={step.title} fields={step.fields}/>
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
