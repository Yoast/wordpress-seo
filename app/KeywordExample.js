// External dependencies.
import React, { Component } from "react";
import styled from "styled-components";

// Internal dependencies.
import KeywordInput from "../composites/Plugin/Shared/components/KeywordInput";
import SynonymsSection from "../composites/Plugin/Synonyms/components/SynonymsSection";

const Container = styled.div`
	background-color: white;
	margin: 5em auto 0;
	padding: 0 0 10px;
	display: flex;
	flex-direction: column;
`;

export default class KeywordExample extends Component {
	/**
	 * Renders an example of how to use the keyword inputs.
	 *
	 * @returns {ReactElement} The rendered keyword example.
	 */
	render() {
		return (
			<Container>
				<KeywordInput
					id="focus-keyword"
					label={ "Focus keyword"}
				/>

				<SynonymsSection
					label={ "Keyword synonyms" }
					onChange={ synonyms => console.log( 'SynonymsField change event', synonyms ) }
				/>
			</Container>
		);
	}
}
