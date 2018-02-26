/* External dependencies */
import React, { Component } from "react";
import SnippetPreview from "./SnippetPreview";
import styled from "styled-components";

const Container = styled.div`
	background-color: white;
	margin: 5em auto 0; 
`;

export default class SnippetPreviewExample extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			hoveredField: "",
		};

		this.onMouseOver = this.onMouseOver.bind( this );
		this.onMouseLeave = this.onMouseLeave.bind( this );
	}

	onMouseOver( field ) {
		if ( this.state.hoveredField === field ) {
			return;
		}

		this.setState( {
			hoveredField: field,
		} );
	}

	onMouseLeave( field ) {
		if ( field && this.state.hoveredField !== field ) {
			return;
		}

		this.setState( {
			hoveredField: "",
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
		const snippetData = {
			title: "Welcome to the Gutenberg Editor - Local WordPress Dev. Snippet Title Snippet Title Snippet Title Snippet Title Snippet Title Snippet Title Snippet Title Snippet Title Snippet Title Snippet Title Snippet Title Snippet Title",
			url: "local.wordpress.test/welcome-to-the-gutenberg-editor-2/",
			description: "Of Mountains & Printing Presses The goal of this new editor is to make adding rich content to WordPress simple and enjoyable. This whole post is composed of. Of Mountains & Printing Presses The goal of this new editor is to make adding rich content to WordPress simple and enjoyable. This whole post is composed of. Of Mountains & Printing Presses The goal of this new editor is to make adding rich content to WordPress simple and enjoyable. This whole post is composed of",
			keyword: "editor",
			date: "Jan 8, 2018",
			locale: "en_US",
			onClick( type ) {
				console.log( "clicked:", type );
			},
			hoveredField: this.state.hoveredField,
			activeField: "description",
			onMouseOver: this.onMouseOver,
			onMouseLeave: this.onMouseLeave,
		};

		let mobileSnippetData = Object.assign( {}, snippetData, { mode: "mobile" } );

		return <Container>
			<div>
				<SnippetPreview {...snippetData} />
			</div>
			<div style={ { margin: "5em 0" } }>
				<SnippetPreview {...mobileSnippetData} />
			</div>
		</Container>;
	}
}
