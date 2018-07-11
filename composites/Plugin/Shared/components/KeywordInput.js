// External dependencies.
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import uniqueId from "lodash/uniqueId";
import { __ } from "@wordpress/i18n";

// Internal dependencies.
import colors from "../../../../style-guide/colors.json";

const errorColor = colors.$color_red;

const YoastKeywordInput = styled.div`
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
	border-color: ${ colors.$color_grey_light };
	border-style: solid;
	border-width: 3px;
	padding: 0.75em;
	font-size: 1.1em;

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

const ErrorMessage = __( "Are you trying to use multiple keywords? You should add them separately below." );

class KeywordInput extends React.Component {
	/**
	 * Constructs a KeywordInput component
	 *
	 * @param {Object}  props           The props for this input field component.
	 * @param {string}  props.id        The id of the KeywordInput.
	 * @param {string}  props.label     The label of the KeywordInput.
	 * @param {boolean} props.showLabel Toggle between an actual label or an aria-label on the input.
	 * @param {string}  props.keyword   The initial keyword passed to the state.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.handleChange = this.handleChange.bind( this );
		this.displayErrorMessage = this.displayErrorMessage.bind( this );

		this.state = {
			showErrorMessage: this.checkKeywordInput( props.keyword ),
			keyword: props.keyword,
		};
	}

	/**
	 * Checks the keyword input for comma-separated words
	 *
	 * @param {string} keywordText The text of the input
	 *
	 * @returns {boolean} Returns true if a comma was found.
	 */
	checkKeywordInput( keywordText ) {
		return keywordText.includes( "," );
	}

	/**
	 * Displays the error message
	 *
	 * @param {string} input The text of the input
	 *
	 * @returns {ReactElement} ErrorText The error message element
	 */
	displayErrorMessage( input = "" ) {
		if ( this.state.showErrorMessage && input !== "" ) {
			return (
				<ErrorText role="alert">
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
	 * @returns {void} Sets the state if a change has been made.
	 */
	handleChange( event ) {
		const keyword = event.target.value;
		const showErrorMessage = this.checkKeywordInput( keyword );

		if (
			keyword !== this.state.keyword ||
			showErrorMessage !== this.state.showErrorMessage
		) {
			this.setState( { keyword, showErrorMessage } );
		}
	}

	/**
	 * Renders an input field, a label, and if the condition is met, an error message.
	 *
	 * @returns {ReactElement} The KeywordField react component including its label and eventual error message.
	 */
	render() {
		const { keyword, showErrorMessage } = this.state;
		const { id, label, showLabel } = this.props;

		return(
			<YoastKeywordInput>
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
				{ this.displayErrorMessage( keyword ) }
			</YoastKeywordInput>
		);
	}
}

export const keywordInputPropType = {
	id: PropTypes.string,
	label: PropTypes.string.isRequired,
	showLabel: PropTypes.bool,
	keyword: PropTypes.string,
};

KeywordInput.propTypes = keywordInputPropType;

KeywordInput.defaultProps = {
	id: uniqueId( "yoast-keyword-input-" ),
	showLabel: true,
	label: "Focus keyword:",
};

export default KeywordInput;

