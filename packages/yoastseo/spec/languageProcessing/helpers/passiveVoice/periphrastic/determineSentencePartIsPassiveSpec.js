import determineSentencePartIsPassive
	from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/determineSentencePartIsPassive";
import Participle from "../../../../../src/values/Participle";

// eslint-disable-next-line require-jsdoc
const MockParticiples1 = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	this.setSentencePartPassiveness( true );
};
require( "util" ).inherits( MockParticiples1, Participle );

// eslint-disable-next-line require-jsdoc
const MockParticiples2 = function( participle, sentencePart, attributes ) {
	Participle.call( this, participle, sentencePart, attributes );
	this.setSentencePartPassiveness( false );
};
require( "util" ).inherits( MockParticiples2, Participle );

describe( "Tests if the participles make the sentence part passive", function() {
	it( "returns true if the sentence part is passive", function() {
		const Participles = [
			new MockParticiples1( "gewerkt", "Het werd gewerkt.", { auxiliaries: [ "werd" ], type: "" } ),
			new MockParticiples1( "toegevoegd", "Het werd toegevoegd.", { auxiliaries: [ "werd" ], type: "" } ),
		];
		expect( determineSentencePartIsPassive( Participles ) ).toBe( true );
	} );
	it( "returns false if the sentence part is not passive", function() {
		const Participles = [
			new MockParticiples2( "gewerkt", "Het gewerkt.", { auxiliaries: [ "werd" ], type: "" } ),
			new MockParticiples2( "toegevoegd", "Het toegevoegd.", { auxiliaries: [ "werd" ], type: "" } ),
		];
		expect( determineSentencePartIsPassive( Participles ) ).toBe( false );
	} );
} );
