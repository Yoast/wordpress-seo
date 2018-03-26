import React from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, { defaultSuggestionsFilter } from "draft-js-mention-plugin";
import { serializeEditor, unserializeEditor } from "../serialization";
import flow from "lodash/flow";
import PropTypes from "prop-types";

const createEditorState = flow( [
	unserializeEditor,
	convertFromRaw,
	EditorState.createWithContent,
] );

const serializeEditorState = flow( [
	convertToRaw,
	serializeEditor,
] );

class ReplaceVarEditor extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			editorState: createEditorState( this.props.content ),
			replacementVariables: props.replacementVariables,
		};

		this.onChange = this.onChange.bind( this );
		this.onSearchChange = this.onSearchChange.bind( this );

		this.mentionsPlugin = createMentionPlugin( {
			mentionTrigger: "%%",
			entityMutability: "IMMUTABLE",
		} );
	}

	onChange( editorState ) {
		this.setState( {
			editorState,
		} );

		this.props.onChange( serializeEditorState( editorState.getCurrentContent() ) );
	}

	onSearchChange( { value } ) {
		this.setState( {
			replacementVariables: defaultSuggestionsFilter( value, this.props.replacementVariables ),
		} );
	}

	focus() {
		this.editor.focus();
	}

	render() {
		const { MentionSuggestions } = this.mentionsPlugin;

		const {
			editorState,
		} = this.state;


		return (
			<React.Fragment>
				<Editor
					className={ this.props.className }
					editorState={ editorState }
					onChange={ this.onChange }
					plugins={ [ this.mentionsPlugin ] }
					ref={( element ) => {
						this.editor = element;
					}}
				/>
				<MentionSuggestions
					onSearchChange={ this.onSearchChange }
					suggestions={ this.state.replacementVariables }
					onAddMention={ this.onAddMention }
				/>
			</React.Fragment>
		);
	}
}

ReplaceVarEditor.propTypes = {
	content: PropTypes.string,
	onChange: PropTypes.func,
	className: PropTypes.string,
	replacementVariables: PropTypes.array,
};

export default ReplaceVarEditor;
