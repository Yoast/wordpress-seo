import React from 'react';

import Step from './step';

function parseSteps( steps ) {

	var previous      = null;
	var stepsReversed = [];
	for( let step in steps ) {
		if ( ! steps.hasOwnProperty( step ) ) {
			continue;
		}

		steps[ step ].previous = previous;

		previous = step;


		stepsReversed.unshift( step );
	}

	stepsReversed.pop();

	for( let step in steps ) {
		if ( ! steps.hasOwnProperty( step ) ) {
			continue;
		}

		steps[step].next = stepsReversed.pop();
	}

	return steps;

}


class Wizard extends React.Component {

	constructor() {
		super()
	}

	componentWillMount() {
		this.setState( {
			steps: parseSteps( this.props.steps )
		});

	}


	render() {

		console.log(this.state.steps);

		return (
			<div>

			</div>

		)
	}


}

Wizard.defaultProps = {
	steps : new Map()
}

Wizard.defaultProps.steps.values()


export default Wizard

