import React from 'react';

class Step extends React.Component {

	constructor() {
		super();

	}

	render() {
		return (
			<button onClick={this.props.update}>Stap {this.props.title}</button>
		)
	}


}

Step.defaultProps = {
	id : '',
	title : '',
	fields: []
};

export default Step
