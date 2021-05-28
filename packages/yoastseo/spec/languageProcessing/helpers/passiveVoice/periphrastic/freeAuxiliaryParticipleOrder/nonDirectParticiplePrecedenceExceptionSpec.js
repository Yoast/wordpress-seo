import nonDirectParticiplePrecedenceException
	from "../../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/freeAuxiliaryParticipleOrder/nonDirectParticiplePrecedenceException";

describe( "Tests whether there are any exception words in between the auxiliary and participle.", function() {
	it( "Returns true if a word from the 'cannot be between passive auxiliary and participle' exception list " +
		"appears anywhere in between the last (closest to participle) auxiliary and the participle.", function() {
		expect( nonDirectParticiplePrecedenceException( "To są nasze znalezione skarby.", "znalezione", [ "są" ], [ "nasze" ] ) ).toEqual( true );
	} );

	it( "Returns false if a word from the 'cannot be between passive auxiliary and participle' exception list " +
		" doesn't appear anywhere in between the last (closest to participle) auxiliary and the participle.", function() {
		expect( nonDirectParticiplePrecedenceException( "To są znalezione skarby nasze.", "znalezione", [ "są" ], [ "nasze" ] ) ).toEqual( false );
	} );

	it( "Returns false if there is no auxiliary before the participle.", function() {
		expect( nonDirectParticiplePrecedenceException( "To znalezione skarby nasze.", "znalezione", [ "są" ], [ "nasze" ] ) ).toEqual( false );
	} );
} );
