import React from 'react';

import Step from './step';

class Wizard extends React.Component {

	constructor() {
		super();

		this.state = {
			steps: {},
			currentStepId: '',
		};
	}

	componentWillMount() {
		this.setState( {
			steps: this.parseSteps( this.props.steps ),
			// Set the current step to the first step in the array.
			currentStepId: this.getFirstStep( this.props.steps )
		} );
	}

	parseSteps( steps ) {

		var previous = null;
		var stepsReversed = [];
		for ( let step in steps ) {
			if ( !steps.hasOwnProperty( step ) ) {
				continue;
			}

			steps[step].previous = previous;

			previous = step;

			stepsReversed.unshift( step );
		}

		stepsReversed.pop();

		for ( let step in steps ) {
			if ( !steps.hasOwnProperty( step ) ) {
				continue;
			}

			steps[step].next = stepsReversed.pop();
		}

		return steps;

	}

	getFirstStep( steps ) {
		return Object.getOwnPropertyNames( steps )[0];
	}

	next() {
		let nextStep = this.getCurrentStep( this.state.steps ).next;

		if ( !nextStep ) {
			return;
		}

		this.setState( {
			currentStepId: nextStep
		} );
	}

	previous() {
		let previousStep = this.getCurrentStep( this.state.steps ).previous;

		if ( !previousStep ) {
			return;
		}
		this.setState( {
			currentStepId: previousStep
		} );
	}

	getCurrentStep( steps ) {
		return steps[this.state.currentStepId];
	}

	render() {
		let step = this.getCurrentStep( this.state.steps );
		let hideNextButton = !step.next;
		let hidePreviousButton = !step.previous;

		return (
			<div>
				<button hidden={(
					hidePreviousButton
				) ? "hidden" : ""} onClick={this.previous.bind( this )}>Previous
				</button>
				<Step id={step.id} title={step.title}/>
				<button hidden={(
					hideNextButton
				) ? "hidden" : ""} onClick={this.next.bind( this )}>Next
				</button>
			</div>
		);
	}
}

Wizard.defaultProps = {
	steps: new Map()
};

Wizard.defaultProps.steps.values();


export default Wizard

