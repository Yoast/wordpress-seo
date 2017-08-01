import React from "react";
import { Editor, EditorState, Modifier } from "draft-js";
import colors from "../../../style-guide/colors.json";

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
		width: "100%",
		padding: "3px 5px",
		margin: "5px 1px 1px 1px",
		backgroundColor: colors.$color_white,
		overflow: "hidden",
	},
	".public-DraftStyleDefault-block": {
		whiteSpace: "pre",
	},

};

export default class InputField extends React.Component {
	constructor( props ) {
		super( props );
		this.state = { editorState: EditorState.createEmpty() };
		this.onChange = ( editorState ) => this.setState( { editorState } );
	}

	render() {
		return (
			<div style={ styles.root }>
				<div style={ styles.editor } onClick={ this.focus.bind( this ) }>
					<Editor
						editorState={ this.state.editorState }
						onChange={ this.onChange.bind( this ) }
						handlePastedText= { this.handlePastedText.bind( this ) }
						placeholder={ this.props.placeholder }
						ref="editor"
						handleReturn={ () => "handled" }
					/>
				</div>
			</div>
		);
	}

	handlePastedText( text ) {
		this.onChange( EditorState.push(
			this.state.editorState,
			Modifier.replaceText(
				this.state.editorState.getCurrentContent(),
				this.state.editorState.getSelection(),
				text.replace( /\n/g, " " )
			)
		) );
		return "handled";
	}

	focus() {
		this.refs.editor.focus();
	}
}
