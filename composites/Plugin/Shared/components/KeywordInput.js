// External dependencies.
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import { __ } from "@wordpress/i18n";

// Internal dependencies.
import colors from "../../../../style-guide/colors.json";

const errorColor = colors.$color_red;

const KeywordInputContainer = styled.div`
	display: flex;
	flex-direction: column;
	margin: 1em 0;
`;

const KeywordFieldLabel = styled.label`
	font-size: 1em;
	font-weight: bold;
	margin-bottom: 0.5em;
`;

const KeywordField = styled.input`
	border: 3px solid initial;
	padding: 0.75em;
	font-size: 1em;

	&.hasError {
		border-color: ${ errorColor };
		outline-color: ${ errorColor };
	}
`;

const ErrorText = styled.p`
	color: ${ errorColor };
	margin: 0.5em 0 0 0;
	min-height: 1.8em;
`;

class KeywordInput extends React.Component {
	/**
	 * Constructs a KeywordInput component.
	 *
	 * @param {Object}   props           The props for this input field component.
	 * @param {string}   props.id        The id of the KeywordInput.
	 * @param {string}   props.label     The label of the KeywordInput.
	 * @param {boolean}  props.showLabel Toggle between an actual label or an aria-label on the input.
	 * @param {string}   props.keyword   The initial keyword passed to the state.
	 * @param {function} props.onChange  The function that is triggered when the keyword input field is changed.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.handleChange = this.handleChange.bind( this );
		this.displayErrorMessage = this.displayErrorMessage.bind( this );
	}

	/**
	 * Checks the keyword input for comma-separated words.
	 *
	 * @param {string} keywordText The text of the input.
	 *
	 * @returns {boolean} Returns true if a comma was found.
	 */
	checkKeywordInput( keywordText ) {
		return keywordText.includes( "," );
	}

	/**
	 * Displays the error message
	 *
	 * @param {boolean} showErrorMessage Whether or not the error message has to be shown.
	 *
	 * @returns {ReactElement} ErrorText The error message element.
	 */
	displayErrorMessage( showErrorMessage ) {
		if ( showErrorMessage && this.props.keyword !== "" ) {
			return (
				<ErrorText role="alert">
					{ __( "Are you trying to use multiple keywords? You should add them separately below.", "yoast-components" ) }
				</ErrorText>
			);
		}
	}

	/**
	 * Handles changes in the KeywordInput.
	 *
	 * @param {SyntheticEvent} event The onChange event.
	 *
	 * @returns {void} Sets the state if a change has been made.
	 */
	handleChange( event ) {
		this.props.onChange( event.target.value );
	}

	/**
	 * Renders an input field, a label, and if the condition is met, an error message.
	 *
	 * @returns {ReactElement} The KeywordField react component including its label and eventual error message.
	 */
	render() {
		const { id, label, showLabel, keyword } = this.props;
		const showErrorMessage = this.checkKeywordInput( keyword );

		return(
			<KeywordInputContainer>
				{ showLabel && <KeywordFieldLabel htmlFor={ id }>
					{ label }
				</KeywordFieldLabel> }
				<KeywordField
					aria-label={ showLabel ? null : label }
					type="text"
					id={ id }
					className={ showErrorMessage ? "hasError" : null }
					onChange={ this.handleChange }
					value={ keyword }
				/>
				{ this.displayErrorMessage( showErrorMessage ) }
			</KeywordInputContainer>
		);
	}
}

export const keywordInputPropType = {
	id: PropTypes.string,
	label: PropTypes.string.isRequired,
	showLabel: PropTypes.bool,
	keyword: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

KeywordInput.propTypes = keywordInputPropType;

KeywordInput.defaultProps = {
	id: uniqueId( "yoast-keyword-input-" ),
	showLabel: true,
	label: __( "Focus keyword:", "yoast-components" ),
	keyword: "",
};

export default KeywordInput;

