// External dependencies.
import React, { Component } from "react";
import styled from "styled-components";
import debounce from "lodash/debounce";

import { assessments } from "yoastseo";
const { MetaDescriptionLengthAssessment } = assessments.seo;

// Internal dependencies.
import SnippetEditor from "../composites/Plugin/SnippetEditor/components/SnippetEditor";

const Container = styled.div`
	background-color: white;
	margin: 5em auto 0;
	padding: 0 0 10px;
`;

const replacementVariables = [
	{
		name: "title",
		label: "Title",
		value: "Title",
		description: "This is the title of your post",
	},
	{
		name: "post_type",
		label: "Post type",
		value: "Gallery",
		description: "This is the post type of your post",
	},
	{
		name: "sep",
		label: "Separator",
		value: " - ",
		description: "A separator that clarifies your search result snippet",
	},
	{
		name: "term404",
		label: "Error 404 slug",
		value: "Error 404 slug",
		description: "The slug which caused the error 404",
	},
];
const recommendedReplacementVariables = [
	replacementVariables[ 0 ].name,
	replacementVariables[ 1 ].name,
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

		const descriptionLengthAssessment = new MetaDescriptionLengthAssessment();
		this.maximumMetaDescriptionLength = descriptionLengthAssessment.getMaximumLength();

		this.state = {
			title: "Welcome to the Gutenberg Editor - Local WordPress Dev. Snippet Title Snippet" +
			" Snippet: %%snippet%% Title: %%title%% Manual: %%snippet_manual%% Type: %%post_type%%" +
			" %%these%% %%are%% %%not%% %%tags%% and throw in some % here %%%%%%% and %%there too%%",
			url: "https://local.wordpress.test/welcome-to-the-gutenberg-editor-2/",
			slug: "welcome-to-the-gutenberg-editor-2",
			description: "Merci, merçi, Of Mountains & Printing Presses The goal of this new editor is to make" +
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
			keyword: "merci",
			date: "Jan 8, 2018",
			locale: "fr",
			onClick( type ) {
				// eslint-disable-next-line no-console
				console.log( "clicked:", type );
			},
			breadcrumbs: [ "hallo", "is", "it", "me", "you" ],
			isAmp: true,
			isOpen: false,
			currentTitleLength: 0,
			currentDescriptionLength: 0,
		};

		this.onChangedData = debounce( this.onChangedData.bind( this ), 150 );
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

		let titleLengthProgress = {
			max: 600,
			actual: this.state.currentTitleLength,
			score: this.state.currentTitleLength > 300 ? 9 : 6,
		};

		let descriptionLengthProgress = {
			max: this.maximumMetaDescriptionLength,
			actual: this.state.currentDescriptionLength,
			score: this.state.currentDescriptionLength > 120 ? 9 : 3,
		};

		return <Container>
			<SnippetEditor
				{ ...this.state }
				data={ data }
				baseUrl="https://local.wordpress.test/"
				onChange={ this.onChangedData }
				replacementVariables={ replacementVariables }
				recommendedReplacementVariables={ recommendedReplacementVariables }
				titleLengthProgress={ titleLengthProgress }
				descriptionLengthProgress={ descriptionLengthProgress }
			/>
		</Container>;
	}
}
