// External dependencies.
import { find, get } from "lodash-es";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

// Internal dependencies.
import Collapsible from "./Collapsible";

const Container = styled.div`
	margin-bottom: 16px;
`;

function createMarkedText( text, markings ) {
	markings.forEach( ( marking ) => {
		text = marking.applyWithReplace( text );
	} );

	return { __html: text };
}

function Markings( { results, activeMarker, text } ) {
	if ( activeMarker === "" ) {
		return "No marker activated";
	}

	const activeResults = find( results, [ "_identifier", activeMarker ] );
	const activeMarkings = get( activeResults, "marks", [] );

	const markedText = createMarkedText( text, activeMarkings );

	return <Fragment>
		<Container dangerouslySetInnerHTML={ markedText } />
		<Collapsible title="Raw markings" initialIsOpen={ false }>{ markedText.__html }</Collapsible>
	</Fragment>;
}

export default connect( ( state ) => {
	return {
		results: [ ...state.results.seo[ "" ].results, ...state.results.readability.results ],
		activeMarker: state.results.activeMarker,
		text: state.paper.text,
	};
} )( Markings );
