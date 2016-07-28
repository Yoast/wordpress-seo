import React from 'react';

/**
 * Represents a step in the wizard process
 */
class Step extends React.Component {

	/**
	 * Constructor
	 *
	 * @param {Object} props
	 */
	constructor( props ) {
		super();
		this.props = props
	}

	/**
	 * Renders the HTML.
	 *
	 * @returns {XML}
	 */
	render() {
		return (
			<h1>Stap: {this.props.title}</h1>
		)
	}
}

Step.propTypes = {
	id: React.PropTypes.string,
	title: React.PropTypes.string,
	fields: React.PropTypes.array
};

Step.defaultProps = {
	id: '',
	title: '',
	fields: []
};

export default Step
