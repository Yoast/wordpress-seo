import React from "react";
import styled from "styled-components";
import { injectIntl, intlShape, defineMessages, FormattedMessage } from "react-intl";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, { defaultSuggestionsFilter } from "draft-js-mention-plugin";
import { serializeEditor, unserializeEditor } from "../serialization";

const messages = defineMessages( {
	seoTitle: {
		id: "snippetEditor.seoTitle",
		defaultMessage: "SEO title",
	},
	slug: {
		id: "snippetEditor.slug",
		defaultMessage: "Slug",
	},
	metaDescription: {
		id: "snippetEditor.metaDescription",
		defaultMessage: "Meta description",
	},
} );

class SnippetEditor extends React.Component {
	constructor( props ) {
		super( props );

		let rawData = unserializeEditor( "%%title%% %%post_type%% test123 fa" );

		let contentState = convertFromRaw( rawData );

		this.state = {
			titleEditorState: EditorState.createWithContent( contentState ),
			descriptionEditorState: EditorState.createEmpty(),
			replaceVars: props.replaceVars,
		};

		this.onTitleChange = this.onTitleChange.bind( this );
		this.onDescriptionChange = this.onDescriptionChange.bind( this );
		this.onSearchChange = this.onSearchChange.bind( this );
		this.onAddMention = this.onAddMention.bind( this );

		this.mentionsPlugin = createMentionPlugin( {
			mentionTrigger: "%%",
			entityMutability: "IMMUTABLE",
		} );
	}

	onTitleChange( editorState ) {
		console.log( "BLOCKS =", convertToRaw( editorState.getCurrentContent() ) );
		console.log( JSON.stringify( convertToRaw( editorState.getCurrentContent() ) ) );

		const rawData = convertToRaw( editorState.getCurrentContent() );

		console.log( "SERIALIZED", serializeEditor( rawData ) );

		this.setState( {
			titleEditorState: editorState,
		} );
	}

	onDescriptionChange( editorState ) {
		this.setState( {
			descriptionEditorState: editorState,
		} );
	}

	onSearchChange( { value } ) {
		this.setState( {
			replaceVars: defaultSuggestionsFilter( value, this.props.replaceVars ),
		} );
	}

	onAddMention() {
		console.log( "onAddMention", arguments );
	}

	focus() {
		this.editor.focus();
	}

	render() {
		const { MentionSuggestions } = this.mentionsPlugin;

		console.log( this.mentionsPlugin, MentionSuggestions );

		const {
			intl,
		} = this.props;

		const {
			titleEditorState,
			descriptionEditorState,
		} = this.state;


		return (
			<div>
				<div>
					<label>{ intl.formatMessage( messages.seoTitle ) }</label>
					<Editor
						editorState={ titleEditorState }
						onChange={ this.onTitleChange }
						plugins={ [ this.mentionsPlugin ] }
						ref={( element ) => {
							this.editor = element;
						}}
					/>
					<MentionSuggestions
						onSearchChange={ this.onSearchChange }
						suggestions={ this.state.replaceVars }
						onAddMention={ this.onAddMention }
					/>
				</div>
			</div>
		);
	}
}

export default injectIntl( SnippetEditor );
