// External dependencies.
import React, { Component } from "react";
import styled from "styled-components";

// Internal dependencies.
import KeywordInput from "../composites/Plugin/Shared/components/KeywordInput";
import SynonymsSection from "../composites/Plugin/Synonyms/components/SynonymsSection";
import HelpText from "../composites/Plugin/Shared/components/HelpText.js";
import { makeOutboundLink } from "../utils/makeOutboundLink";

const HelpTextLink = makeOutboundLink();

const Container = styled.div`
	background-color: white;
	margin: 5em auto 0;
	padding: 10px;
	display: flex;
	flex-direction: column;
	width: 248px;
`;

export default class KeywordExample extends Component {

	/**
	 * Constructs a keywordInput example
	 *
	 * @param {Object} props The props for the snippet preview example.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			keyword: "special",
		};

		this.updateKeyword = this.updateKeyword.bind( this );
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
	 * Renders an example of how to use the keyword input.
	 *
	 * @returns {ReactElement} The rendered keyword input.
	 */
	render() {
		return (
			<Container>
				<HelpText text={ [
					"Enter the search term you'd like this post to be found with and see how it would rank. ",
					<HelpTextLink key="1" href="https://yoa.st/" target="_blank" rel="noopener">
						Learn more about the Content Analysis Tool.
					</HelpTextLink>,
				] }/>
				<KeywordInput
					id="focus-keyword"
					label={ "Focus keyword"}
					onChange={ this.updateKeyword }
					keyword={ this.state.keyword }
				/>

				<SynonymsSection
					label={ "Keyword synonyms" }
					onChange={ synonyms => console.log( "SynonymsField change event", synonyms ) }
					synonyms=""
				/>
			</Container>
		);
	}
}
