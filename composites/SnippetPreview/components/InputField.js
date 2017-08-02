import React from "react";
import { EditorState, Modifier } from "draft-js";
import colors from "../../../style-guide/colors.json";
import createSingleLinePlugin from "draft-js-single-line-plugin";
import Editor from "draft-js-plugins-editor";

const singleLinePlugin = createSingleLinePlugin();
const plugins = [ singleLinePlugin ];

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

export default class InputField extends React.Component {
	constructor( props ) {
		super( props );
		this.state = { editorState: EditorState.createEmpty() };
	}

	render() {
		return (
			<div style={ styles.root }>
				<div style={ styles.editor } onClick={ this.focus.bind( this ) }>
					<Editor
						plugins={ plugins }
						blockRenderMap={ singleLinePlugin.blockRenderMap }
						editorState={ this.state.editorState }
						onChange={ this.onChange.bind( this ) }
						// handlePastedText= { this.handlePastedText.bind( this ) }
						placeholder={ this.props.placeholder }
						ref="editor"
						// handleReturn={ () => "handled" }
					/>
				</div>
			</div>
		);
	}

	onChange( editorState ) {
		this.setState( { editorState } );
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
