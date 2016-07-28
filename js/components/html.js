import React from 'react';

class Input extends React.Component {
	constructor() {
		super();
	}

	/**
	 * Sets the current state
	 */
	componentWillMount() {
		this.setState( this.props );
	}

	getHTML() {
		return { __html: this.state.html} ;

	}

	/**
	 *
	 * @returns {XML}
	 */
	render() {
		return (
			<div dangerouslySetInnerHTML={this.getHTML()}></div>
		)
	}
}

Input.propTypes = {
	html: React.PropTypes.string
};

Input.defaultProps = {
	html: ''
};

export default Input;
