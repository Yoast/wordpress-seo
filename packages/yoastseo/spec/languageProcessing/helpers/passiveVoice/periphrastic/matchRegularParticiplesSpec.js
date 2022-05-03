import matchRegularParticiples
	from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/matchRegularParticiples";

describe( "Tests if a word is a regular participle.", function() {
	it( "Returns the word if it is a regular participle.", function() {
		const regexes = [
			/^(ge|be|ont|ver|her|er)\S+([dt])($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig,
			/^(aan|af|bij|binnen|los|mee|na|neer|om|onder|samen|terug|tegen|toe|uit|vast)(ge)\S+([dtn])($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig,
		];
		expect( matchRegularParticiples( "verkocht", regexes ) ).toEqual( [ "verkocht" ] );
		expect( matchRegularParticiples( "toegevoegd", regexes ) ).toEqual( [ "toegevoegd" ] );
	} );
	it( "Returns an empty array if a word is not a regular participle", function() {
		const regex =  [ /\w+ed($|[ \n\r\t.,'()"+\-;!?:/»«‹›<>])/ig ];
		expect( matchRegularParticiples( "gewerkt", regex ) ).toEqual( [] );
	} );
} );
