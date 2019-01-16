import stem from "../../../src/morphology/german/stem";

const nounsToStem = [
	[ "studenten", "student" ],
	[ "häuser", "häus" ],
	[ "stadt", "stadt" ],
	[ "städten", "städt" ],
	[ "hauptstädten", "hauptstädt" ],
	[ "krankenhäuser", "krankenhäus" ],
];

describe( "Test for stemming German words", () => {
	it( "stems German nouns", () => {
		nounsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ] ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
