// External dependencies.
import React, { Component } from "react";
import styled from "styled-components";
import debounce from "lodash/debounce";

// Internal dependencies.
import KeywordInput from "../composites/Plugin/Shared/components/KeywordInput";
import SynonymsSection from "../composites/Plugin/Synonyms/components/SynonymsSection";

const Container = styled.div`
	background-color: white;
	margin: 5em auto 0;
	padding: 10px;
	display: flex;
	flex-direction: column;
	width: 512px;
`;

export default class KeywordExample extends Component {
	/**
	 * Renders an example of how to use the keyword inputs.
	 *
	 * @returns {ReactElement} The rendered keyword example.
	 */

	constructor( props ) {
		super( props );

		this.state = {
			keyword: "myKeywordo",
		};

		this.updateKeyword = this.updateKeyword.bind( this );
	}

	updateKeyword( event ) {
		this.setState( {
			keyword: event,
		} );
	}


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
					onChange={ synonyms => console.log( 'SynonymsField change event', synonyms ) }
				    synonyms=""
				/>
			</Container>
		);
	}
}
