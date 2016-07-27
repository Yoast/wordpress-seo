import React from 'react';

class Step extends React.Component {

	constructor( props ) {
		super();
		this.props = props
	}

	render() {
		return (
			<h1>Stap: {this.props.title}</h1>
		)
	}
}

Step.propTypes = {
	id: React.PropTypes.string,
	title: React.PropTypes.string,
	field: React.PropTypes.array
}

Step.defaultProps = {
	id: '',
	title: '',
	fields: []
};

export default Step
