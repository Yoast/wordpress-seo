import React, { Fragment } from "react";
import { connect } from "react-redux";
import { find, get } from "lodash-es";
import styled from "styled-components";

const ContainerTop = styled.div`
	padding-bottom: 6px;
	border-bottom: 1px solid #eee;
`;

const ContainerBottom = styled.div`
	padding-top: 6px;
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
		<ContainerTop dangerouslySetInnerHTML={ markedText } />
		<ContainerBottom>{ markedText.__html }</ContainerBottom>
	</Fragment>;
}

export default connect( ( state ) => {
	return {
		results: [ ...state.results.seo[ "" ].results, ...state.results.readability.results ],
		activeMarker: state.results.activeMarker,
		text: state.paper.text,
	};
} )( Markings );
