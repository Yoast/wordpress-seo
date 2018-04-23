// External dependencies.
import React from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, { defaultSuggestionsFilter } from "draft-js-mention-plugin";
import flow from "lodash/flow";
import PropTypes from "prop-types";

// Internal dependencies.
import { replacementVariablesShape } from "../constants";
import { serializeEditor, unserializeEditor } from "../serialization";

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

/**
 * A replacement variable editor. It allows replacements variables as tokens in
 * its editor. It's a small shell on top of DraftJS.
 */
class ReplacementVariableEditor extends React.Component {
	/**
	 * Constructs the replacement variable editor for use.
	 *
	 * @param {Object} props                        The props to instantiate this
	 *                                              editor with.
	 * @param {string} props.content                The content to instantiate this
	 *                                              editor with.
	 * @param {Object[]} props.replacementVariables The replacement variables that
	 *                                              should be available in the
	 *                                              editor.
	 * @param {string}   props.ariaLabelledBy       The ID of the field this is
	 *                                              labelled by.
	 * @param {Function} props.onChange             Called when the content inside
	 *                                              is edited.
	 * @param {Function} props.onFocus              Called when this editor is
	 *                                              focused.
	 * @param {Function} props.onBlur               Called when this editor is
	 *                                              unfocused.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		const { content: rawContent } = this.props;

		this.state = {
			editorState: createEditorState( rawContent ),
			replacementVariables: props.replacementVariables,
		};

		/*
		 * To prevent re-rendering the editor excessively we need to set the serialized
		 * content to the passed content. This is possible because the following is
		 * true:
		 * `rawContent === serialize( unserialize( rawContent ) )`
		 */
		this._serializedContent = rawContent;

		this.onChange = this.onChange.bind( this );
		this.onSearchChange = this.onSearchChange.bind( this );
		this.setEditorRef = this.setEditorRef.bind( this );

		/*
		 * The mentions plugin is used to autocomplete the replacement variable
		 * names.
		 */
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
	 * Sets the editor reference on this component instance.
	 *
	 * @param {Object} editor The editor React reference.
	 *
	 * @returns {void}
	 */
	setEditorRef( editor ) {
		this.editor = editor;
	}

	/**
	 * Sets the state of this editor when the incoming content changes.
	 *
	 * @param {Object} nextProps The props this component receives.
	 *
	 * @returns {void}
	 */
	componentWillReceiveProps( nextProps ) {
		if ( nextProps.content !== this._serializedContent ) {
			this._serializedContent = nextProps.content;

			this.setState( {
				editorState: createEditorState( nextProps.content ),
			} );
		}
	}

	/**
	 * Renders the editor including DraftJS and the mentions plugin.
	 *
	 * @returns {ReactElement} The rendered element.
	 */
	render() {
		const { MentionSuggestions } = this.mentionsPlugin;
		const { onFocus, onBlur, ariaLabelledBy } = this.props;
		const { editorState, replacementVariables } = this.state;

		return (
			<React.Fragment>
				<Editor
					editorState={ editorState }
					onChange={ this.onChange }
					onFocus={ onFocus }
					onBlur={ onBlur }
					plugins={ [ this.mentionsPlugin ] }
					ref={ this.setEditorRef }
					stripPastedStyles={ true }
					ariaLabelledBy={ ariaLabelledBy }
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

ReplacementVariableEditor.propTypes = {
	content: PropTypes.string.isRequired,
	replacementVariables: replacementVariablesShape,
	ariaLabelledBy: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
};

ReplacementVariableEditor.defaultProps = {
	onFocus: () => {},
	onBlur: () => {},
};

export default ReplacementVariableEditor;
