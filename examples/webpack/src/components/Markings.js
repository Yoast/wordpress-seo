import React, { Fragment } from "react";
import { connect } from "react-redux";
import { find } from "lodash-es";

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

	const markedText = createMarkedText( text, activeMarkings );

	return <Fragment>
		<div dangerouslySetInnerHTML={ markedText } />
		<div>{ markedText.__html }</div>
	</Fragment>;
}

export default connect( ( state ) => {
	return {
		results: [ ...state.results.seo[ "" ].results, ...state.results.readability.results ],
		activeMarker: state.results.activeMarker,
		text: state.paper.text,
	};
} )( Markings );
