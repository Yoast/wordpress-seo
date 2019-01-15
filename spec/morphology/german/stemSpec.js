import stem from "../../../src/morphology/german/stem";

const nounsToStem = [
	[ "Studenten", "Student" ],
	[ "Häuser", "Häus" ],
	[ "Stadt", "Stadt" ],
	[ "Städten", "Städt" ],
	[ "Hauptstädten", "Hauptstädt" ],
	[ "Krankenhäuser", "Krankenhäus" ],
	// [ "größte", "größ" ],
];

describe( "Test for stemming German words", () => {
	it( "stems German nouns", () => {
		nounsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ] ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
