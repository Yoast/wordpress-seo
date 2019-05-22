// External dependencies.
import { HelpText, SynonymsInput } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";
import noop from "lodash/noop";
import React, { Component } from "react";
import styled from "styled-components";
import { KeywordInput } from "yoast-components";

const HelpTextLink = makeOutboundLink();

const Container = styled.div`
	background-color: white;
	margin: 5em auto 0;
	padding: 10px;
	display: flex;
	flex-direction: column;
	width: 248px;
`;

const KeywordInputContainer = styled.div`
	margin-bottom: 1em;
`;

/**
 * The keyword example class.
 */
export default class KeywordExample extends Component {
	/**
	 * Constructs a keywordInput example.
	 *
	 * @param {Object} props The props for the snippet preview example.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			keyword: "special",
			additionalKeyword: "additional",
			synonyms: "",
		};

		this.updateKeyword = this.updateKeyword.bind( this );
		this.updateAdditionalKeyword = this.updateAdditionalKeyword.bind( this );
		this.updateSynonyms = this.updateSynonyms.bind( this );
		this.updateSynonymsInput = this.updateSynonymsInput.bind( this );
	}

	/**
	 * Updates the keyword.
	 *
	 * @param {string} newKeyword The new keyword.
	 *
	 * @returns {void}
	 */
	updateKeyword( newKeyword ) {
		this.setState( {
			keyword: newKeyword,
		} );
	}

	/**
	 * Updates the additional keyword.
	 *
	 * @param {string} newKeyword The new additional keyword.
	 *
	 * @returns {void}
	 */
	updateAdditionalKeyword( newKeyword ) {
		this.setState( {
			additionalKeyword: newKeyword,
		} );
	}

	/**
	 * Updates the synonyms.
	 *
	 * @param {string} newSynonyms The new synonyms.
	 *
	 * @returns {void}
	 */
	updateSynonyms( newSynonyms ) {
		this.setState( {
			synonyms: newSynonyms,
		} );
	}

	/**
	 * Updates the synonyms.
	 *
	 * @param {object} event The new synonyms.
	 *
	 * @returns {void}
	 */
	updateSynonymsInput( event ) {
		this.setState( {
			synonyms: event.target.value,
		} );
	}

	/**
	 * Renders an example of how to use the keyword input.
	 *
	 * @returns {ReactElement} The rendered keyword input.
	 */
	render() {
		return (
			<Container>
				<HelpText>
					{ "Enter the search term you'd like this post to be found with and see how it would rank." }{ " " }
					<HelpTextLink href="https://yoa.st/">
						Learn more about the Content Analysis Tool.
					</HelpTextLink>
				</HelpText>
				<KeywordInputContainer>
					<KeywordInput
						id="focus-keyword"
						label="focus-keyword"
						onChange={ this.updateKeyword }
						keyword={ this.state.keyword }
						onRemoveKeyword={ noop }
					/>
				</KeywordInputContainer>
				<KeywordInput
					id="additional-focus-keyword"
					label="additional-focus-keyword"
					onChange={ this.updateAdditionalKeyword }
					keyword={ this.state.additionalKeyword }
					onRemoveKeyword={ () => {
						// eslint-disable-next-line no-console
						console.log( "CLOSED!" );
					} }
				/>
				<SynonymsInput
					id="synonyms"
					label="Synonyms:"
					onChange={ this.updateSynonymsInput }
					value={ this.state.synonyms }
					explanationText="This is a fine explanation"
				/>
			</Container>
		);
	}
}
