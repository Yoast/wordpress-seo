import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const YoastCheckbox = styled.input`
	margin-right: 0.5em;
`;

/**
 * Creates a React Checkbox which consists of a checkbox and a label.
 */
class Checkbox extends React.Component {
	/**
	 * Constructs a checkbox component.
	 *
	 * @param {Object} props The props for this checkbox.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			checked: props.checked,
		};
	}

	/**
	 * Handles changes in the Checkbox.
	 *
	 * @param {Event} event The onChange event.
	 * @returns {void} Fires the onChange function passed in the props.
	 */
	handleChange( event ) {
		this.setState( { checked: event.target.checked }, () => this.props.onChange( this.state.checked ) );
	}

	/**
	 * Renders a checkbox and a label.
	 *
	 * @returns {ReactElement} The Checkbox react component including its label.
	 */
	render() {
		return (
			<React.Fragment>
				<YoastCheckbox type="checkbox" id={ this.props.id } onChange={ this.handleChange.bind( this ) } />
				<label htmlFor={ this.props.id }>
					{ this.props.label }
				</label>
			</React.Fragment>
		);
	}
}

Checkbox.propTypes = {
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.array,
	] ).isRequired,
	checked: PropTypes.bool,

};

Checkbox.defaultProps = {
	checked: false,
};

export default Checkbox;
