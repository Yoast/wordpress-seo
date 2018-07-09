import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import isFunction from "lodash/isFunction";

const SynonymsField = styled.input`
	margin-right: 0.5em;
`;

class SynonymsInput extends React.Component {
	/**
	 * Constructs a SynonymsField component
	 *
	 * @param {Object} props          The props for this input field component.
	 * @param {string} props.id       The id of the SynonymsField.
	 * @param {string} props.label    The label of the SynonymsField.
	 * @param {string} props.synonyms The initial synonyms passed to the state.
	 * @param {string} props.onChange The change event handler.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.handleChange = this.handleChange.bind( this );
	}

	/**
	 * Handles changes in the input.
	 *
	 * @param {Event} event The onChange event.
	 *
	 * @returns {void} Calls the onChange prop if given.
	 */
	handleChange( event ) {
		const { onChange } = this.props;
		const synonyms = event.target.value;

		if ( isFunction( onChange ) ) {
			onChange( synonyms );
		}
	}

	/**
	 * Renders the SynonymsField component.
	 *
	 * @returns {ReactElement} The SynonymsField component.
	 */
	render() {
		const { id, label, synonyms } = this.props;

		return (
			<SynonymsField
				aria-label={ label }
				type="text"
				id={ id }
				onChange={ this.handleChange }
				value={ synonyms }
			/>
		);
	}
}

SynonymsInput.propTypes = {
	id: PropTypes.string,
	label: PropTypes.string.isRequired,
	synonyms: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

SynonymsInput.defaultProps = {
	id: uniqueId( "yoast-synonyms-input-" ),
};

export default SynonymsInput;

