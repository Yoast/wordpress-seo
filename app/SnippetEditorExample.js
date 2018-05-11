// External dependencies.
import React, { Component } from "react";
import styled from "styled-components";
import debounce from "lodash/debounce";

// Internal dependencies.
import SnippetEditor from "../composites/Plugin/SnippetEditor/components/SnippetEditor";

const Container = styled.div`
	background-color: white;
	margin: 5em auto 0;
`;

const replacementVariables = [
	{
		name: "title",
		value: "Title",
	},
	{
		name: "post_type",
		value: "Gallery",
	},
	{
		name: "snippet",
		value: "The snippet of your post.",
	},
	{
		name: "snippet_manual",
		value: "The manual snippet of your post.",
	},
];

export default class SnippetEditorExample extends Component {
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
			breadcrumbs: [ "hallo", "is", "it", "me", "you" ],
			isAmp: true,
			isEditorOpen: false,
			currentTitleLength: 0,
			currentDescriptionLength: 0,
		};

		this.onMouseOver = this.onMouseOver.bind( this );
		this.onMouseLeave = this.onMouseLeave.bind( this );
		this.onChangedData = debounce( this.onChangedData.bind( this ), 150 );
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

	/**
	 * Handles a piece of changed data.
	 *
	 * @param {string} key The key for this data.
	 * @param {*} data The data itself.
	 *
	 * @returns {void}
	 */
	onChangedData( key, data ) {
		this.setState( {
			[ key ]: data,
		} );
	}

	/**
	 * Renders an example of how to use the snippet editor.
	 *
	 * @returns {ReactElement} The rendered snippet editor.
	 */
	render() {
		const data = {
			title: this.state.title,
			url: this.state.url,
			description: this.state.description,
			slug: this.state.slug,
		};

		let titleLengthAssessment = {
			max: 600,
			actual: this.state.currentTitleLength,
			score: this.state.currentTitleLength > 300 ? 9 : 6,
		};

		let descriptionLengthAssessment = {
			max: 320,
			actual: this.state.currentDescriptionLength,
			score: this.state.currentDescriptionLength > 160 ? 9 : 3,
		};

		return <Container>
			<SnippetEditor
				{ ...this.state }
				data={ data }
				baseUrl="https://local.wordpress.test/"
				onChange={ this.onChangedData }
				replacementVariables={ replacementVariables }
				titleLengthAssessment={ titleLengthAssessment }
				descriptionLengthAssessment={ descriptionLengthAssessment }
				keyword="keyword"
			/>

			<h2>Test Sliders</h2>
			<input
				type="range"
				min={ 0 }
				max={ 600 }
				onChange={ ( event ) => this.onChangedData( "currentTitleLength", parseInt( event.target.value, 10 ) ) }
			/>
			<input
				type="range"
				min={ 0 }
				max={ 320 }
				onChange={ ( event ) => this.onChangedData( "currentDescriptionLength", parseInt( event.target.value, 10 ) ) }
			/>
		</Container>;
	}
}
