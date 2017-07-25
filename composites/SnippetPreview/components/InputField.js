import React from "react";
import { Editor, EditorState } from "draft-js";
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
	},
	button: {
		marginTop: 10,
		textAlign: "center",
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
				<div style={ styles.editor } onClick={ this.focus }>
					<Editor
						editorState={ this.state.editorState }
						onChange={ ( editorState ) => {
							this.onChange( editorState );
						} }
						placeholder={ this.props.placeholder }
					/>
				</div>
			</div>
		);
	}
}
