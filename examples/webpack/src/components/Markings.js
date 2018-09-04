import React, { Fragment } from "react";
import { connect } from "react-redux";
import find from "lodash/find";

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
	const activeMarkings = activeResults.marks;

	return <Fragment>
		<div dangerouslySetInnerHTML={ createMarkedText( text, activeMarkings ) } />
		<div>{ text }</div>
	</Fragment>;
}

export default connect( ( state ) => {
	return {
		results: [ ...state.results.seo, ...state.results.readability ],
		activeMarker: state.results.activeMarker,
		text: state.paper.text,
	};
} )( Markings );
