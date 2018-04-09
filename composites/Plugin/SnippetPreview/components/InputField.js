import PropTypes from "prop-types";
import React from "react";
import { EditorState, Editor, Modifier } from "draft-js";
import colors from "../../../../style-guide/colors.json";
import styled from "styled-components";

const InputFieldContainer = styled.div`
	cursor: text;
	height: 16px;
	border: 1px solid ${ colors.$color_grey };
	width: 100%;
	padding: 3px 5px;
	margin: 5px 1px 1px 1px;
	background-color: ${ colors.$color_white };
	overflow: hidden;
	font-size: 14px;
	font-style: inherit;
	.public-DraftStyleDefault-block {
        white-space: nowrap;
        word-wrap: normal;
    }
`;

export default class InputField extends React.Component {
	/**
	 * Constructs an input field
	 *
	 * @param {Object} props The props for this input field.
	 */
	constructor( props ) {
		super( props );
		this.state = { editorState: EditorState.createEmpty() };
	}

	/**
	 * Renders the input field.
	 *
	 * @returns {ReactElement} The rendered input field.
	 */
	render() {
		return (
			<InputFieldContainer onClick={ this.focus.bind( this ) }>
				<Editor
					editorState={ this.state.editorState }
					handlePastedText={ this.handlePastedText.bind( this ) }
					onChange={ this.onChange.bind( this ) }
					placeholder={ this.props.placeholder }
					ref={ editor => {
						this.editor = editor;
					} }
					handleReturn={ () => "handled" }
				/>
			</InputFieldContainer>
		);
	}

	/**
	 * Changes when the editor state changes.
	 *
	 * @param {Object} editorState The editor state for the DraftJS object.
	 *
	 * @returns {void}
	 */
	onChange( editorState ) {
		this.setState( { editorState } );
	}

	/**
	 * Focuses the editor.
	 *
	 * @returns {void}
	 */
	focus() {
		this.editor.focus();
	}

	/**
	 * Handles pasted text into the editor.
	 *
	 * @param {string} text The inserted text.
	 *
	 * @returns {string} A result string.
	 */
	handlePastedText( text ) {
		this.onChange( EditorState.push(
			this.state.editorState,
			Modifier.replaceText(
				this.state.editorState.getCurrentContent(),
				this.state.editorState.getSelection(),
				text.replace( /\n|\r/g, " " )
			)
		) );
		return "handled";
	}
}

InputField.propTypes = {
	placeholder: PropTypes.string,
};

InputField.defaultProps = {
	placeholder: "",
};
