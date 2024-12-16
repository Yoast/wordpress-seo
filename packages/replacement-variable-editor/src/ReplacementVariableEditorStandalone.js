// External dependencies.
import React from "react";
import Editor from "@draft-js-plugins/editor";
import createMentionPlugin from "@draft-js-plugins/mention";
import createSingleLinePlugin from "draft-js-single-line-plugin";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import filter from "lodash/filter";
import includes from "lodash/includes";
import get from "lodash/get";
import PropTypes from "prop-types";
import { speak as a11ySpeak } from "@wordpress/a11y";
import { applyFilters } from "@wordpress/hooks";
import { __, _n, sprintf } from "@wordpress/i18n";
import styled, { withTheme } from "styled-components";

// Internal dependencies.
import { replacementVariablesShape, recommendedReplacementVariablesShape } from "./constants";
import { Mention } from "./Mention";
import { serializeEditor, unserializeEditor, replaceReplacementVariables, serializeSelection } from "./helpers/serialization";
import {
	getTrigger,
	hasWhitespaceAt,
	getCaretOffset,
	getAnchorBlock,
	insertText,
	removeSelectedText,
	moveCaret,
	removeEmojiCompletely,
} from "./helpers/replaceText";
import { selectReplacementVariables } from "./helpers/selection";

/**
 * Needed to avoid styling issues on the settings pages with the
 * suggestions dropdown, because the button labels have a z-index of 3.
 * Added an extra 1000 because with a lot of replacement variables it should
 * stay on top of the #wp-content-editor-tools element, which has a z-index
 * of 1000.
 * When a user has an RTL language the popup suggestion disappears behind the
 * WordPress admin menu. The admin menu has a z-index of 9990. Therefor we add
 * an extra 9990 to our z-index value.
 */
const MentionSuggestionsStyleWrapper = styled.div`
	div {
		z-index: 10995;
	}
	> div {
		max-height: 450px;
		overflow-y: auto;
	}
`;

// Regex sources from https://github.com/facebook/draft-js/issues/1105
const emojiRegExp = new RegExp( "(?:\\p{RI}\\p{RI}|\\p{Emoji}(?:\\p{Emoji_Modifier}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(?:\\u{200D}\\p{Emoji}(?:\\p{Emoji_Modifier}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*)", "gu" );

/**
 * A replacement variable editor. It allows replacements variables as tokens in
 * its editor. It's a small shell on top of Draft.js.
 */
class ReplacementVariableEditorStandalone extends React.Component {
	/**
	 * Constructs the replacement variable editor for use.
	 *
	 * @param {Object}   props                                 The props to instantiate this
	 *                                                         editor with.
	 * @param {string}   props.content                         The content to instantiate this
	 *                                                         editor with.
	 * @param {Object[]} props.replacementVariables            The replacement variables
	 *                                                         that should be available
	 *                                                         in the editor.
	 * @param {Object[]} props.recommendedReplacementVariables The recommended replacement
	 *                                                         variables that should be
	 *                                                         available in the editor.
	 * @param {string}   props.ariaLabelledBy                  The ID of the field this is
	 *                                                         labelled by.
	 * @param {Function} props.onChange                        Called when the content inside
	 *                                                         is edited.
	 * @param {Function} props.onFocus                         Called when this editor is
	 *                                                         focused.
	 * @param {Function} props.onBlur                          Called when this editor is
	 *                                                         unfocused.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		const {
			content: rawContent,
			replacementVariables,
			recommendedReplacementVariables,
		} = this.props;
		const editorState = unserializeEditor( rawContent, replacementVariables );
		const currentReplacementVariables = this.determineCurrentReplacementVariables(
			replacementVariables,
			recommendedReplacementVariables
		);

		this.state = {
			editorState,
			searchValue: "",
			isSuggestionsOpen: false,
			editorKey: this.props.fieldId,
			suggestions: this.mapReplacementVariablesToSuggestions( currentReplacementVariables ),
		};

		/*
		 * To prevent re-rendering the editor excessively we need to set the serialized
		 * content to the passed content. This is possible because the following is
		 * true:
		 * `rawContent === serialize( unserialize( rawContent ) )`
		 */
		this._serializedContent = rawContent;

		this.initializeBinds();
		this.initializeDraftJsPlugins();
	}

	/**
	 * Initializes the scope binding of functions.
	 *
	 * @returns {void}
	 */
	initializeBinds() {
		this.onChange = this.onChange.bind( this );
		this.handleKeyCommand = this.handleKeyCommand.bind( this );
		this.onSearchChange = this.onSearchChange.bind( this );
		this.setEditorRef = this.setEditorRef.bind( this );
		this.handleCopyCutEvent = this.handleCopyCutEvent.bind( this );
		this.debouncedA11ySpeak = debounce( a11ySpeak.bind( this ), 500 );
		this.onSuggestionsOpenChange = this.onSuggestionsOpenChange.bind( this );
	}

	/**
	 * Initializes the Draft.js mention and single line plugins.
	 *
	 * @returns {void}
	 */
	initializeDraftJsPlugins() {
		/*
		 * The mentions plugin is used to autocomplete the replacement variable
		 * names.
		 */
		const mentionsPlugin = createMentionPlugin( {
			mentionTrigger: "%",
			entityMutability: "IMMUTABLE",
			mentionComponent: Mention,
		} );

		const singleLinePlugin = createSingleLinePlugin( {
			stripEntities: false,
		} );

		this.pluginList = {
			mentionsPlugin,
			singleLinePlugin: {
				...singleLinePlugin,
				handleReturn: () => {
				},
			},
		};

		this.pluginList = applyFilters(
			"yoast.replacementVariableEditor.pluginList",
			this.pluginList
		);
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
		const serializedContent = serializeEditor( editorState.getCurrentContent() );

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
	 * @returns {Promise} A promise for when the state is set.
	 */
	onChange( editorState ) {
		return new Promise( ( resolve ) => {
			editorState = replaceReplacementVariables( editorState, this.props.replacementVariables );
			editorState = selectReplacementVariables( editorState, this.state.editorState );

			this.setState( {
				editorState,
			}, () => {
				this.serializeContent( editorState );
				resolve();
			} );
		} );
	}

	/**
	 * Handles a keystroke for the draft js editor.
	 *
	 * @param {string} command The given command key.
	 * @returns {string} If the keystroke is handled or not.
	 */
	handleKeyCommand( command ) {
		if ( command !== "backspace" && command !== "delete" ) {
			return "not-handled";
		}

		let editorState = removeSelectedText( this.state.editorState );
		const content = editorState.getCurrentContent();
		const selection = editorState.getSelection();

		if ( ! selection.isCollapsed() ) {
			return "not-handled";
		}

		const startOffset = selection.getStartOffset();

		if ( startOffset < 0 ) {
			return "not-handled";
		}

		const block = content.getBlockForKey( selection.getStartKey() );
		const blockText = block.getText();

		const startOffsetLocator = ( command === "backspace" ) ? startOffset - 1 : startOffset + 1;

		if ( ( blockText.codePointAt( startOffsetLocator ) || 0 ) <= 127 ) {
			return "not-handled";
		}

		let match;
		if ( command === "backspace" ) {
			match = this.getBackwardMatch( blockText, startOffset );
		} else {
			match = this.getForwardMatch( blockText, startOffset );
		}

		if ( match ) {
			editorState = removeEmojiCompletely( editorState, match, command );

			// Save the editor state and then focus the editor.
			this.onChange( editorState ).then( () => this.focus() );
			// This is really important. If this is removed draft js will not do anything.
			return "handled";
		}

		return "not-handled";
	}

	/**
	 * This goes a character forward at a time until there is no emoji found. When this is the case it returns an array of emojis
	 *
	 * @param {string} blockText The text to check.
	 * @param {int} startOffset the point in the string the caret is currently placed.
	 * @returns {array|null} The list with emojis in the string if they are there.
	 */
	getForwardMatch( blockText, startOffset ) {
		let offset = 1;
		[ 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ].every( ( key ) => {
			const curChar = blockText.slice( startOffset, startOffset + key );
			if ( curChar.match( emojiRegExp ) === null || curChar.match( emojiRegExp ).length > 1 ) {
				return false;
			}
			offset = key;
			return true;
		} );


		const lastChars = blockText.slice( startOffset, startOffset + offset );
		return lastChars.match( emojiRegExp );
	}

	/**
	 * This checks the entire string for all emojis
	 *
	 * @param {string} blockText The text to check.
	 * @param {int} startOffset the point in the string the caret is currently placed.
	 * @returns {array|null} The list with emojis in the string if they are there.
	 */
	getBackwardMatch( blockText, startOffset ) {
		const lastChars = blockText.slice( 0, startOffset );
		return lastChars.match( emojiRegExp );
	}

	/**
	 * In order to have the replaceVariable labels rather than the names in the Mention suggestions,
	 * we map the replaceVar label as the name, and save the original name in replaceName.
	 *
	 * @param {array} replacementVariables The list of replacementVariables.
	 *
	 * @returns {array} The suggestions, a mapped version of the replacementVariables.
	 */
	mapReplacementVariablesToSuggestions( replacementVariables ) {
		return replacementVariables.map( ( variable ) => {
			return {
				...variable,

				// We want to use the nice-name in the suggestion list, which is the label.
				name: variable.label,

				// We save the replacement variable name for later serialization.
				replaceName: variable.name,
			};
		} );
	}

	/**
	 * Filters suggestions based on the search term typed by the user.
	 *
	 * @param {string}   searchValue The search value typed after the mentionTrigger by the user.
	 * @param {Object[]} suggestions The replacement variables to filter.
	 *
	 * @returns {Object[]} A filtered set of suggestions to show to the user.
	 */
	suggestionsFilter( searchValue, suggestions ) {
		const value = searchValue.toLowerCase();

		return suggestions.filter( function( suggestion ) {
			if ( suggestion.hidden ) {
				return false;
			}

			return ! value || suggestion.name.toLowerCase().indexOf( value ) === 0;
		} );
	}

	/**
	 * Determines the current replacement variables to be used.
	 *
	 * When the search value is empty and there are recommended replacement variables:
	 * Try to use the recommended replacement variables.
	 * Otherwise use the normal replacement variables.
	 *
	 * @param {Object[]} replacementVariables            The current replacement variables.
	 * @param {array}    recommendedReplacementVariables The recommended replacement variables.
	 * @param {string}   searchValue                     The current search value.
	 *
	 * @returns {Object[]} The replacement variables to show as suggestions to the user.
	 */
	determineCurrentReplacementVariables( replacementVariables, recommendedReplacementVariables, searchValue = "" ) {
		const useRecommended = searchValue === "" && ! isEmpty( recommendedReplacementVariables );

		if ( useRecommended ) {
			const recommended = filter(
				replacementVariables,
				replaceVar => includes( recommendedReplacementVariables, replaceVar.name )
			);

			// Ensure there are replacement variables we recommend before using them.
			if ( recommended.length !== 0 ) {
				return recommended;
			}
		}

		return replacementVariables;
	}

	/**
	 * Handles a search change in the mentions plugin.
	 *
	 * @param {string} value The search value.
	 *
	 * @returns {void}
	 */
	onSearchChange( { value } ) {
		if ( this.props.onSearchChange ) {
			this.props.onSearchChange( value );
		}

		const recommendedReplacementVariables = this.determineCurrentReplacementVariables(
			this.props.replacementVariables,
			this.props.recommendedReplacementVariables,
			value
		);
		const suggestions = this.mapReplacementVariablesToSuggestions( recommendedReplacementVariables );

		this.setState( {
			searchValue: value,
			suggestions: this.suggestionsFilter( value, suggestions ),
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
	 * Handles open and closing of the suggestions dropdown.
	 *
	 * @param {boolean} isOpen Whether the suggestions should be open.
	 *
	 * @returns {void}
	 */
	onSuggestionsOpenChange( isOpen ) {
		this.setState( { isSuggestionsOpen: isOpen } );
	}

	/**
	 * Announces the search results to assistive technologies using an ARIA live region.
	 *
	 * @returns {void}
	 */
	announceSearchResults() {
		const { suggestions } = this.state;

		if ( suggestions.length ) {
			this.debouncedA11ySpeak(
				sprintf(
					_n(
						"%d result found, use up and down arrow keys to navigate",
						"%d results found, use up and down arrow keys to navigate",
						suggestions.length,
						"wordpress-seo"
					),
					suggestions.length
				),
				"assertive"
			);
		} else {
			this.debouncedA11ySpeak( __( "No results", "wordpress-seo" ), "assertive" );
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
	 * @param {Object} editorRef The editor React reference.
	 *
	 * @returns {void}
	 */
	setEditorRef( editorRef ) {
		this.editor = editorRef;
	}

	/**
	 * Sets the id of the editable div, that represents the actual input of the DraftJS field.
	 *
	 * @returns {void}
	 */
	setEditorFieldId() {
		const editorField = get( this.editor, "editor.editor" );

		editorField.id = this.props.fieldId;
	}

	/**
	 * Triggers the Draft.js mention plugin suggestions autocomplete.
	 *
	 * It does this by inserting the trigger (%) into the editor, replacing the current selection.
	 * Ensures the autocomplete shows by adding spaces around the trigger if needed.
	 *
	 * @returns {void}
	 */
	triggerReplacementVariableSuggestions() {
		// First remove any selected text.
		let editorState = removeSelectedText( this.state.editorState );

		// Get the current block text.
		const selectionState = editorState.getSelection();
		const contentState = editorState.getCurrentContent();
		const blockText = getAnchorBlock( contentState, selectionState ).getText();
		const caretIndex = getCaretOffset( selectionState );

		// Determine the trigger text that is needed to show the replacement variable suggestions.
		const needsPrependedSpace = ! hasWhitespaceAt( blockText, caretIndex - 1 );
		const needsAppendedSpace = ! hasWhitespaceAt( blockText, caretIndex );
		const trigger = getTrigger( needsPrependedSpace, needsAppendedSpace );

		// Insert the trigger.
		editorState = insertText( editorState, trigger );

		// Move the caret if needed.
		if ( needsAppendedSpace ) {
			// The new caret index plus the trigger length, minus the suffix.
			const newCaretIndex = caretIndex + trigger.length - 1;
			editorState = moveCaret( editorState, newCaretIndex );
		}

		// Save the editor state and then focus the editor.
		this.onChange( editorState ).then( () => this.focus() );
	}

	/**
	 * Sets the state of this editor when the incoming content changes.
	 *
	 * @param {Object} prevProps The previous props this component has received.
	 * @param {Object} prevState The previous state this component has been in.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps, prevState ) {
		const { content, replacementVariables, recommendedReplacementVariables } = prevProps;
		const { searchValue } = this.state;
		const nextState = {};
		const nextProps = this.props;
		const isContentChanged = nextProps.content !== this._serializedContent && nextProps.content !== content;
		const isReplacementVariablesChanged = nextProps.replacementVariables !== replacementVariables;
		const newReplacementVariableNames = nextProps.replacementVariables.map( rv => rv.name )
			.filter( rvName => ! replacementVariables.map( rv => rv.name ).includes( rvName ) );
		const isNewReplacementVariableNames = newReplacementVariableNames.some( rvName => content.includes( "%%" + rvName + "%%" ) );

		if ( isContentChanged ) {
			this._serializedContent = nextProps.content;
			nextState.editorState = unserializeEditor( nextProps.content, nextProps.replacementVariables );
		}

		if ( ! isContentChanged && isReplacementVariablesChanged && isNewReplacementVariableNames ) {
			this._serializedContent = nextProps.content;
			nextState.editorState = unserializeEditor( nextProps.content, nextProps.replacementVariables );
		}

		if ( isReplacementVariablesChanged ) {
			const currentReplacementVariables = this.determineCurrentReplacementVariables(
				nextProps.replacementVariables,
				recommendedReplacementVariables,
				searchValue
			);
			nextState.suggestions = this.suggestionsFilter(
				searchValue,
				this.mapReplacementVariablesToSuggestions( currentReplacementVariables )
			);
		}
		if ( isReplacementVariablesChanged || isContentChanged ) {
			this.setState( { ...prevState, ...nextState } );
		}
	}

	/**
	 * Handles browser copy and cut events.
	 *
	 * This method makes sure that the clipboard has the correct content if a user
	 * copies from this DraftJS editor.
	 *
	 * @param {ClipboardEvent} event The triggered clipboard event.
	 * @returns {void}
	 */
	handleCopyCutEvent( event ) {
		const { editorState } = this.state;
		const selection = editorState.getSelection();

		// If this editor is not focused we don't do anything.
		if ( ! selection.getHasFocus() ) {
			return;
		}

		// Use a try-catch to make this fail gracefully on older browsers.
		try {
			const clipboardData = event.clipboardData;
			const contentState = editorState.getCurrentContent();

			const text = serializeSelection( contentState, selection );

			clipboardData.setData( "text/plain", text );

			/*
			 * This is at the end because we only want to prevent the default if we
			 * succeeded in altering the clipboard contents.
			 */
			event.preventDefault();
		} catch ( error ) {
			console.error( "Couldn't copy content of editor to clipboard, defaulting to browser copy behavior." );
			console.error( "Original error: ", error );
		}
	}

	/**
	 * Sets up event listeners this component needs.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		document.addEventListener( "copy", this.handleCopyCutEvent );
		document.addEventListener( "cut", this.handleCopyCutEvent );
		this.setEditorFieldId();
	}

	/**
	 * Cancels the debounced call to A11ySpeak and removes event listeners.
	 *
	 * @returns {void}
	 */
	componentWillUnmount() {
		this.debouncedA11ySpeak.cancel();
		document.removeEventListener( "copy", this.handleCopyCutEvent );
		document.removeEventListener( "cut", this.handleCopyCutEvent );
	}

	/**
	 * Renders the editor including DraftJS and the mentions plugin.
	 *
	 * @returns {ReactElement} The rendered element.
	 */
	render() {
		const { MentionSuggestions } = this.pluginList.mentionsPlugin;
		const { onFocus, onBlur, ariaLabelledBy, placeholder, theme, isDisabled, fieldId } = this.props;
		const { editorState, suggestions, isSuggestionsOpen } = this.state;

		return (
			<React.Fragment>
				<Editor
					key={ this.state.editorKey }
					textDirectionality={ theme.isRtl ? "RTL" : "LTR" }
					editorState={ editorState }
					handleKeyCommand={ this.handleKeyCommand }
					onChange={ this.onChange }
					onFocus={ onFocus }
					onBlur={ onBlur }
					plugins={ Object.values( this.pluginList ) }
					ref={ this.setEditorRef }
					stripPastedStyles={ true }
					ariaLabelledBy={ ariaLabelledBy }
					placeholder={ placeholder }
					spellCheck={ true }
					readOnly={ isDisabled }
				/>

				{ applyFilters(
					"yoast.replacementVariableEditor.additionalPlugins",
					<React.Fragment />,
					this.pluginList,
					fieldId
				) }

				<MentionSuggestionsStyleWrapper>
					<MentionSuggestions
						onSearchChange={ this.onSearchChange }
						suggestions={ suggestions }
						onOpenChange={ this.onSuggestionsOpenChange }
						open={ isSuggestionsOpen }
					/>
				</MentionSuggestionsStyleWrapper>
			</React.Fragment>
		);
	}
}

ReplacementVariableEditorStandalone.propTypes = {
	content: PropTypes.string.isRequired,
	replacementVariables: replacementVariablesShape.isRequired,
	recommendedReplacementVariables: recommendedReplacementVariablesShape,
	ariaLabelledBy: PropTypes.string.isRequired,
	onSearchChange: PropTypes.func,
	onChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	theme: PropTypes.object,
	placeholder: PropTypes.string,
	fieldId: PropTypes.string.isRequired,
	isDisabled: PropTypes.bool,
};

ReplacementVariableEditorStandalone.defaultProps = {
	onSearchChange: null,
	onFocus: () => {},
	onBlur: () => {},
	placeholder: "",
	theme: { isRtl: false },
	recommendedReplacementVariables: [],
	isDisabled: false,
};

export { ReplacementVariableEditorStandalone as ReplacementVariableEditorStandaloneInnerComponent };
export default withTheme( ReplacementVariableEditorStandalone );
