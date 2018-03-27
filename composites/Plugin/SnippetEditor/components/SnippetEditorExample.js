/* External dependencies */
import React, { Component } from "react";
import styled from "styled-components";
import SnippetEditor from "./SnippetEditor";

const Container = styled.div`
	background-color: white;
	margin: 5em auto 0; 
`;

export default class SnippetPreviewExample extends Component {
	/**
	 * Constructs a snippet preview example
	 *
	 * @param {Object} props The props for the snippet preview example.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			title: "Welcome to the Gutenberg Editor - Local WordPress Dev. Snippet Title Snippet" +
			" Title Snippet Title Snippet Title Snippet Title Snippet Title Snippet Title Snippet" +
			" Title Snippet Title Snippet Title Snippet Title Snippet Title",
			url: "https://local.wordpress.test/welcome-to-the-gutenberg-editor-2/",
			slug: "welcome-to-the-gutenberg-editor-2",
			description: "Of Mountains & Printing Presses The goal of this new editor is to make" +
			" adding rich content to WordPress simple and enjoyable. This whole post is composed" +
			" of. Of Mountains & Printing Presses The goal of this new editor is to make adding" +
			" rich content to WordPress simple and enjoyable. This whole post is composed of. Of" +
			" Mountains & Printing Presses The goal of this new editor is to make adding rich" +
			" content to WordPress simple and enjoyable. This whole post is composed of Of Mountains" +
			" & Printing Presses The goal of this new editor is to make adding rich content to" +
			" WordPress simple and enjoyable. This whole post is composed of. Of Mountains & Printing" +
			" Presses The goal of this new editor is to make adding rich content to WordPress" +
			" simple and enjoyable. This whole post is composed of. Of Mountains & Printing Presses" +
			" The goal of this new editor is to make adding rich content to WordPress simple and" +
			" enjoyable. This whole post is composed of",
			keyword: "editor",
			date: "Jan 8, 2018",
			locale: "en_US",
			onClick( type ) {
				// eslint-disable-next-line no-console
				console.log( "clicked:", type );
			},
			hoveredField: "",
			activeField: "description",
			breadcrumbs: [ "hallo", "is", "it", "me", "you" ],
			isAmp: true,
			isEditorOpen: false,
		};

		this.onMouseOver = this.onMouseOver.bind( this );
		this.onMouseLeave = this.onMouseLeave.bind( this );
		this.onChangedData = this.onChangedData.bind( this );
		this.onOpenEditor = this.onOpenEditor.bind( this );
		this.onClose = this.onClose.bind( this );
	}

	/**
	 * Handles the on mouse over for a field.
	 *
	 * @param {string} field The field that is hovered over.
	 *
	 * @returns {void}
	 */
	onMouseOver( field ) {
		if ( this.state.hoveredField === field ) {
			return;
		}

		this.setState( {
			hoveredField: field,
		} );
	}

	/**
	 * Handles the on mouse leave for a field.
	 *
	 * @param {string} field The field that is left.
	 *
	 * @returns {void}
	 */
	onMouseLeave( field ) {
		if ( field && this.state.hoveredField !== field ) {
			return;
		}

		this.setState( {
			hoveredField: "",
		} );
	}

	/**
	 * Handles switching the mode.
	 *
	 * @param {string} mode The mode to switch to.
	 *
	 * @returns {void}
	 */
	switch( mode ) {
		this.setState( {
			mode,
		} );
	}

	/**
	 * Updates title in the state based on an event.
	 *
	 * @param {Object} event The event that occurred.
	 *
	 * @returns {void}
	 */
	updateTitle( event ) {
		this.setState( {
			title: event.target.value,
		} );
	}

	/**
	 * Updates the URL in the state based on an event.
	 *
	 * @param {Object} event The event that occurred.
	 *
	 * @returns {void}
	 */
	updateUrl( event ) {
		this.setState( {
			url: event.target.value,
		} );
	}

	onChangedData( field, data ) {
		this.setState( {
			[ field ]: data,
		} );
	}

	onClose() {
		this.setState( {
			isEditorOpen: false,
		} );
	}

	onOpenEditor() {
		this.setState( {
			isEditorOpen: true,
		} );
	}

	/**
	 * Renders the SnippetPreview component.
	 *
	 * @param {string} title                  The title tag.
	 * @param {string} url                    The URL of the page for which to generate a snippet.
	 * @param {string} description            The meta description.
	 * @param {string} keyword                The keyword for the page.
	 * @param {string} isDescriptionGenerated Whether the description was generated.
	 * @param {string} locale                 The locale of the page.
	 *
	 * @returns {ReactElement} The SnippetPreview component.
	 */
	render() {
		const data = {
			title: this.state.title,
			url: this.state.url,
			description: this.state.description,
			slug: this.state.slug,
		};

		let props = Object.assign( {}, this.state, {
			data: data,
			onChange: this.onChangedData,
			onCloseEditor: this.onClose,
			onOpenEditor: this.onOpenEditor,
			isEditorOpen: this.state.isEditorOpen,
			onMouseOver: this.onMouseOver,
			onMouseLeave: this.onMouseLeave,
		} );

		return <Container>
			<SnippetEditor
				{ ...props }
			/>
		</Container>;
	}
}
