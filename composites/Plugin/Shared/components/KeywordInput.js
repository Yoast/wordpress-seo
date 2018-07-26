import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import colors from "../../../../style-guide/colors.json";

let KeywordField = styled.input`
	margin-right: 0.5em;
	border-color: ${ props => props.borderColor };
`;

const ErrorText = styled.div`
	font-size: 1em;
	color: ${ colors.$color_red };
	margin: 1em 0;
	min-height: 1.8em;
`;

const ErrorMessage = "Are you trying to use multiple keywords? You should add them separately below.";

class KeywordInput extends React.Component {
	/**
	 * Constructs a KeywordInput component
	 *
	 * @param {Object}      props          The props for this input field component.
	 * @param {String}    	props.id       The id of the KeywordInput.
	 * @param {IconsButton} props.label    The label of the KeywordInput.
	 * @param {boolean}     props.keyword  The initial keyword passed to the state.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.handleChange = this.handleChange.bind( this );

		this.state = {
			showErrorMessage: false,
		};
	}

	/**
	 * Checks the keyword input for comma-separated words
	 *
	 * @param {String} keywordText The text of the input
	 *
	 * @returns {void}
	 */
	checkKeywordInput( keywordText ) {
		let separatedWords = keywordText.split( "," );
		this.setState( { showErrorMessage: separatedWords.length > 1 } );
	}

	/**
	 * Displays the error message
	 *
	 * @param {String} input The text of the input
	 *
	 * @returns {Element} ErrorText The error message element
	 */
	displayErrorMessage( input = "" ) {
		if ( this.state.showErrorMessage && input !== "" ) {
			return (
				<ErrorText id="KeywordError" role="alert">
					{ ErrorMessage }
				</ErrorText>
			);
		}
	}

	/**
	 * Handles changes in the KeywordInput.
	 *
	 * @param {Event} event The onChange event.
	 *
	 * @returns {void} Calls the checkKeywordInput-function.
	 */
	handleChange( event ) {
		this.checkKeywordInput( event.target.value );
		this.props.onChange( event.target.value );
	}

	/**
	 * Renders an input field, a label, and if the condition is met, an error message.
	 *
	 * @returns {ReactElement} The KeywordField react component including its label and eventual error message.
	 */
	render() {
		const color = this.state.showErrorMessage ? "red" : "white";
		return(
			<React.Fragment>
				<label htmlFor={ this.props.id }>
					{ this.props.label }
				</label>
				<KeywordField
					type="text"
					id={ this.props.id }
					borderColor={ color }
					onChange={ this.handleChange }
					value={ this.props.keyword }
				/>
				{ this.displayErrorMessage( this.state.keyword ) }
			</React.Fragment>
		);
	}
}

KeywordInput.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	keyword: PropTypes.string,
};

KeywordInput.defaultProps = {
	keyword: "",
};

export default KeywordInput;

