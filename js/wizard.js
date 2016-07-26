import React from 'react';

import Step from './step';

function parseSteps( steps ) {

	var previous      = null;
	var stepsReversed = [];
	for( let step in steps ) {
		steps[ step ].previous = previous;

		previous = step;


		stepsReversed.unshift( step );
	}

	stepsReversed.pop();

	for( let step in steps ) {
		if ( steps.hasOwnProperty( step ) ) {
			steps[step].next = stepsReversed.pop();
		}

	}

	return steps;

}


class Wizard extends React.Component {

	constructor() {
		super()

		// let keys  = Array.from( Steps.keys() )
		// let steps = Array.from( Steps.values() )
		// let currentStep = 0
		//
		// this.state = {
		// 	currentStep,
		// 	steps,
		// 	keys,
		// 	previousStep: this.getPreviousStep( keys, currentStep ),
		// 	nextStep: this.getNextStep( keys, currentStep )
		// };
		//
		// this.gotoNext = this.gotoNext.bind(this)
	}

	componentWillMount() {
		this.props.steps = parseSteps( this.props.steps );
	}


	getNextStep( keys, currentStep ) {

		let nextStep = null;

		if( keys[ currentStep + 1 ] ) {
			nextStep = currentStep + 1;
		}

		return nextStep;
	}

	getPreviousStep( keys, currentStep ) {
		let previousStep = null;


		if( keys[ currentStep - 1 ] ) {
			previousStep = currentStep - 1;
		}

		return previousStep;
	}

	gotoNext() {
		var nextStep = this.state.currentStep + 1;

		this.setState(
			{
				currentStep: nextStep,
				previousStep: this.getPreviousStep( this.state.keys, nextStep ),
				nextStep: this.getNextStep( this.state.keys, nextStep )
			}
		)
	}

	previousStep() {
		let previous = this.state.previousStep;
		if( previous !== null ) {
			previous = this.state.steps[ previous ];
			return <Step ref="previous" id={previous.id} title={previous.title} fields={previous.fields}  />
		}

		return '';
	}

	nextStep() {
		let next = this.state.nextStep;
		if( next !== null ) {
			next = this.state.steps[ next ];
			return <Step update={this.gotoNext} ref="next" id={next.id} title={next.title} fields={next.fields}  />
		}

		return '';
	}

	render() {
		return (
			<div>
				{this.previousStep()}
				{this.nextStep()}
			</div>

		)
	}


}

Wizard.defaultProps = {
	steps : new Map()
}

Wizard.defaultProps.steps.values()


export default Wizard

