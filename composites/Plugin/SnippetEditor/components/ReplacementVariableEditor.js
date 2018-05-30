// External dependencies.
import React from "react";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, { defaultSuggestionsFilter } from "draft-js-mention-plugin";
import createSingleLinePlugin from "draft-js-single-line-plugin";
import flow from "lodash/flow";
import debounce from "lodash/debounce";
import PropTypes from "prop-types";
import { speak as a11ySpeak } from "@wordpress/a11y";
import { __, _n, sprintf } from "@wordpress/i18n";

// Internal dependencies.
import { replacementVariablesShape } from "../constants";
import { serializeEditor, unserializeEditor } from "../serialization";

/**
 * Creates a Draft.js editor state from a string.
 *
 * @param {string} content The content to turn into editor state.
 *
 * @returns {EditorState} The editor state.
 */
const createEditorState = flow( [
	convertFromRaw,
	EditorState.createWithContent,
] );

/**
 * Serializes the Draft.js editor state into a string.
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
 * its editor. It's a small shell on top of Draft.js.
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

		const { content: rawContent, replacementVariables } = this.props;
		const unserialized = unserializeEditor( rawContent, replacementVariables );

		this.state = {
			editorState: createEditorState( unserialized ),
			searchValue: "",
			replacementVariables,
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
		this.debouncedA11ySpeak = debounce( a11ySpeak.bind( this ), 500 );

		/*
		 * The mentions plugin is used to autocomplete the replacement variable
		 * names.
		 */
		this.mentionsPlugin = createMentionPlugin( {
			mentionTrigger: "%",
			entityMutability: "IMMUTABLE",
		} );

		this.singleLinePlugin = createSingleLinePlugin( {
			stripEntities: false,
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
	 * Handlers changes to the underlying Draft.js editor.
	 *
	 * @param {EditorState} editorState The Draft.js state.
	 *
	 * @returns {void}
	 */
	onChange( editorState ) {
		this.setState( {
			editorState,
		}, () => {
			this.serializeContent( editorState );
		} );
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
			searchValue: value,
			replacementVariables: defaultSuggestionsFilter( value, this.props.replacementVariables ),
		} );

		/*
		 * Because of the particular way this component re-renders, on `componentDidUpdate`
		 * the `replacementVariables` in the state are the initial ones. See `onChange`
		 * which runs after `onSearchChange` and re-renders the component. We need to
		 * make sure to get the correct count of the filtered replacementVariables
		 * after the state is updated and before the component is re-rendered again.
		 */
		setTimeout( () => {
			this.announceSearchResults();
		} );
	}

	/**
	 * Announces the search results to assistive technologies using an ARIA live region.
	 *
	 * @returns {void}
	 */
	announceSearchResults() {
		const { replacementVariables } = this.state;

		if ( replacementVariables.length ) {
			this.debouncedA11ySpeak(
				sprintf(
					_n(
						"%d result found, use up and down arrow keys to navigate",
						"%d results found, use up and down arrow keys to navigate",
						replacementVariables.length
					),
					replacementVariables.length,
					"yoast-components"
				),
				"assertive"
			);
		} else {
			this.debouncedA11ySpeak( __( "No results", "yoast-components" ), "assertive" );
		}
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
		const { content, replacementVariables } = this.props;
		const { searchValue } = this.state;

		if (
			( nextProps.content !== this._serializedContent && nextProps.content !== content ) ||
			nextProps.replacementVariables !== replacementVariables
		) {
			this._serializedContent = nextProps.content;
			const unserialized = unserializeEditor( nextProps.content, nextProps.replacementVariables );

			this.setState( {
				editorState: createEditorState( unserialized ),
				replacementVariables: defaultSuggestionsFilter( searchValue, nextProps.replacementVariables ),
			} );
		}
	}

	/**
	 * Renders the editor including Draft.js and the mentions plugin.
	 * Cancels the debounced call to A11ySpeak.
	 *
	 * @returns {void}
	 */
	componentWillUnmount() {
		this.debouncedA11ySpeak.cancel();
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
					plugins={ [ this.mentionsPlugin, this.singleLinePlugin ] }
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
	className: "",
};

export default ReplacementVariableEditor;
