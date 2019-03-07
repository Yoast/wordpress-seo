import { SET_PROMINENT_WORDS, setProminentWords } from "../insights";

describe( "setProminentWords action creator", function() {
	it( "creates the setProminentWords action", function() {
		const prominentWords = [ "prominent word 1", "prominent word 2", "prominent word 3",
			"prominent word 4", "prominent word 5", "prominent word 6" ];

		const expected = {
			type: SET_PROMINENT_WORDS,
			prominentWords: prominentWords,
		};
		const actual = setProminentWords( prominentWords );
		expect( actual ).toEqual( expected );
	} );
} );
