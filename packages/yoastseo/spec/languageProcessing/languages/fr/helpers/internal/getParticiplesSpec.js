import getParticiples from "../../../../../../src/languageProcessing/languages/fr/helpers/internal/getParticiples";

describe( "Test for matching French participles", function() {
	it( "returns matched regular participles.", function() {
		const clauseText = "fut remarquée par un agent de théâtre.";
		const foundParticiples = getParticiples( clauseText );
		expect( foundParticiples ).toEqual( [ "remarquée" ] );
	} );

	it( "returns matched irregular participles.", function() {
		const clauseText = "fut dit sans malice.";
		const foundParticiples = getParticiples( clauseText );
		expect( foundParticiples ).toEqual( [ "dit" ] );
	} );

	it( "returns matched irregular participles with irregular conjugation pattern.", function() {
		const clauseText = "était mû par un désir puissant.";
		const foundParticiples = getParticiples( clauseText );
		expect( foundParticiples ).toEqual( [ "mû" ] );
	} );

	it( "returns matched irregular participles ending in -s.", function() {
		const clauseText = "été promise à maintes reprises.";
		const foundParticiples = getParticiples( clauseText );
		expect( foundParticiples ).toEqual( [ "été", "promise", "reprises" ] );
	} );

	it( "returns an empty array when there is no participle", function() {
		const sentencePartText = "Je voulais vous demander pardon.";
		const foundParticiples = getParticiples( sentencePartText );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
