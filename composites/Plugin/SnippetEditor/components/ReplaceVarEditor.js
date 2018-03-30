import React from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, { defaultSuggestionsFilter } from "draft-js-mention-plugin";
import { serializeEditor, unserializeEditor } from "../serialization";
import flow from "lodash/flow";
import PropTypes from "prop-types";

/**
 * Creates a DraftJS editor state from a string.
 *
 * @param {string} content The content to turn into editor state.
 *
 * @returns {EditorState} The editor state.
 */
const createEditorState = flow( [
	unserializeEditor,
	convertFromRaw,
	EditorState.createWithContent,
] );

/**
 * Serializes the DraftJS editor state into a string.
 *
 * @param {EditorState} The current editor state.
 *
 * @returns {string} The serialized editor state.
 */
const serializeEditorState = flow( [
	convertToRaw,
	serializeEditor,
] );

class ReplaceVarEditor extends React.Component {
	/**
	 * Constructs the replacement variable editor for use.
	 *
	 * @param {Object} props The props to instantiate this editor with.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		const { content } = this.props;

		this.state = {
			editorState: createEditorState( content ),
			replacementVariables: props.replacementVariables,
		};

		this._serializedContent = content;

		this.onChange = this.onChange.bind( this );
		this.onSearchChange = this.onSearchChange.bind( this );

		this.mentionsPlugin = createMentionPlugin( {
			mentionTrigger: "%",
			entityMutability: "IMMUTABLE",
		} );
	}

	/**
	 * Serializes the current content and calls the onChange handler with this
	 * content.
	 *
	 * @param {EditorState} editorState The current state of the editor.
	 *
	 * @returns {void}
	 */
	serializeContent( editorState ) {
		const serializedContent = serializeEditorState( editorState.getCurrentContent() );

		if ( this._serializedContent !== serializedContent ) {
			this._serializedContent = serializedContent;

			this.props.onChange( this._serializedContent );
		}
	}

	/**
	 * Handlers changes to the underlying DraftJS editor.
	 *
	 * @param {EditorState} editorState The DraftJS state.
	 *
	 * @returns {void}
	 */
	onChange( editorState ) {
		this.setState( {
			editorState,
		} );

		this.serializeContent( editorState );
	}

	/**
	 * Handles a search change in the mentions plugin.
	 *
	 * @param {string} value The search value.
	 *
	 * @returns {void}
	 */
	onSearchChange( { value } ) {
		this.setState( {
			replacementVariables: defaultSuggestionsFilter( value, this.props.replacementVariables ),
		} );
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
	 * Renders the editor including DraftJS and the mentions plugin.
	 *
	 * @returns {ReactElement} The rendered element.
	 */
	render() {
		const { MentionSuggestions } = this.mentionsPlugin;
		const { onFocus, onBlur } = this.props;
		const { editorState, replacementVariables } = this.state;

		return (
			<React.Fragment>
				<Editor
					editorState={ editorState }
					onChange={ this.onChange }
					onFocus={ onFocus }
					onBlur={ onBlur }
					plugins={ [ this.mentionsPlugin ] }
					ref={ ( element ) => {
						this.editor = element;
					} }
				/>
				<MentionSuggestions
					onSearchChange={ this.onSearchChange }
					suggestions={ replacementVariables }
					onAddMention={ this.onAddMention }
				/>
			</React.Fragment>
		);
	}
}

ReplaceVarEditor.propTypes = {
	content: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	className: PropTypes.string,
	replacementVariables: PropTypes.array,

	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
};

ReplaceVarEditor.defaultProps = {
	onFocus: () => {},
	onBlur: () => {},
};

export default ReplaceVarEditor;
