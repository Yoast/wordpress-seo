import React from "react";
import { EditorState, Modifier, Editor } from "draft-js";
import colors from "../../../style-guide/colors.json";
import styled from "styled-components";

const styles = {
	root: {
		fontFamily: "Arial, Helvetica, sans-serif",
		fontSize: 14,
	},
	editor: {
		cursor: "text",
		height: 16,
		border: "1px solid",
		borderColor: colors.$color_grey,
		width: "20%",
		padding: "3px 5px",
		margin: "5px 1px 1px 1px",
		backgroundColor: colors.$color_white,
		overflow: "hidden",
	},
};

const EditorContainer = styled.div`
    .public-DraftStyleDefault-block {
        white-space: nowrap;
        word-wrap: normal;
    }
`;

export default class InputField extends React.Component {
	constructor( props ) {
		super( props );
		this.state = { editorState: EditorState.createEmpty() };
	}

	render() {
		return (
			<div style={ styles.root }>
				<div style={ styles.editor } onClick={ this.focus.bind( this ) }>
					<EditorContainer>
						<Editor
							editorState={ this.state.editorState }
							onChange={ this.onChange.bind( this ) }
							placeholder={ this.props.placeholder }
							ref="editor"
						/>
					</EditorContainer>
				</div>
			</div>
		);
	}

	onChange( editorState ) {
		this.setState( { editorState } );
	}

	focus() {
		this.refs.editor.focus();
	}
}
