// External dependencies.
import React, { Component } from "react";
import styled from "styled-components";

// Internal dependencies.
import KeywordInput from "../composites/Plugin/Shared/components/KeywordInput";
import SynonymsSection from "../composites/Plugin/Synonyms/components/SynonymsSection";

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
